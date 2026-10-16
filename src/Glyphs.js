import React from "react";

// Line-art thumbnails, one per project. Each sketches what the project
// actually does. Strokes use the theme accent; hovering a project card
// redraws the lines (see .glyph .d in styles.css).

const D = props => <path className="d" pathLength="1" {...props} />;
const L = ({ x1, y1, x2, y2, ...rest }) => <line className="d" pathLength="1" x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />;
const pts = arr => arr.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

function Ecrie() {
  const price = [[12, 62], [26, 58], [38, 64], [52, 48], [66, 52], [80, 40], [94, 46], [108, 30], [122, 36], [136, 26], [150, 34], [164, 22], [178, 28], [190, 18]];
  const bars = [6, 10, -5, 14, 8, -9, 12, 18, -6, 9, 15, -4, 11, 20];
  return (
    <>
      {[20, 45, 70].map(y => <line key={y} className="faint" x1="8" y1={y} x2="192" y2={y} />)}
      <D d={pts(price)} className="d strong" />
      <line className="faint" x1="8" y1="100" x2="192" y2="100" />
      {bars.map((v, i) => (
        <rect key={i} className={v > 0 ? "fill" : "outline"} x={14 + i * 13} y={v > 0 ? 100 - v : 100} width="7" height={Math.abs(v)} rx="1" />
      ))}
    </>
  );
}

function Graph() {
  const n = [[30, 30], [72, 18], [112, 38], [162, 24], [48, 84], [94, 102], [146, 92], [180, 64], [102, 66]];
  const e = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 8], [8, 2], [8, 5], [5, 6], [6, 7], [7, 3], [8, 6], [1, 8], [4, 5], [2, 7]];
  return (
    <>
      {e.map(([a, b], i) => <L key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} />)}
      {n.map(([x, y], i) => <circle key={i} className={i === 8 ? "fill" : "node"} cx={x} cy={y} r={i === 8 ? 8 : 4.5} />)}
    </>
  );
}

function PayGap() {
  const left = [24, 40, 56, 74, 96];
  const right = [34, 64, 50, 102, 82];
  return (
    <>
      <line className="faint" x1="44" y1="14" x2="44" y2="112" />
      <line className="faint" x1="156" y1="14" x2="156" y2="112" />
      {left.map((y, i) => (
        <g key={i}>
          <L x1={44} y1={y} x2={156} y2={right[i]} className={i === 3 ? "d strong" : "d"} />
          <circle className={i === 3 ? "fill" : "node"} cx="44" cy={y} r="3.5" />
          <circle className={i === 3 ? "fill" : "node"} cx="156" cy={right[i]} r="3.5" />
        </g>
      ))}
    </>
  );
}

function Nids() {
  const cloud = [[62, 58], [70, 66], [78, 52], [86, 70], [74, 78], [92, 60], [66, 72], [84, 48], [98, 72], [58, 66], [80, 62], [90, 82], [72, 46], [100, 56], [64, 50], [88, 66], [76, 70], [94, 50], [68, 60], [82, 76], [104, 64], [60, 76], [96, 80], [86, 56]];
  const out = [[166, 26], [176, 92], [32, 104]];
  return (
    <>
      {cloud.map(([x, y], i) => <circle key={i} className="dot" cx={x} cy={y} r="2.6" />)}
      {out.map(([x, y], i) => (
        <g key={i}>
          <circle className="fill" cx={x} cy={y} r="3.5" />
          <circle className="d ring" pathLength="1" cx={x} cy={y} r="10" />
        </g>
      ))}
    </>
  );
}

function Alz() {
  const vals = [72, -48, 40, -30, 24, -16, 9];
  return (
    <>
      <line className="faint" x1="100" y1="10" x2="100" y2="116" />
      {vals.map((v, i) => (
        <rect key={i} className={v > 0 ? "fill" : "outline"} x={v > 0 ? 100 : 100 + v} y={14 + i * 14} width={Math.abs(v)} height="9" rx="1.5" />
      ))}
    </>
  );
}

