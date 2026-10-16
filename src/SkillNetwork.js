import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, SKILLS, NETWORK_EXTRA } from "./data";
import { reducedMotion } from "./Effects";

// A force-directed network linking every skill to the projects and jobs
// where it was used. Hover or tap a dot to trace its links; drag to rearrange.

function buildGraph() {
  const nodes = [];
  PROJECTS.forEach(p => nodes.push({ id: p.slug, label: p.short || p.title, kind: "project", href: `#work/${p.slug}`, title: p.title }));
  NETWORK_EXTRA.forEach(x => nodes.push({ ...x, title: x.label }));
  const links = [];
  Object.entries(SKILLS).forEach(([cat, list]) => list.forEach(s => {
    const id = `s:${s.name}`;
    nodes.push({ id, label: s.name, kind: "skill", level: s.level, cat, used: s.used, title: s.name });
    (s.links || []).forEach(t => links.push({ s: id, t }));
  }));
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const adj = new Map(nodes.map(n => [n.id, new Set()]));
  const L = links.filter(l => index.has(l.t)).map(l => {
    adj.get(l.s).add(l.t); adj.get(l.t).add(l.s);
    return { s: index.get(l.s), t: index.get(l.t) };
  });
  nodes.forEach(n => {
    const deg = adj.get(n.id).size;
    n.r = n.kind === "skill" ? Math.min(11, 4.5 + deg * 1.1) : 9 + Math.min(4, deg * 0.35);
    n.lw = n.label.length * (n.kind === "skill" ? 6.7 : 7.4);
  });
  return { nodes, links: L, adj, index };
}

function layout(g, w, h, pos) {
  const cx = w / 2, cy = h / 2;
  const work = g.nodes.map((n, i) => (n.kind === "skill" ? -1 : i)).filter(i => i >= 0);
  if (!pos.length) {
    work.forEach((i, k) => {
      const a = (k / work.length) * Math.PI * 2;
      pos[i] = { x: cx + Math.cos(a) * w * 0.34, y: cy + Math.sin(a) * h * 0.36, vx: 0, vy: 0 };
    });
    g.nodes.forEach((n, i) => {
      if (n.kind !== "skill") return;
      const nb = [...g.adj.get(n.id)].map(id => pos[g.index.get(id)]).filter(Boolean);
      const a = i * 2.39996;
      const bx = nb.length ? nb.reduce((s, p) => s + p.x, 0) / nb.length : cx;
      const by = nb.length ? nb.reduce((s, p) => s + p.y, 0) / nb.length : cy;
      pos[i] = { x: bx + Math.cos(a) * 26, y: by + Math.sin(a) * 26, vx: 0, vy: 0 };
    });
  }
  return pos;
}

function tick(g, pos, w, h, alpha, wide) {
  const N = pos.length;
  const C = wide ? 2600 : 1200;
  const reach = wide ? 420 : 300;
  for (let i = 0; i < N; i++) {
    const a = pos[i], ra = g.nodes[i].r;
    for (let j = i + 1; j < N; j++) {
      const b = pos[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 0.01) { dx = 0.1; dy = 0.1; d2 = 0.02; }
      const d = Math.sqrt(d2);
      if (d < reach) {
        const qa = g.nodes[i].kind === "skill" ? 1 : 2.2, qb = g.nodes[j].kind === "skill" ? 1 : 2.2;
        const F = (C * qa * qb * alpha) / d2;
        const ux = dx / d, uy = dy / d;
        a.vx -= ux * F; a.vy -= uy * F; b.vx += ux * F; b.vy += uy * F;
      }
      // Keep labels on the same line from running into each other.
      const ni = g.nodes[i], nj = g.nodes[j];
      const ady = Math.abs(dy);
      if (ady < 17 && ((wide || ni.kind !== "skill") || (wide || nj.kind !== "skill"))) {
        const hit = (dx > 0 && dx < ra + 10 + ni.lw) || (dx < 0 && -dx < nj.r + 10 + nj.lw);
        if (hit) {
          const k = (17 - ady) * 0.16;
          const sgn = dy >= 0 ? 1 : -1;
          a.y -= sgn * k; b.y += sgn * k;
        }
      }
      const min = ra + g.nodes[j].r + 14;
      if (d < min) {
        const push = ((min - d) / d) * 0.5;
        a.x -= dx * push; a.y -= dy * push; b.x += dx * push; b.y += dy * push;
      }
    }
  }
  const len = wide ? 96 : 62;
  g.links.forEach(l => {
    const a = pos[l.s], b = pos[l.t];
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const k = ((d - len) / d) * 0.09 * alpha;
    a.vx += dx * k; a.vy += dy * k; b.vx -= dx * k * 0.35; b.vy -= dy * k * 0.35;
  });
  for (let i = 0; i < N; i++) {
    const p = pos[i], n = g.nodes[i];
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) { p.x = w / 2 + Math.cos(i) * 60; p.y = h / 2 + Math.sin(i) * 60; p.vx = p.vy = 0; }
    if (p.fx != null) { p.x = p.fx; p.y = p.fy; p.vx = p.vy = 0; continue; }
    p.vx += (w / 2 - p.x) * 0.004 * alpha;
    p.vy += (h / 2 - p.y) * 0.009 * alpha;
    p.vx *= 0.58; p.vy *= 0.58;
    p.x += p.vx; p.y += p.vy;
    const pad = n.r + 6;
    p.x = Math.max(pad, Math.min(w - pad, p.x));
    p.y = Math.max(pad + 4, Math.min(h - pad - 4, p.y));
  }
}

