import React, { useEffect, useRef } from "react";
import { LAND } from "./landDots";
import { cssVar, reducedMotion } from "./Effects";

// A dotted globe with the route from Ahmedabad (BS, 2024) to Tempe (MS, 2026).
// Drag to spin it; after a pause it drifts back to show the whole route.

const D2R = Math.PI / 180;
const vec = (lon, lat) => [Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.cos(lat * D2R) * Math.sin(lon * D2R), Math.sin(lat * D2R)];
const norm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const CITIES = [
  { name: "Ahmedabad", note: "BS, 2024", lon: 72.57, lat: 23.02 },
  { name: "Tempe", note: "MS, 2026", lon: -111.94, lat: 33.43 },
];

function slerp(a, b, t) {
  const w = Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  const s = Math.sin(w);
  const k1 = Math.sin((1 - t) * w) / s, k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

// Home view looks at the middle of the route so both cities are on screen.
const A = vec(CITIES[0].lon, CITIES[0].lat);
const B = vec(CITIES[1].lon, CITIES[1].lat);
const MID = norm([A[0] + B[0], A[1] + B[1], A[2] + B[2]]);
const HOME = { lon: Math.atan2(MID[1], MID[0]) / D2R, lat: Math.asin(MID[2]) / D2R - 8 };
const ARC = Array.from({ length: 73 }, (_, i) => {
  const t = i / 72;
  const p = slerp(A, B, t);
  const lift = 1 + 0.16 * Math.sin(Math.PI * t);
  return [p[0] * lift, p[1] * lift, p[2] * lift];
});
const DOTS = [];
for (let i = 0; i < LAND.length; i += 2) DOTS.push(vec(LAND[i], LAND[i + 1]));

export default function Globe() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduce = reducedMotion();
    const view = { lon: HOME.lon + 35, lat: HOME.lat, vlon: 0, vlat: 0 };
    let size = 0, dpr = 1, raf = 0, visible = true, dragging = false, last = null, idleSince = performance.now();
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = host.clientWidth;
      canvas.width = canvas.height = size * dpr;
      canvas.style.width = canvas.style.height = `${size}px`;
      draw(performance.now());
    };

    function basis() {
      const l = view.lon * D2R, p = view.lat * D2R;
      const f = [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
      const e = [-Math.sin(l), Math.cos(l), 0];
      const n = [-Math.sin(p) * Math.cos(l), -Math.sin(p) * Math.sin(l), Math.cos(p)];
      return { f, e, n };
    }

    function draw(now) {
      if (!size) return;
      const { f, e, n } = basis();
      const R = size * 0.36, cx = size / 2, cy = size / 2;
      const accent = cssVar("--accent"), text = cssVar("--text"), muted = cssVar("--muted"), soft = cssVar("--bg-soft"), bg = cssVar("--bg");
      const font = cssVar("--font-body") || "monospace";
      const head = cssVar("--font-heading") || "serif";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // sphere
      ctx.fillStyle = soft;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = accent; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
      ctx.stroke(); ctx.globalAlpha = 1;

      // land
      ctx.fillStyle = accent;
      for (let i = 0; i < DOTS.length; i++) {
        const p = DOTS[i];
        const z = dot(p, f);
        if (z <= 0) continue;
        ctx.globalAlpha = 0.18 + 0.62 * z;
        ctx.beginPath();
        ctx.arc(cx + R * dot(p, e), cy - R * dot(p, n), 0.7 + 1.0 * z * (size / 420), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // route arc, hidden where it passes behind the globe
      const proj = p => {
        const x = dot(p, e), y = dot(p, n), z = dot(p, f);
        return { x: cx + R * x, y: cy - R * y, show: z > 0 || x * x + y * y > 1 };
      };
      ctx.strokeStyle = accent; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      ctx.beginPath();
      let pen = false;
      ARC.forEach(p => {
        const q = proj(p);
        if (q.show) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false;
      });
      ctx.stroke();

      // traveller along the route
      if (!reduce) {
        // The first animation frame can be stamped a hair before `start`, so clamp at zero.
        const t = (Math.max(0, now - start) / 3600) % 1;
        const q = proj(ARC[Math.min(ARC.length - 1, Math.round(t * (ARC.length - 1)))]);
        if (q.show) {
          ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(q.x, q.y, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // cities
      CITIES.forEach(c => {
        const p = vec(c.lon, c.lat);
        if (dot(p, f) <= 0.02) return;
        const x = cx + R * dot(p, e), y = cy - R * dot(p, n);
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        const fs = Math.max(11, size / 34);
        ctx.font = `700 ${fs + 2}px ${head}`;
        const wName = ctx.measureText(c.name).width;
        ctx.font = `400 ${fs - 1}px ${font}`;
        const wNote = ctx.measureText(c.note).width;
        const wMax = Math.max(wName, wNote);
        // Put the label on whichever side has room, and keep it inside the canvas.
        let lx = x > cx ? x + 12 : x - 12 - wMax;
        lx = Math.max(6, Math.min(size - wMax - 6, lx));
        ctx.textAlign = "left";
        ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = bg;
        ctx.font = `700 ${fs + 2}px ${head}`;
        ctx.strokeText(c.name, lx, y + 1); ctx.fillStyle = text; ctx.fillText(c.name, lx, y + 1);
        ctx.font = `400 ${fs - 1}px ${font}`;
        ctx.strokeText(c.note, lx, y + fs + 3); ctx.fillStyle = muted; ctx.fillText(c.note, lx, y + fs + 3);
      });
    }

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!dragging) {
        view.lon += view.vlon; view.lat += view.vlat;
        view.vlon *= 0.94; view.vlat *= 0.94;
        if (now - idleSince > 1800) {
          const k = reduce ? 1 : 0.035;
          let d = ((HOME.lon - view.lon + 540) % 360) - 180;
          view.lon += d * k; view.lat += (HOME.lat - view.lat) * k;
        }
      }
      view.lat = Math.max(-70, Math.min(85, view.lat));
      draw(now);
      raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onDown = e => { dragging = true; last = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); kick(); };
    const onMove = e => {
      if (!dragging) return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      view.vlon = -dx * 0.35; view.vlat = dy * 0.3;
      view.lon += view.vlon; view.lat += view.vlat;
      idleSince = performance.now();
    };
    const onUp = () => { dragging = false; idleSince = performance.now(); };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); });
    io.observe(host);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);
    resize();
    kick();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);
  return (
    <figure className="globe">
      <div className="globe__stage">
        <canvas ref={ref} role="img" aria-label="Globe showing the route from Ahmedabad, India, where I did my BS in 2024, to Tempe, Arizona, where I did my MS in 2026" />
      </div>
      <figcaption>From Ahmedabad to Tempe. Drag to spin the globe.</figcaption>
    </figure>
  );
}
