import { useEffect } from "react";

/**
 * The hero's thunderstorm, framed inside the coming-soon tile: drifting rain,
 * a forked bolt that strikes every few seconds (and whenever the pointer
 * enters the card), the flash that lights the cloud base, and the glow that
 * lingers where the channel hit the ground.
 *
 * @param canvasRef  ref to the <canvas> inside the tile
 * @param hostRef    ref to the card; a pointer entering it triggers a strike
 */
export function useSoonStorm(canvasRef, hostRef) {
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, devicePixelRatio || 1);

    let W = 0;
    let H = 0;
    let sky = null; // pre-rendered cloud base + storm light
    let drops = [];
    let raf = 0;
    let running = false;

    // ---- geometry ----------------------------------------------------------

    const makeSky = () => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      // storm light from above, the same gradient the hero paints
      const g = o.createRadialGradient(W * 0.5, -H * 0.15, 0, W * 0.5, -H * 0.15, H * 1.25);
      g.addColorStop(0, "#2a5f9e");
      g.addColorStop(0.55, "#111628");
      g.addColorStop(1, "#0a0a11");
      o.fillStyle = g;
      o.fillRect(0, 0, W, H);
      // a ragged cloud base hanging into the frame
      const puffs = [
        [0.08, 0.02, 0.36, 0.34],
        [0.42, -0.06, 0.4, 0.3],
        [0.78, 0.0, 0.38, 0.32],
        [0.25, 0.12, 0.3, 0.22],
        [0.62, 0.1, 0.34, 0.24],
      ];
      for (const [px, py, rx, ry] of puffs) {
        const cg = o.createRadialGradient(W * px, H * py, 0, W * px, H * py, W * rx);
        cg.addColorStop(0, "rgba(8,10,20,0.62)");
        cg.addColorStop(0.55, `rgba(10,12,24,${0.3 * ry})`);
        cg.addColorStop(1, "rgba(10,12,24,0)");
        o.fillStyle = cg;
        o.fillRect(0, 0, W, H);
      }
      // haze on the ground so the bolt has something to land in
      const hg = o.createLinearGradient(0, H * 0.7, 0, H);
      hg.addColorStop(0, "rgba(14,18,34,0)");
      hg.addColorStop(1, "rgba(14,18,34,0.55)");
      o.fillStyle = hg;
      o.fillRect(0, 0, W, H);
      return off;
    };

    const resize = () => {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      if (!w || !h) return;
      W = c.width = Math.round(w * dpr);
      H = c.height = Math.round(h * dpr);
      sky = makeSky();
      drops = Array.from({ length: 90 }, () => ({
        x: Math.random() * (W + 40 * dpr),
        y: Math.random() * H,
        l: (5 + Math.random() * 11) * dpr,
        v: (2.6 + Math.random() * 3.2) * dpr,
        a: 0.08 + Math.random() * 0.16,
      }));
      if (!impactX) impactX = W * 0.5;
      if (reduced) drawStill();
    };

    // ---- the bolt ----------------------------------------------------------

    const strokeTo = (g, pts, w, col) => {
      g.beginPath();
      pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
      g.lineWidth = w;
      g.strokeStyle = col;
      g.stroke();
    };

    const makeBolt = () => {
      const segs = [];
      const x0 = W * (0.32 + Math.random() * 0.36);
      const yEnd = H * (0.86 + Math.random() * 0.08);
      // the channel drifts, but leans back towards the centre so it lands in frame
      let x = x0;
      let y = -4 * dpr;
      segs.push([x, y]);
      while (y < yEnd) {
        y += (6 + Math.random() * 13) * dpr;
        const kink = Math.random() < 0.18 ? 2.2 : 1;
        x += (Math.random() - 0.5) * 22 * dpr * kink + (W * 0.5 - x) * 0.04;
        segs.push([x, Math.min(y, yEnd)]);
      }
      const foot = segs[segs.length - 1];

      const branches = [];
      for (let i = 2; i < segs.length - 3; i += 2 + Math.floor(Math.random() * 3)) {
        if (Math.random() < 0.45) continue;
        let [bx, by] = segs[i];
        const dir = Math.random() < 0.5 ? -1 : 1;
        const b = [[bx, by]];
        const n = 3 + Math.floor(Math.random() * 5);
        for (let k = 0; k < n; k++) {
          bx += dir * (4 + Math.random() * 11) * dpr;
          by += (4 + Math.random() * 9) * dpr;
          b.push([bx, by]);
          // twigs off the branch
          if (k > 1 && Math.random() < 0.3) {
            const t = [[bx, by]];
            let tx = bx;
            let ty = by;
            for (let m = 0; m < 2 + Math.random() * 2; m++) {
              tx += dir * (3 + Math.random() * 7) * dpr;
              ty += (3 + Math.random() * 6) * dpr;
              t.push([tx, ty]);
            }
            branches.push({ pts: t, w: 0.55 });
          }
        }
        branches.push({ pts: b, w: 1 });
      }

      // pre-render once with its glow; per frame we only drawImage with alpha
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      o.lineCap = "round";
      o.lineJoin = "round";
      o.globalCompositeOperation = "lighter";
      [[22, 0.05], [12, 0.1], [6, 0.2], [3.2, 0.42]].forEach(([w, a]) =>
        strokeTo(o, segs, w * dpr, `rgba(92,158,255,${a})`)
      );
      strokeTo(o, segs, 1.5 * dpr, "rgba(255,255,255,1)");
      branches.forEach(({ pts, w }) => {
        strokeTo(o, pts, 5 * w * dpr, `rgba(92,158,255,${0.16 * w})`);
        strokeTo(o, pts, 0.9 * w * dpr, `rgba(220,234,255,${0.85 * w})`);
      });
      return { off, x0, foot };
    };

    // ---- state -------------------------------------------------------------

    let bolt = null;
    let pulses = []; // [{ born, life, peak }] — the strike and its re-strikes
    let ghost = 0; // the ionised channel that lingers after the light is gone
    let flash = 0;
    let impact = 0; // brightness of the ground glow
    let impactX = 0;
    let nextBolt = performance.now() + 900 + Math.random() * 1200;
    let lastStrike = -1e9;

    const strike = (now) => {
      bolt = makeBolt();
      pulses = [
        { born: now, life: 260 + Math.random() * 120, peak: 1 },
        { born: now + 110 + Math.random() * 80, life: 220, peak: 0.55 + Math.random() * 0.3 },
        { born: now + 260 + Math.random() * 140, life: 260, peak: 0.35 + Math.random() * 0.25 },
      ];
      if (Math.random() < 0.4) {
        pulses.push({ born: now + 480 + Math.random() * 120, life: 200, peak: 0.25 });
      }
      ghost = 1;
      flash = 1;
      impact = 1;
      impactX = bolt.foot[0];
      lastStrike = now;
      nextBolt = now + 2600 + Math.random() * 3600;
    };

    const boltAlpha = (now) => {
      let a = 0;
      for (const p of pulses) {
        const t = (now - p.born) / p.life;
        if (t < 0 || t > 1) continue;
        // sharp attack, exponential decay, a little flicker on top
        a += p.peak * (t < 0.08 ? t / 0.08 : Math.pow(1 - (t - 0.08) / 0.92, 1.6));
      }
      if (a > 0 && Math.random() < 0.18) a *= 0.55;
      return Math.min(1, a);
    };

    // ---- drawing -----------------------------------------------------------

    const drawSky = (fl) => {
      ctx.drawImage(sky, 0, 0);
      if (fl > 0.01 && bolt) {
        // the cloud base lights up around where the channel left it
        const g = ctx.createRadialGradient(bolt.x0, 0, 0, bolt.x0, 0, H * 0.75);
        g.addColorStop(0, `rgba(120,170,255,${0.42 * fl})`);
        g.addColorStop(0.5, `rgba(70,120,210,${0.14 * fl})`);
        g.addColorStop(1, "rgba(70,120,210,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const drawImpact = (level, x) => {
      const rx = W * (0.26 + 0.14 * level);
      const ry = H * (0.1 + 0.08 * level);
      const y = H * 0.94;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0, `rgba(220,234,255,${0.55 * level})`);
      g.addColorStop(0.35, `rgba(166,200,255,${0.32 * level})`);
      g.addColorStop(1, "rgba(166,200,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawRain = (extra, move) => {
      ctx.lineCap = "round";
      ctx.lineWidth = dpr * 0.9;
      const buckets = [[], [], []];
      for (const d of drops) {
        buckets[d.a < 0.13 ? 0 : d.a < 0.19 ? 1 : 2].push(d);
        if (move) {
          d.y += d.v;
          d.x -= d.v * 0.18;
          if (d.y > H) {
            d.y = -d.l;
            d.x = Math.random() * (W + 40 * dpr);
          }
        }
      }
      [0.09, 0.15, 0.22].forEach((a, i) => {
        if (!buckets[i].length) return;
        ctx.strokeStyle = `rgba(149,191,254,${a + extra})`;
        ctx.beginPath();
        for (const d of buckets[i]) {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.l * 0.18, d.y + d.l);
        }
        ctx.stroke();
      });
    };

    const drawFlash = (fl) => {
      if (fl <= 0.01) return;
      ctx.fillStyle = `rgba(166,200,255,${fl * 0.2})`;
      ctx.fillRect(0, 0, W, H);
    };

    // one frame, no motion: the moment the channel is brightest
    const drawStill = () => {
      bolt = makeBolt();
      drawSky(0.6);
      drawImpact(0.9, bolt.foot[0]);
      drawRain(0, false);
      ctx.drawImage(bolt.off, 0, 0);
      drawFlash(0.35);
    };

    const frame = (now) => {
      if (!running) return;
      if (!sky) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const hover = hostRef.current?.matches(":hover");
      if (now > nextBolt && !pulses.length) strike(now);

      const a = boltAlpha(now);
      // the ground keeps a low ember between strikes, breathing slowly
      const ember = 0.22 + 0.06 * Math.sin(now / 900) + (hover ? 0.1 : 0);
      impact = Math.max(ember, impact * 0.965);

      drawSky(flash);
      drawImpact(impact, impactX);
      drawRain(flash * 0.25, true);

      if (bolt) {
        const visible = Math.max(a, ghost * 0.1);
        if (visible > 0.005) {
          ctx.globalAlpha = visible;
          ctx.drawImage(bolt.off, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      drawFlash(flash);

      flash *= 0.84;
      if (flash < 0.01) flash = 0;
      if (!a) {
        ghost *= 0.94;
        if (pulses.length && now > pulses[pulses.length - 1].born + pulses[pulses.length - 1].life) {
          pulses = [];
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // a pointer entering the card calls the next bolt down at once
    const onEnter = () => {
      if (reduced) return;
      const now = performance.now();
      if (now - lastStrike > 700) strike(now);
    };

    // ---- wiring ------------------------------------------------------------

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      rootMargin: "80px",
    });
    io.observe(c);

    const host = hostRef.current;
    host?.addEventListener("pointerenter", onEnter);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host?.removeEventListener("pointerenter", onEnter);
    };
  }, [canvasRef, hostRef]);
}
