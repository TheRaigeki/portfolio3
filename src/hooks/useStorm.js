import { useEffect } from "react";

import { DEFAULT_STORM, STORM_PRESETS } from "../constants";

/**
 * Canvas thunderstorm behind the hero: drifting rain, an occasional pre-rendered
 * bolt and the screen flash that follows it.
 *
 * @param canvasRef       ref to the <canvas> element
 * @param storm           'subtil' | 'deutlich' | 'wucht'
 * @param contactOpenRef  ref holding the current contact-overlay state; while the
 *                        overlay is open the storm calms down (no bolts, brighter rain)
 */
export function useStorm(canvasRef, storm, contactOpenRef) {
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cfg = STORM_PRESETS[storm] ?? STORM_PRESETS[DEFAULT_STORM];
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    let W;
    let H;
    let drops = [];
    let raf;

    const resize = () => {
      W = c.width = c.offsetWidth * dpr;
      H = c.height = c.offsetHeight * dpr;
      drops = Array.from({ length: cfg.drops }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        l: (10 + Math.random() * 22) * dpr * cfg.speed,
        v: (7 + Math.random() * 9) * dpr * cfg.speed,
        a: (0.08 + Math.random() * 0.18) * cfg.alpha,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let bolt = null;
    let flash = 0;
    let nextBolt = performance.now() + 700;

    const makeBolt = () => {
      const segs = [];
      const yEnd = H * (0.35 + Math.random() * 0.4);
      let x = W * (0.15 + Math.random() * 0.7);
      let y = 0;
      segs.push([x, y]);
      while (y < yEnd) {
        y += (14 + Math.random() * 30) * dpr;
        x += (Math.random() - 0.5) * 60 * dpr;
        segs.push([x, y]);
      }
      const branches = [];
      for (let i = 3; i < segs.length - 2; i += 3 + Math.floor(Math.random() * 4)) {
        if (Math.random() < 0.5) continue;
        let [bx, by] = segs[i];
        const dir = Math.random() < 0.5 ? -1 : 1;
        const b = [[bx, by]];
        for (let k = 0; k < 4 + Math.random() * 5; k++) {
          bx += dir * (8 + Math.random() * 22) * dpr;
          by += (8 + Math.random() * 18) * dpr;
          b.push([bx, by]);
        }
        branches.push(b);
      }
      // pre-render the bolt (with its glow) once; per frame we only drawImage with alpha
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      o.lineCap = "round";
      o.lineJoin = "round";
      o.globalCompositeOperation = "lighter";
      const strokeTo = (g, pts, w, col) => {
        g.beginPath();
        pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
        g.lineWidth = w;
        g.strokeStyle = col;
        g.stroke();
      };
      [[26, 0.05], [14, 0.09], [7, 0.2]].forEach(([w, a]) =>
        strokeTo(o, segs, w * dpr, `rgba(160,140,255,${a})`)
      );
      strokeTo(o, segs, 2 * dpr, "rgba(255,255,255,1)");
      branches.forEach((b) => {
        strokeTo(o, b, 5 * dpr, "rgba(160,140,255,.15)");
        strokeTo(o, b, 1.2 * dpr, "rgba(230,225,255,.85)");
      });
      return { off, born: performance.now(), life: 320 + Math.random() * 260 };
    };

    const buckets = [[], [], []];

    const frame = (now) => {
      if (window.scrollY > c.offsetHeight && !contactOpenRef.current) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const calm = contactOpenRef.current;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.6, -H * 0.2, 0, W * 0.6, -H * 0.2, H * 1.2);
      g.addColorStop(0, `rgba(80,66,140,${cfg.glow + flash * 0.5})`);
      g.addColorStop(1, "rgba(9,9,13,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // rain: one path per alpha bucket instead of one stroke per drop
      ctx.lineCap = "round";
      ctx.lineWidth = dpr;
      buckets.forEach((b) => (b.length = 0));
      for (const d of drops) {
        buckets[d.a < 0.14 ? 0 : d.a < 0.2 ? 1 : 2].push(d);
        if (!reduced) {
          d.y += d.v;
          d.x -= d.v * 0.18;
          if (d.y > H) {
            d.y = -d.l;
            d.x = Math.random() * (W + 100);
          }
        }
      }
      [0.1, 0.17, 0.24].forEach((a, i) => {
        if (!buckets[i].length) return;
        ctx.strokeStyle = `rgba(190,180,255,${a * (calm ? 2.4 : 1) + flash * 0.3})`;
        ctx.beginPath();
        for (const d of buckets[i]) {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.l * 0.18, d.y + d.l);
        }
        ctx.stroke();
      });

      if (!reduced && !calm && now > nextBolt && !bolt) {
        bolt = makeBolt();
        flash = cfg.flash;
        nextBolt = now + cfg.gapBase + Math.random() * cfg.gapRand;
      }
      if (bolt) {
        const t = (now - bolt.born) / bolt.life;
        if (t > 1) bolt = null;
        else {
          ctx.globalAlpha = (1 - t) * (Math.random() < 0.25 ? 0.35 : 1);
          ctx.drawImage(bolt.off, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(201,191,255,${flash * 0.18})`;
        ctx.fillRect(0, 0, W, H);
        flash *= 0.86;
        if (flash < 0.01) flash = 0;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, storm, contactOpenRef]);
}