function Books() {
  const users = [26, 52, 78, 104];
  const books = [18, 40, 62, 84, 106];
  const links = [[0, 0], [0, 2], [1, 1], [1, 2], [2, 3], [2, 1], [3, 4], [3, 3], [1, 4]];
  return (
    <>
      {links.map(([u, b], i) => <L key={i} x1={34} y1={users[u]} x2={156} y2={books[b] + 5} className={i === 3 ? "d strong" : "d"} />)}
      {users.map((y, i) => <circle key={i} className={i === 1 ? "fill" : "node"} cx="28" cy={y} r="6" />)}
      {books.map((y, i) => <rect key={i} className={i === 2 ? "fill" : "outline"} x="158" y={y} width="22" height="11" rx="1.5" />)}
    </>
  );
}

function Sales() {
  const hist = [[10, 84], [22, 78], [34, 88], [46, 70], [58, 74], [70, 60], [82, 66], [94, 52], [106, 58], [120, 46]];
  return (
    <>
      {[30, 60, 90].map(y => <line key={y} className="faint" x1="8" y1={y} x2="192" y2={y} />)}
      <path className="cone" d="M120 46 L190 18 L190 66 Z" />
      <D d={pts(hist)} className="d strong" />
      <path className="d dash" pathLength="1" d="M120 46 L138 40 L156 36 L174 32 L190 42" />
      <line className="faint" x1="120" y1="10" x2="120" y2="112" />
    </>
  );
}

function Digest() {
  return (
    <>
      <rect className="outline" x="54" y="16" width="112" height="70" rx="6" />
      <rect className="outline" x="44" y="26" width="112" height="70" rx="6" />
      <rect className="card" x="34" y="36" width="112" height="70" rx="6" />
      <L x1={46} y1={52} x2={118} y2={52} className="d strong" />
      <L x1={46} y1={64} x2={132} y2={64} />
      <L x1={46} y1={76} x2={106} y2={76} />
      <D d="M46 94 L62 88 L74 92 L88 82 L100 86 L114 78 L130 84" />
      <circle className="fill" cx="176" cy="24" r="8" />
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2;
        return <L key={i} x1={176 + Math.cos(a) * 12} y1={24 + Math.sin(a) * 12} x2={176 + Math.cos(a) * 17} y2={24 + Math.sin(a) * 17} />;
      })}
    </>
  );
}

function Scraper() {
  const rows = [48, 64, 80, 96];
  return (
    <>
      <rect className="outline" x="20" y="16" width="160" height="96" rx="4" />
      <line className="faint" x1="20" y1="32" x2="180" y2="32" />
      {rows.map(y => <line key={y} className="faint" x1="20" y1={y} x2="180" y2={y} />)}
      <line className="faint" x1="76" y1="16" x2="76" y2="112" />
      <line className="faint" x1="128" y1="16" x2="128" y2="112" />
      {[40, 56, 72].map((y, i) => (
        <g key={y}>
          <L x1={28} y1={y} x2={[62, 54, 66][i]} y2={y} className="d strong" />
          <L x1={84} y1={y} x2={[118, 110, 120][i]} y2={y} />
          <L x1={136} y1={y} x2={[166, 172, 160][i]} y2={y} />
        </g>
      ))}
      <rect className="fill caret" x="28" y="84" width="3" height="9" />
    </>
  );
}

function Macro() {
  const messy = [[16, 24, 70], [16, 34, 52], [30, 46, 78], [16, 58, 44], [22, 70, 74], [16, 82, 60], [28, 94, 82], [16, 106, 50]];
  const bars = [56, 34, 46, 22];
  return (
    <>
      {messy.map(([x, y, x2], i) => <L key={i} x1={x} y1={y} x2={x2} y2={y} className={i % 3 === 1 ? "d dash" : "d"} />)}
      <D d="M94 64 L116 64 M108 56 L116 64 L108 72" className="d strong" />
      {bars.map((w, i) => <rect key={i} className={i === 0 ? "fill" : "outline"} x="128" y={30 + i * 20} width={w} height="10" rx="1.5" />)}
    </>
  );
}

const MAP = { ecrie: Ecrie, graph: Graph, paygap: PayGap, nids: Nids, alz: Alz, books: Books, sales: Sales, digest: Digest, scraper: Scraper, macro: Macro };

export default function Glyph({ name, className = "" }) {
  const C = MAP[name];
  if (!C) return null;
  return (
    <svg className={`glyph ${className}`} viewBox="0 0 200 125" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <C />
    </svg>
  );
}
