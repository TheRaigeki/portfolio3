import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

import nodemailer from "nodemailer";

/**
 * Serves the built site and takes the contact form. One process instead of
 * nginx plus a mailer, because the only dynamic thing this site has is a
 * single POST.
 */

const PORT = Number(process.env.PORT || 80);
const ROOT = resolve(process.env.STATIC_ROOT || "dist");

const CONTACT_TO = process.env.CONTACT_TO || "robin@raigeki.dev";
const CONTACT_FROM = process.env.CONTACT_FROM || "";
const CONTACT_SUBJECT = process.env.CONTACT_SUBJECT || "Kontaktformular – raigeki.dev";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
  ".pdf": "application/pdf",
};
/** Only these compress usefully; images and fonts are already compressed. */
const COMPRESSIBLE = new Set([
  ".html", ".js", ".css", ".json", ".txt", ".xml", ".svg", ".webmanifest",
]);

// ---------------------------------------------------------------- mail

let transport = null;
function mailer() {
  if (transport) return transport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 587);
  transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 starts plain and upgrades via STARTTLS
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transport;
}

/** Crude per-IP throttle. In memory on purpose: one small container, low volume. */
const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
function rateLimited(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (seen.length >= MAX_PER_WINDOW) return true;
  seen.push(now);
  hits.set(ip, seen);
  if (hits.size > 5000) hits.clear();
  return false;
}

const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function readBody(req, limit = 32 * 1024) {
  return new Promise((res, rej) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        rej(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => res(Buffer.concat(chunks).toString("utf8")));
    req.on("error", rej);
  });
}

const json = (res, code, obj) => {
  const b = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(b),
  });
  res.end(b);
};

async function handleContact(req, res) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "?";

  let data;
  try {
    data = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { ok: false });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  const botcheck = String(data.botcheck ?? "").trim();

  // Honeypot: the field is off-screen, so a human never fills it. Answer 200
  // anyway — a bot told "rejected" just tries again with a different shape.
  if (botcheck) {
    console.log(`[contact] honeypot tripped from ${ip}`);
    return json(res, 200, { ok: true });
  }

  if (name.length < 2 || !looksLikeEmail(email) || message.length < 5) {
    return json(res, 422, { ok: false });
  }
  if (rateLimited(ip)) {
    console.warn(`[contact] rate limited ${ip}`);
    return json(res, 429, { ok: false });
  }

  const tx = mailer();
  if (!tx || !CONTACT_FROM) {
    console.error("[contact] SMTP not configured — set SMTP_* and CONTACT_FROM");
    return json(res, 500, { ok: false });
  }

  try {
    await tx.sendMail({
      from: { name: `raigeki.dev – ${name}`, address: CONTACT_FROM },
      to: CONTACT_TO,
      // so hitting reply in the inbox answers the visitor, not the server
      replyTo: { name, address: email },
      subject: CONTACT_SUBJECT,
      text: `${message}\n\n—\n${name}\n${email}\n`,
    });
    console.log(`[contact] sent, from ${email}`);
    return json(res, 200, { ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err?.message || err);
    return json(res, 502, { ok: false });
  }
}

// ---------------------------------------------------------------- static

async function resolveFile(urlPath) {
  // strip query/hash, decode, and refuse anything climbing out of ROOT
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(
    /^(\.\.[/\\])+/,
    ""
  );
  let file = join(ROOT, clean);
  if (!file.startsWith(ROOT)) return null;

  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, "index.html");
  } catch {
    // no such path — the SPA owns every route that is not a file
    if (extname(clean)) return null;
    file = join(ROOT, "index.html");
  }
  try {
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

async function serveStatic(req, res) {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Not found");
  }

  const ext = extname(file).toLowerCase();
  const headers = {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    // Vite fingerprints everything under /assets/, so it can be cached hard
    "Cache-Control": req.url.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  };

  const wantsGzip =
    COMPRESSIBLE.has(ext) &&
    (req.headers["accept-encoding"] || "").includes("gzip");

  // HEAD must advertise what GET would answer with, minus the body. Length is
  // left out when gzipping: we would have to compress just to count the bytes.
  if (req.method === "HEAD") {
    res.writeHead(
      200,
      wantsGzip
        ? { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" }
        : headers
    );
    return res.end();
  }

  try {
    if (wantsGzip) {
      res.writeHead(200, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
      await pipeline(createReadStream(file), createGzip(), res);
    } else {
      const s = await stat(file);
      res.writeHead(200, { ...headers, "Content-Length": s.size });
      await pipeline(createReadStream(file), res);
    }
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error");
    }
  }
}

// ---------------------------------------------------------------- server

createServer(async (req, res) => {
  try {
    if (req.url?.split("?")[0] === "/api/contact") {
      if (req.method !== "POST") {
        res.writeHead(405, { Allow: "POST" });
        return res.end();
      }
      return await handleContact(req, res);
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      return res.end();
    }
    await serveStatic(req, res);
  } catch (err) {
    console.error("[server]", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error");
    }
  }
}).listen(PORT, () => {
  console.log(`raigeki.dev on :${PORT} — serving ${ROOT}`);
  if (!mailer() || !CONTACT_FROM) {
    console.warn("[contact] SMTP not configured; the form will report failures");
  }
});
