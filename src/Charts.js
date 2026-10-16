import React, { useState } from "react";

// Interactive charts shown inside project pages. Numbers come from the
// project READMEs and reports; captions name the source.

const PHX = [
  { key: "income", label: "Median family income", desert: 45584, served: 74250, fmt: v => `$${v.toLocaleString("en-US")}`, note: "Food desert tracts earn 39% less." },
  { key: "poverty", label: "Median poverty rate", desert: 25.2, served: 10.0, fmt: v => `${v.toFixed(1)}%`, note: "Food desert tracts have 2.5 times the poverty rate." },
  { key: "tracts", label: "Census tracts", desert: 97, served: 816, fmt: v => v.toLocaleString("en-US"), note: "About 1 in 10 matched tracts is a food desert." },
];

export function PhoenixChart() {
  const [key, setKey] = useState("income");
  const [hover, setHover] = useState(null);
  const m = PHX.find(x => x.key === key);
  const max = Math.max(m.desert, m.served);
  const rows = [
    { id: "desert", label: "Food desert tracts", value: m.desert },
    { id: "served", label: "Served tracts", value: m.served },
  ];
  return (
    <figure className="chart">
      <div className="chart__head">
        <figcaption className="chart__title">Food desert tracts compared with served tracts</figcaption>
        <div className="chips chips--small" role="group" aria-label="Measure">
          {PHX.map(x => <button key={x.key} className="chip" aria-pressed={key === x.key} onClick={() => setKey(x.key)}>{x.label}</button>)}
        </div>
      </div>
      <div className="bars" onPointerLeave={() => setHover(null)}>
        {rows.map(r => (
          <div key={r.id} className={`bars__row bars__row--${r.id}${hover && hover !== r.id ? " is-dim" : ""}`}
            onPointerEnter={() => setHover(r.id)} onFocus={() => setHover(r.id)} tabIndex={0}>
            <span className="bars__label">{r.label}</span>
            <span className="bars__track">
              <span className="bars__bar" style={{ width: `${(r.value / max) * 100}%` }} />
            </span>
            <span className="bars__value">{m.fmt(r.value)}</span>
          </div>
        ))}
      </div>
      <p className="chart__note" aria-live="polite">
        {hover ? `${hover === "desert" ? "Food desert tracts" : "Served tracts"}: ${m.fmt(hover === "desert" ? m.desert : m.served)} ${m.label.toLowerCase()}.` : m.note}
      </p>
      <p className="chart__source">Source: USDA Food Access Research Atlas 2019 and Census TIGER 2023, 913 matched Maricopa County tracts.</p>
    </figure>
  );
}

const AUC = [
  { label: "Sentiment only", v: 0.518 },
  { label: "Financial and sentiment", v: 0.575 },
  { label: "Financial only", v: 0.593 },
  { label: "All features with FinBERT", v: 0.633, best: true },
];
const BASELINE = 0.568;

export function EcrieChart() {
  const [hover, setHover] = useState(null);
  const [showBase, setShowBase] = useState(true);
  const W = 680, rowH = 44, top = 18, left = 236, right = 64, H = top + AUC.length * rowH + 34;
  const x0 = 0.5, x1 = 0.65;
  const sx = v => left + ((v - x0) / (x1 - x0)) * (W - left - right);
  const ticks = [0.5, 0.55, 0.6, 0.65];
  return (
    <figure className="chart">
      <div className="chart__head">
        <figcaption className="chart__title">Held out ROC AUC by feature set (XGBoost)</figcaption>
        <label className="toggle">
          <input type="checkbox" checked={showBase} onChange={e => setShowBase(e.target.checked)} />
          <span>Show logistic regression baseline</span>
        </label>
      </div>
      <div className="chart__scroll">
        <svg className="lolli" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lollipop chart of held out ROC AUC: sentiment only 0.518, financial and sentiment 0.575, financial only 0.593, all features with FinBERT 0.633. Logistic regression baseline 0.568. 0.50 is a coin flip.">
          {ticks.map(t => (
            <g key={t}>
              <line className="lolli__grid" x1={sx(t)} x2={sx(t)} y1={top - 8} y2={H - 26} />
              <text className="lolli__tick" x={sx(t)} y={H - 8} textAnchor="middle">{t.toFixed(2)}</text>
            </g>
          ))}
          {showBase && (
            <g>
              <line className="lolli__base" x1={sx(BASELINE)} x2={sx(BASELINE)} y1={top - 8} y2={H - 26} />
              <text className="lolli__baselabel" x={sx(BASELINE) + 6} y={top - 2}>Baseline 0.568</text>
            </g>
          )}
          {AUC.map((d, i) => {
            const y = top + i * rowH + rowH / 2;
            const dim = hover !== null && hover !== i;
            return (
              <g key={d.label} className={`lolli__row${d.best ? " is-best" : ""}${dim ? " is-dim" : ""}`}
                onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <rect className="lolli__hit" x="0" y={y - rowH / 2} width={W} height={rowH} />
                <text className="lolli__label" x={left - 14} y={y + 4} textAnchor="end">{d.label}</text>
                <line className="lolli__stem" x1={sx(x0)} x2={sx(d.v)} y1={y} y2={y} />
                <circle className="lolli__dot" cx={sx(d.v)} cy={y} r={d.best ? 8 : 6} />
                <text className="lolli__value" x={sx(d.v) + 14} y={y + 4}>{d.v.toFixed(3)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="chart__note" aria-live="polite">
        {hover !== null ? `${AUC[hover].label}: ${AUC[hover].v.toFixed(3)} AUC, ${AUC[hover].v > BASELINE ? "above" : "below"} the 0.568 baseline.` : "0.50 is a coin flip. The full feature set scored highest; only its gap over sentiment alone was statistically significant (DeLong p = 0.012)."}
      </p>
      <p className="chart__source">Source: ECRIE capstone report, chronological test split of 240 calls.</p>
    </figure>
  );
}

export const CHARTS = { phoenix: PhoenixChart, ecrie: EcrieChart };
