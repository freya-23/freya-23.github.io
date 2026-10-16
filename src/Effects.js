import React, { useEffect, useRef, useState } from "react";

// Small interactive effects shared across the site.
// All of them switch off for touch screens or reduced motion where noted.

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// The cursor leaves a short sparkline behind it: a fading line with data markers.
export function CursorTrail() {
  const ref = useRef(null);
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return undefined;
    const c = ref.current;
    const ctx = c.getContext("2d");
    let pts = [];
    let raf = 0;
    let dpr = 1;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
    };
    size();
    const LIFE = 520;
    const draw = () => {
      raf = 0;
      const now = performance.now();
      pts = pts.filter(p => now - p.t < LIFE);
      ctx.clearRect(0, 0, c.width, c.height);
      if (pts.length > 1) {
        const accent = cssVar("--accent") || "#A51D4A";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < pts.length; i++) {
          const a = 1 - (now - pts[i].t) / LIFE;
          ctx.strokeStyle = accent;
          ctx.globalAlpha = a * 0.55;
          ctx.lineWidth = 1.6 * dpr;
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x * dpr, pts[i - 1].y * dpr);
          ctx.lineTo(pts[i].x * dpr, pts[i].y * dpr);
          ctx.stroke();
          if (i % 5 === 0) {
            ctx.globalAlpha = a * 0.7;
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(pts[i].x * dpr, pts[i].y * dpr, 2.4 * dpr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
      if (pts.length) raf = requestAnimationFrame(draw);
    };
    const onMove = e => {
      if (e.pointerType !== "mouse") return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 80) pts.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className="trail" aria-hidden="true" />;
}

// Cards lean toward the cursor, with a soft highlight where it points.
export function useTilt(max = 7) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return undefined;
    let raf = 0;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
        el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
        el.classList.add("is-tilting");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("is-tilting");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, [max]);
  return ref;
}

// Buttons drift a few pixels toward the cursor when it comes close.
export function Magnetic({ as: Tag = "a", strength = 0.28, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return undefined;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, [strength]);
  return <Tag ref={ref} className={`magnetic ${className}`} {...rest}>{children}</Tag>;
}

// Section headings decode from scrambled characters the first time they
// scroll into view, and again on hover.
const GLYPHS = "01<>/#%=+*ABCDEFXYZ0123456789";
export function DecodeHeading({ text, id, as: Tag = "h2", className = "" }) {
  const [shown, setShown] = useState(text);
  const ref = useRef(null);
  const run = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const el = ref.current;
    const play = () => {
      cancelAnimationFrame(run.current);
      const start = performance.now();
      const dur = 650;
      const tick = now => {
        const t = (now - start) / dur;
        if (t >= 1) { setShown(text); return; }
        setShown(text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          return t * (text.length + 4) > i + 4 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }).join(""));
        run.current = requestAnimationFrame(tick);
      };
      run.current = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    el.addEventListener("pointerenter", play);
    return () => { io.disconnect(); el.removeEventListener("pointerenter", play); cancelAnimationFrame(run.current); };
  }, [text]);
  return (
    <Tag ref={ref} id={id} className={`decode ${className}`} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}
