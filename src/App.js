import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import ContourField from "./ContourField";
import Glyph from "./Glyphs";
import Globe from "./Globe";
import SkillNetwork from "./SkillNetwork";
import { CHARTS } from "./Charts";
import { CursorTrail, DecodeHeading, Magnetic, reducedMotion, useTilt } from "./Effects";
import {
  PROFILE, RESUME_URL, LANES, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATIONS, SKILLS, ABOUT,
} from "./data";

// Prefix for files in /public so the build also works from a subfolder.
const asset = p => (p && p.startsWith("/") ? `${process.env.PUBLIC_URL || ""}${p}` : p);

// ─── THEME: garnet accent, Plex fonts, light or dark ──
const THEME = {
  light: { bg: "#FBF7F7", bgSoft: "#F4E9EB", accent: "#A51D4A", accentSoft: "#D4718C", text: "#1F1215", muted: "#6B565C", rule: "rgba(165,29,74,0.18)" },
  dark: { bg: "#151012", bgSoft: "#231A1E", accent: "#D97C8E", accentSoft: "#E8A3B0", text: "#F6ECEE", muted: "#B8A2A8", rule: "rgba(217,124,142,0.22)" },
};

function themeCSS(mode) {
  const c = THEME[mode];
  return `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Serif:ital,wght@0,500;0,600;0,700;1,500&display=swap');
:root{--bg:${c.bg};--bg-soft:${c.bgSoft};--accent:${c.accent};--accent-soft:${c.accentSoft};--text:${c.text};--muted:${c.muted};--rule:${c.rule};
--font-heading:'IBM Plex Serif',Georgia,serif;--font-body:'IBM Plex Mono',ui-monospace,monospace;--heading-weight:700;--tracking:-0.02em;--body-size:0.94rem;color-scheme:${mode};}`;
}

function useMode() {
  const [mode, setMode] = useState(() => {
    try {
      const v = localStorage.getItem("freya-mode");
      return v === "dark" || v === "light" ? v : "light";
    } catch (e) { return "light"; }
  });
  const toggle = useCallback(() => {
    setMode(m => {
      const next = m === "light" ? "dark" : "light";
      try { localStorage.setItem("freya-mode", next); } catch (e) { /* storage unavailable */ }
      return next;
    });
  }, []);
  return [mode, toggle];
}

// ─── ROUTING ─────────────────────────────────────────────
// Sections use plain anchors (#work, #experience ...). A project opens at #work/<slug>.
function readHash() {
  const h = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  if (h.startsWith("work/")) return { project: h.slice(5) };
  return { project: null };
}

const NAV = [
  { id: "top", label: "Home", icon: "M4 11l8-7 8 7v9h-5v-6H9v6H4z" },
  { id: "work", label: "Work", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { id: "experience", label: "Experience", icon: "M5 19c3-6 6-2 9-8s4-6 5-6M5 19a1.6 1.6 0 1 0 0 .01M19 5a1.6 1.6 0 1 0 0 .01" },
  { id: "skills", label: "Skills", icon: "M6 6a2 2 0 1 0 0 .01M18 7a2 2 0 1 0 0 .01M12 13a2 2 0 1 0 0 .01M6 18a2 2 0 1 0 0 .01M18 18a2 2 0 1 0 0 .01M7.6 7.2l2.9 4.3M16.6 8.4l-3.2 3.3M10.6 14.4l-3.2 2.4M13.6 14.2l3 2.6" },
  { id: "about", label: "About", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { id: "contact", label: "Contact", icon: "M3 6h18v12H3zM3 7l9 6 9-6" },
];

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={d} />
  </svg>
);

// ─── NAVIGATION ──────────────────────────────────────────
function Topbar({ mode, toggle }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const dark = mode === "dark";
  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <a className="topbar__name" href="#top">{PROFILE.name}</a>
      {RESUME_URL && <a className="iconbtn" href={asset(RESUME_URL)} download>Resume</a>}
      <button className="iconbtn iconbtn--round" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
        <Icon d={dark
          ? "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"
          : "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"} />
      </button>
    </header>
  );
}

