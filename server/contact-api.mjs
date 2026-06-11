import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

// --- config (env) ----------------------------------------------------------
const PORT = Number(process.env.PORT || 8787);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_TO || "info@raigeki.dev";
// Must be a sender on a domain verified in Resend.
const RESEND_FROM = process.env.RESEND_FROM || "Portfolio <contact@raigeki.dev>";
// Optional: set when the form is served from a different origin than this API.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
// Static site directory (the Vite build output); empty string disables.
const STATIC_DIR = process.env.STATIC_DIR ?? (existsSync("./dist") ? "./dist" : "");

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set – refusing to start.");
  process.exit(1);
}

// --- limits ------------------------------------------------------------------
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT = 5; // requests per window per IP
const RATE_WINDOW_MS = 15 * 60 * 1000;

const hits = new Map(); // ip -> [timestamps]
const rateLimited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 10000) hits.clear(); // crude memory guard
  return list.length > RATE_LIMIT;
};

// --- sanitizing --------------------------------------------------------------
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

// strip control chars (incl. CR/LF – guards subject/header injection);
// the message variant keeps \n and \t so formatting survives
const oneLine = (s) => s.replace(/[\u0000-\u001F\u007F]+/g, " ").trim();
const clean = (s) =>
  s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (body) => {
  if (typeof body !== "object" || body === null) return null;
  let { name, email, message } = body;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string")
    return null;

  name = oneLine(name);
  email = oneLine(email);
  message = clean(message);

  if (!name || name.length > MAX_NAME) return null;
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return null;
  if (!message || message.length > MAX_MESSAGE) return null;

  return { name, email, message };
};

// --- mail --------------------------------------------------------------------
const sendMail = async ({ name, email, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family:monospace">
          <p><b>From:</b> ${safeName} &lt;${safeEmail}&gt;</p>
          <hr/>
          <p style="white-space:pre-wrap">${safeMessage}</p>
        </div>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }
};

// --- static files ------------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".glb": "model/gltf-binary",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
};

const STATIC_ROOT = STATIC_DIR ? path.resolve(STATIC_DIR) : "";

const cacheControl = (urlPath) => {
  if (urlPath.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (/\.(glb|png|webp|jpe?g|svg|ico|woff2?)$/.test(urlPath)) return "public, max-age=86400";
  return "no-cache";
};

const serveStatic = (req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    return res.end();
  }

  let filePath = path.resolve(STATIC_ROOT, "." + urlPath);
  if (filePath !== STATIC_ROOT && !filePath.startsWith(STATIC_ROOT + path.sep)) {
    res.writeHead(403);
    return res.end();
  }

  let st = statSync(filePath, { throwIfNoEntry: false });
  if (st?.isDirectory()) {
    filePath = path.join(filePath, "index.html");
    st = statSync(filePath, { throwIfNoEntry: false });
  }
  if (!st?.isFile()) {
    // SPA fallback
    urlPath = "/index.html";
    filePath = path.join(STATIC_ROOT, "index.html");
    st = statSync(filePath, { throwIfNoEntry: false });
    if (!st?.isFile()) {
      res.writeHead(404);
      return res.end("not found");
    }
  }

  res.writeHead(200, {
    "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
    "Content-Length": st.size,
    "Cache-Control": cacheControl(urlPath),
  });
  if (req.method === "HEAD") return res.end();
  createReadStream(filePath).pipe(res);
};

// --- http ----------------------------------------------------------------------
const json = (res, status, payload) => {
  const headers = { "Content-Type": "application/json" };
  if (ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/healthz") {
    return json(res, 200, { ok: true });
  }
  if (req.method === "OPTIONS" && req.url === "/api/contact") {
    return json(res, 204, {});
  }

  if (req.method === "POST" && req.url === "/api/contact") {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";
    if (rateLimited(ip)) {
      return json(res, 429, { error: "too many requests, try again later" });
    }

    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "invalid request" });
    }

    const data = validate(body);
    if (!data) {
      return json(res, 400, { error: "invalid input" });
    }

    try {
      await sendMail(data);
      return json(res, 200, { ok: true });
    } catch (err) {
      console.error(err.message);
      return json(res, 502, { error: "mail delivery failed" });
    }
  }

  if ((req.method === "GET" || req.method === "HEAD") && STATIC_ROOT) {
    return serveStatic(req, res);
  }

  return json(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(
    `contact-api listening on :${PORT} → ${CONTACT_TO}` +
      (STATIC_ROOT ? ` (serving ${STATIC_ROOT})` : "")
  );
});