export default function SkillNetwork({ category }) {
  const g = useMemo(buildGraph, []);
  const wrap = useRef(null);
  const pos = useRef([]);
  const nodeEls = useRef([]);
  const linkEls = useRef([]);
  const labelEls = useRef([]);
  const sim = useRef({ alpha: 0, raf: 0, drag: null });
  const [dims, setDims] = useState(null);
  const dimsRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  const sizeFor = w => ({ w, h: w < 560 ? 540 : Math.round(Math.min(620, Math.max(480, w * 0.58))) });

  // Measure, then settle the layout before the first paint so the page is complete at rest.
  useLayoutEffect(() => {
    const el = wrap.current;
    const measure = () => {
      // Skip while the panel is hidden or collapsed; a zero width would wreck the layout.
      if (el.clientWidth < 120) return;
      const d = sizeFor(el.clientWidth);
      const prev = dimsRef.current;
      if (prev && prev.w === d.w) return;
      if (prev && pos.current.length) pos.current.forEach(p => { p.x *= d.w / prev.w; p.y *= d.h / prev.h; });
      layout(g, d.w, d.h, pos.current);
      for (let k = 0, a = 1; k < (prev ? 120 : 320); k++, a *= 0.983) tick(g, pos.current, d.w, d.h, a, d.w >= 640);
      dimsRef.current = d;
      setDims(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [g]);

  const paint = useCallback(() => {
    pos.current.forEach((p, i) => {
      const t = `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`;
      const el = nodeEls.current[i]; if (el) el.setAttribute("transform", t);
      const lb = labelEls.current[i]; if (lb) lb.setAttribute("transform", t);
    });
    g.links.forEach((l, i) => {
      const el = linkEls.current[i]; if (!el) return;
      const a = pos.current[l.s], b = pos.current[l.t];
      el.setAttribute("x1", a.x.toFixed(1)); el.setAttribute("y1", a.y.toFixed(1));
      el.setAttribute("x2", b.x.toFixed(1)); el.setAttribute("y2", b.y.toFixed(1));
    });
  }, [g]);

  const run = useCallback(() => {
    const s = sim.current;
    if (s.raf || !dims) return;
    const step = () => {
      tick(g, pos.current, dims.w, dims.h, s.alpha, dims.w >= 640);
      s.alpha *= 0.97;
      paint();
      if (s.alpha > 0.008 || s.drag) s.raf = requestAnimationFrame(step); else s.raf = 0;
    };
    s.raf = requestAnimationFrame(step);
  }, [dims, g, paint]);

  // A small one-time shake when the network first scrolls into view.
  useEffect(() => {
    if (!dims || reducedMotion()) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      pos.current.forEach((p, i) => { p.vx += Math.cos(i * 2.4) * 6; p.vy += Math.sin(i * 2.4) * 6; });
      sim.current.alpha = 0.35;
      run();
    }, { threshold: 0.35 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [dims, run]);

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  const toSvg = e => {
    const r = wrap.current.querySelector("svg").getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * dims.w, y: ((e.clientY - r.top) / r.height) * dims.h };
  };
  const onNodeDown = i => e => {
    e.preventDefault();
    e.currentTarget.ownerSVGElement.setPointerCapture(e.pointerId);
    const p = toSvg(e);
    sim.current.drag = { i, sx: p.x, sy: p.y, moved: false };
  };
  const onSvgMove = e => {
    const d = sim.current.drag;
    if (!d) return;
    const p = toSvg(e);
    if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) < 4) return;
    d.moved = true;
    const n = pos.current[d.i];
    n.fx = p.x; n.fy = p.y;
    sim.current.alpha = Math.max(sim.current.alpha, 0.3);
    run();
  };
  const onSvgUp = () => {
    const d = sim.current.drag;
    if (!d) return;
    const n = pos.current[d.i];
    n.fx = n.fy = null;
    sim.current.drag = null;
    if (!d.moved) {
      const id = g.nodes[d.i].id;
      setSelected(s => (s === id ? null : id));
    }
  };

  const active = hover || selected;
  const near = active ? g.adj.get(active) : null;
  const wide = dims && dims.w >= 640;
  const activeNode = active ? g.nodes[g.index.get(active)] : null;
  const neighbors = active ? [...near].map(id => g.nodes[g.index.get(id)]) : [];

  return (
    <div className="net">
      <div className="net__stage" ref={wrap} style={{ height: dims ? dims.h : 520 }}>
        {dims && (
          <svg viewBox={`0 0 ${dims.w} ${dims.h}`} width={dims.w} height={dims.h}
            onPointerMove={onSvgMove} onPointerUp={onSvgUp} onPointerCancel={onSvgUp}
            role="group" aria-label="Network of skills and the projects and jobs where they were used">
            <g className="net__links">
              {g.links.map((l, i) => {
                const a = pos.current[l.s], b = pos.current[l.t];
                const on = active && (g.nodes[l.s].id === active || g.nodes[l.t].id === active);
                return <line key={i} ref={el => (linkEls.current[i] = el)} className={`net__link${on ? " is-on" : ""}${active && !on ? " is-dim" : ""}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
              })}
            </g>
            <g className="net__labels" aria-hidden="true">
              {g.nodes.map((n, i) => {
                const p = pos.current[i];
                const isActive = n.id === active;
                const isNear = near && near.has(n.id);
                const catOff = category !== "All" && n.kind === "skill" && n.cat !== category;
                const dim = (active && !isActive && !isNear) || (!active && catOff);
                if (!(n.kind !== "skill" || wide || isActive || isNear)) return null;
                const leftLabel = p.x > dims.w - 120;
                return (
                  <g key={n.id} ref={el => (labelEls.current[i] = el)} transform={`translate(${p.x},${p.y})`}
                    className={`net__lab net__lab--${n.kind}${isActive || isNear ? " is-on" : ""}${dim ? " is-dim" : ""}`}>
                    <text className="net__label" x={leftLabel ? -(n.r + 6) : n.r + 6} y="4" textAnchor={leftLabel ? "end" : "start"}>{n.label}</text>
                  </g>
                );
              })}
            </g>
            <g className="net__nodes">
              {g.nodes.map((n, i) => {
                const p = pos.current[i];
                const isActive = n.id === active;
                const isNear = near && near.has(n.id);
                const catOff = category !== "All" && n.kind === "skill" && n.cat !== category;
                const dim = (active && !isActive && !isNear) || (!active && catOff);
                const level = n.level ? ` ${n.level.toLowerCase()}` : "";
                return (
                  <g key={n.id} ref={el => (nodeEls.current[i] = el)} transform={`translate(${p.x},${p.y})`}
                    className={`net__node net__node--${n.kind}${level ? ` lvl-${n.level.toLowerCase()}` : ""}${isActive ? " is-active" : ""}${isNear ? " is-near" : ""}${dim ? " is-dim" : ""}`}
                    tabIndex={0} role="button" aria-pressed={selected === n.id}
                    aria-label={n.kind === "skill" ? `${n.label}, ${n.level}` : n.title}
                    onPointerDown={onNodeDown(i)}
                    onPointerEnter={e => { if (e.pointerType === "mouse") setHover(n.id); }}
                    onPointerLeave={e => { if (e.pointerType === "mouse") setHover(null); }}
                    onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(s => (s === n.id ? null : n.id)); } }}>
                    <circle className="net__hit" r={n.r + 5} />
                    {n.kind === "skill" ? <circle className="net__dot" r={n.r} /> : <rect className="net__dot" x={-n.r} y={-n.r} width={n.r * 2} height={n.r * 2} rx="3" />}
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>
      <p className="net__legend" aria-hidden="true">
        <span><i className="k-project" />Project</span>
        <span><i className="k-job" />Job</span>
        <span><i className="k-course" />Coursework</span>
        <span><i className="k-adv" />Advanced skill</span>
        <span><i className="k-int" />Intermediate</span>
        <span><i className="k-fam" />Familiar</span>
      </p>
      <div className="net__detail" aria-live="polite">
        {!activeNode && <p className="net__hint">Hover or tap any dot to trace where a skill was used. Drag dots to rearrange the map.</p>}
        {activeNode && activeNode.kind === "skill" && (
          <>
            <p><strong>{activeNode.label}</strong> <span className="net__lvl">{activeNode.level}</span></p>
            <p className="net__used">{activeNode.used}</p>
            {neighbors.length > 0 && (
              <ul className="net__links-list">{neighbors.map(nb => <li key={nb.id}><a href={nb.href}>{nb.title}</a></li>)}</ul>
            )}
          </>
        )}
        {activeNode && activeNode.kind !== "skill" && (
          <>
            <p><strong>{activeNode.title}</strong> <a className="textlink" href={activeNode.href}>{activeNode.kind === "project" && activeNode.id !== "site" ? "Open project" : "Go to section"}</a></p>
            <p className="net__used">{neighbors.map(nb => nb.label).join(", ")}</p>
          </>
        )}
      </div>
    </div>
  );
}