// A dock like a desktop app bar; on a mouse, icons swell as the cursor passes.
function Dock({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion()) return undefined;
    const items = [...el.querySelectorAll(".dock__item")];
    const onMove = e => items.forEach(it => {
      const r = it.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      it.style.setProperty("--s", (1 + 0.5 * Math.max(0, 1 - d / 120)).toFixed(3));
    });
    const onLeave = () => items.forEach(it => it.style.setProperty("--s", "1"));
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, []);
  return (
    <nav className="dock" aria-label="Sections" ref={ref}>
      {NAV.map(n => (
        <a key={n.id} className="dock__item" href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}>
          <span className="dock__icon"><Icon d={n.icon} size={21} /></span>
          <span className="dock__label">{n.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────
// Types each role, holds it, deletes it, then types the next.
function RoleTicker() {
  const roles = PROFILE.roles;
  const [text, setText] = useState(roles[0]);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let i = 0, pos = roles[0].length, deleting = true, t;
    const step = () => {
      const word = roles[i];
      if (deleting) {
        if (pos > 0) { pos -= 1; setText(word.slice(0, pos)); t = setTimeout(step, 38); }
        else { deleting = false; i = (i + 1) % roles.length; t = setTimeout(step, 260); }
      } else {
        const next = roles[i];
        if (pos < next.length) { pos += 1; setText(next.slice(0, pos)); t = setTimeout(step, 75); }
        else { deleting = true; t = setTimeout(step, 1900); }
      }
    };
    t = setTimeout(step, 2600);
    return () => clearTimeout(t);
  }, [roles]);
  return (
    <p className="hero__role">
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true">{text || "\u00a0"}<span className="caret" /></span>
    </p>
  );
}

function Hero({ theme, dark }) {
  const [touched, setTouched] = useState(false);
  const coarse = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches, []);
  const onInteract = useCallback(() => setTouched(true), []);
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <ContourField bg={theme.bg} ink={theme.accent} dark={dark} onInteract={onInteract} />
      <div className="hero__inner">
        <div className="hero__text">
          <RoleTicker />
          <h1 className="hero__name">{PROFILE.name}</h1>
          <p className="hero__lede">{PROFILE.lede}</p>
          <div className="hero__actions">
            <Magnetic className="btn btn--solid" href="#work">See my work</Magnetic>
            <Magnetic className="btn" href={`mailto:${PROFILE.email}`}>Email me</Magnetic>
            {RESUME_URL && <Magnetic className="btn" href={asset(RESUME_URL)} download>Download resume</Magnetic>}
          </div>
          <p className="hero__status">{PROFILE.status}</p>
        </div>
        <figure className="hero__photo">
          <img src={asset("/img/freya.webp")} width="596" height="1100" alt="Freya Shah" fetchpriority="high" />
        </figure>
      </div>
      <p className={`hero__hint${touched ? " is-hidden" : ""}`} aria-hidden="true">
        {coarse ? "Drag across the map to raise it. Tap to drop a ripple." : "Move across the map to raise it. Click to drop a ripple."}
      </p>
    </section>
  );
}

// ─── WORK ────────────────────────────────────────────────
function Tile({ project, large }) {
  const ref = useTilt(large ? 5 : 8);
  return (
    <a ref={ref} className={`tile${large ? " tile--large" : ""}`} href={`#work/${project.slug}`}>
      <div className="tile__media">
        {project.image ? <img src={asset(project.image)} alt={project.imageAlt} loading="lazy" /> : <Glyph name={project.glyph} />}
        <span className="tile__glare" aria-hidden="true" />
      </div>
      <div className="tile__body">
        <p className="meta">{project.context ? `${project.context}, ${project.period}` : project.period}</p>
        <h3>{project.title}</h3>
        <p className="tile__tagline">{project.tagline}</p>
        <span className="tile__cta">Open project{project.chart ? " and interactive chart" : ""}</span>
      </div>
    </a>
  );
}

function Row({ project }) {
  return (
    <li>
      <a className="row" href={`#work/${project.slug}`}>
        <span className="row__media">{project.image ? <img src={asset(project.image)} alt="" loading="lazy" /> : <Glyph name={project.glyph} />}</span>
        <span className="row__text">
          <span className="row__title">{project.title}</span>
          <span className="row__tagline">{project.tagline}</span>
        </span>
        <span className="row__period">{project.period}</span>
      </a>
    </li>
  );
}

function Work() {
  const [lane, setLane] = useState("all");
  const featured = PROJECTS.filter(p => p.featured);
  const rest = PROJECTS.filter(p => !p.featured);
  const filtered = PROJECTS.filter(p => p.lanes.includes(lane));
  return (
    <section className="section" id="work" aria-labelledby="work-h">
      <div className="section__head">
        <DecodeHeading id="work-h" text="Selected work" />
        <div className="chips" role="group" aria-label="Filter projects">
          {LANES.map(l => (
            <button key={l.key} className="chip" aria-pressed={lane === l.key} onClick={() => setLane(l.key)}>{l.label}</button>
          ))}
        </div>
      </div>
      {lane === "all" ? (
        <>
          <div className="tiles">
            <Tile project={featured[0]} large />
            {featured.slice(1).map(p => <Tile key={p.slug} project={p} />)}
          </div>
          <h3 className="subhead">More projects</h3>
          <ul className="rows">{rest.map(p => <Row key={p.slug} project={p} />)}</ul>
        </>
      ) : (
        <ul className="rows rows--filtered" aria-live="polite">{filtered.map(p => <Row key={p.slug} project={p} />)}</ul>
      )}
    </section>
  );
}

function ProjectDialog({ project, onClose }) {
  const closeRef = useRef(null);
  const sheetRef = useRef(null);
  const idx = PROJECTS.findIndex(p => p.slug === project.slug);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const Chart = project.chart ? CHARTS[project.chart] : null;

  useEffect(() => {
    const opener = document.activeElement;
    const y = window.scrollY;
    document.body.classList.add("is-locked");
    closeRef.current && closeRef.current.focus({ preventScroll: true });
    const onKey = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && sheetRef.current) {
        const f = sheetRef.current.querySelectorAll("a[href],button,input,[tabindex='0']");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
      window.scrollTo({ top: y, behavior: "instant" });
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => { if (sheetRef.current) sheetRef.current.scrollTop = 0; }, [project.slug]);

  const go = slug => e => {
    e.preventDefault();
    window.history.replaceState(null, "", `#work/${slug}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="dialog" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <article className="dialog__sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog__bar">
          <p className="meta">{project.context || "Project"}</p>
          <button className="iconbtn" ref={closeRef} onClick={onClose}>
            <Icon d="M6 6l12 12M18 6L6 18" /><span className="iconbtn__label">Close</span>
          </button>
        </div>
        <h2 id="dialog-title">{project.title}</h2>
        <p className="meta">{project.period}</p>
        {!Chart && (
          <div className="dialog__media">
            {project.gallery ? project.gallery.map(g => <img key={g.src} src={asset(g.src)} alt={g.alt} loading="lazy" />) : <Glyph name={project.glyph} className="glyph--large" />}
          </div>
        )}
        <p className="dialog__summary">{project.summary}</p>
        {Chart && <Chart />}
        {project.body.map((para, i) => <p key={i} className="dialog__para">{para}</p>)}
        {Chart && project.gallery && (
          <div className="dialog__media">
            {project.gallery.map(g => <img key={g.src} src={asset(g.src)} alt={g.alt} loading="lazy" />)}
          </div>
        )}
        <dl className="facts">
          {project.facts.map(f => (
            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
          ))}
        </dl>
        <ul className="tags" aria-label="Tools">{project.tags.map(t => <li key={t}>{t}</li>)}</ul>
        {project.links.length > 0 && (
          <div className="dialog__links">
            {project.links.map(l => <a key={l.href} className="btn btn--solid" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
          </div>
        )}
        <nav className="dialog__pager" aria-label="More projects">
          <a href={`#work/${prev.slug}`} onClick={go(prev.slug)}><small>Previous</small>{prev.title}</a>
          <a href={`#work/${next.slug}`} onClick={go(next.slug)}><small>Next</small>{next.title}</a>
        </nav>
      </article>
    </div>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────
function Experience() {
  const routeRef = useRef(null);
  useEffect(() => {
    const el = routeRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
      el.style.setProperty("--progress", p.toFixed(4));
      const reach = r.top + 10 + p * (r.height - 70);
      el.querySelectorAll(".stop").forEach(s => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle("is-reached", sr.top + 14 <= reach);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="section" id="experience" aria-labelledby="exp-h">
      <div className="section__head">
        <DecodeHeading id="exp-h" text="Experience" />
        <p className="section__note">Scroll to travel the route.</p>
      </div>
      <div className="routewrap" ref={routeRef}>
        <span className="route__pin" aria-hidden="true">
          <svg viewBox="0 0 24 32" width="24" height="32"><path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19z" /><circle cx="12" cy="12" r="4" /></svg>
        </span>
        <ol className="route">
          {EXPERIENCE.map(x => (
            <li className="stop" key={`${x.org}-${x.period}`}>
              <p className="meta">{x.period}, {x.place}</p>
              <h3>{x.role}</h3>
              <p className="stop__org">{x.org}</p>
              {x.metric && (
                <div className="stop__metric">
                  <span className="stop__metric-value">{x.metric.text}</span>
                  <span className="stop__metric-track"><span className="stop__metric-fill" style={{ "--w": `${x.metric.value}%` }} /></span>
                  <span className="stop__metric-label">{x.metric.label}</span>
                </div>
              )}
              <ul className="stop__points">{x.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
              {x.link && <a className="textlink" href={x.link.href} target="_blank" rel="noopener noreferrer">{x.link.label}</a>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────
function SkillCard({ skill }) {
  const [flipped, setFlipped] = useState(false);
  const mono = skill.name === "C#" ? "C#" : skill.name.replace(/[^A-Za-z0-9/]/g, "").slice(0, 2);
  return (
    <li>
      <button className={`skill${flipped ? " is-flipped" : ""}`} aria-pressed={flipped} onClick={() => setFlipped(f => !f)}>
        <span className="skill__inner">
          <span className="skill__face skill__front">
            {skill.icon
              ? <span className="skill__icon" style={{ WebkitMaskImage: `url(${asset(`/icons/${skill.icon}.svg`)})`, maskImage: `url(${asset(`/icons/${skill.icon}.svg`)})` }} aria-hidden="true" />
              : <span className="skill__mono" aria-hidden="true">{mono}</span>}
            <span className="skill__name">{skill.name}</span>
            <span className={`skill__level skill__level--${skill.level.toLowerCase()}`}>{skill.level}</span>
          </span>
          <span className="skill__face skill__back">
            <span className="skill__usedlabel">Used in</span>
            <span className="skill__used">{skill.used}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

function Skills() {
  const cats = Object.keys(SKILLS);
  const [cat, setCat] = useState("All");
  const [view, setView] = useState("map");
  const all = Object.values(SKILLS).flat();
  const groups = (cat === "All" ? cats : [cat]).map(c => [c, SKILLS[c]]);
  return (
    <section className="section" id="skills" aria-labelledby="skills-h">
      <div className="section__head">
        <DecodeHeading id="skills-h" text="Skills" />
        <div className="seg" role="group" aria-label="View">
          <button aria-pressed={view === "map"} onClick={() => setView("map")}>Network</button>
          <button aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
        </div>
      </div>
      <div className="chips" role="group" aria-label="Skill category">
        {["All", ...cats].map(c => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c} <span className="chip__count">{c === "All" ? all.length : SKILLS[c].length}</span>
          </button>
        ))}
      </div>
      {view === "map" ? (
        <SkillNetwork category={cat} />
      ) : (
        groups.map(([c, list]) => (
          <div className="skillgroup" key={c}>
            <h3>{c}</h3>
            <ul className="skills">{list.map(s => <SkillCard key={s.name} skill={s} />)}</ul>
          </div>
        ))
      )}
    </section>
  );
}

// ─── ABOUT & CONTACT ─────────────────────────────────────
function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-h">
      <div className="section__head"><DecodeHeading id="about-h" text="About" /></div>
      <div className="about__grid">
        <div className="about__bio">
          {ABOUT.map((p, i) => <p key={i}>{p}</p>)}
          <div className="about__lists">
            <div>
              <h3>Education</h3>
              <ul className="plainlist">
                {EDUCATION.map(e => (
                  <li key={e.degree}>
                    <strong>{e.degree}</strong>
                    <span>{e.school}, {e.period}{e.gpa ? `, ${e.gpa}` : ""}</span>
                    <small>{e.courses}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Certifications</h3>
              <ul className="plainlist">{CERTIFICATIONS.map(c => <li key={c}><span>{c}</span></li>)}</ul>
            </div>
          </div>
        </div>
        <Globe />
      </div>
    </section>
  );
}

function Contact({ theme, dark }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };
  const links = [
    { label: "LinkedIn", href: PROFILE.links.linkedin },
    { label: "GitHub", href: PROFILE.links.github },
    { label: "Tableau Public", href: PROFILE.links.tableau },
  ];
  return (
    <div className="band">
      <ContourField bg={theme.bg} ink={theme.accent} dark={dark} />
      <section className="section contact" id="contact" aria-labelledby="contact-h">
        <div className="section__head"><DecodeHeading id="contact-h" text="Contact" /></div>
        <p className="contact__lead">Open to full-time data analyst, BI analyst and financial analyst roles. Email is the fastest way to reach me.</p>
        <div className="contact__email">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <Magnetic as="button" className="btn btn--solid" onClick={copy} aria-live="polite">{copied ? "Copied" : "Copy email"}</Magnetic>
        </div>
        <ul className="contact__links">
          {links.map(l => <li key={l.label}><Magnetic href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</Magnetic></li>)}
          <li><Magnetic href={PROFILE.phoneHref}>{PROFILE.phone}</Magnetic></li>
          {RESUME_URL && <li><Magnetic href={asset(RESUME_URL)} download>Resume (PDF)</Magnetic></li>}
        </ul>
        <footer className="footer">
          <span>© 2026 {PROFILE.name}</span>
          <span>Built with React and WebGL. <a href={PROFILE.links.source} target="_blank" rel="noopener noreferrer">Source on GitHub</a></span>
        </footer>
      </section>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────
export default function Portfolio() {
  const [mode, toggleMode] = useMode();
  const [route, setRoute] = useState(readHash);
  const [active, setActive] = useState("top");
  const openedHere = useRef(false);
  const theme = THEME[mode];

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme.bg);
  }, [theme.bg]);

  useEffect(() => {
    const onHash = () => {
      const r = readHash();
      if (r.project) openedHere.current = true;
      setRoute(r);
    };
    window.addEventListener("hashchange", onHash);
    if (readHash().project) {
      const w = document.getElementById("work");
      if (w) window.scrollTo({ top: w.offsetTop - 64, behavior: "instant" });
    }
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(n => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const project = route.project ? PROJECTS.find(p => p.slug === route.project) : null;
  const closeProject = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "#work");
      setRoute({ project: null });
    }
  }, []);

  return (
    <>
      <style>{themeCSS(mode)}</style>
      <a className="skip" href="#work">Skip to work</a>
      <Topbar mode={mode} toggle={toggleMode} />
      <main>
        <Hero theme={theme} dark={mode === "dark"} />
        <Work />
        <Experience />
        <Skills />
        <About />
        <Contact theme={theme} dark={mode === "dark"} />
      </main>
      <Dock active={active} />
      <CursorTrail />
      {project && <ProjectDialog project={project} onClose={closeProject} />}
    </>
  );
}
