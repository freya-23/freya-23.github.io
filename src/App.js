import React, { useState, useEffect, useRef } from "react";
// ─── DESIGN SYSTEM ──────────────────────────────────────────
// Light + Dark pairs for each color energy
const COLOR_THEMES = {
  vibrant: {
    name: "Vibrant",
    desc: "Energetic coral",
    light: {
      bg: "#FEFAF5", bgSoft: "#FDF0E3",
      accent: "#E85D3F", accentSoft: "#FF8E6C",
      text: "#1A0F0A", muted: "#7A6055",
      card: "rgba(255,253,250,0.55)", rule: "rgba(232,93,63,0.14)",
    },
    dark: {
      bg: "#15100D", bgSoft: "#1F1814",
      accent: "#FF8E6C", accentSoft: "#FFA888",
      text: "#FDF0E3", muted: "#A8948A",
      card: "rgba(30,22,18,0.6)", rule: "rgba(255,142,108,0.14)",
    },
  },
  jewel: {
    name: "Jewel",
    desc: "Bold magenta",
    light: {
      bg: "#FCF8FC", bgSoft: "#F4E8F2",
      accent: "#9D2C78", accentSoft: "#C966A5",
      text: "#1C0E1A", muted: "#7A5D73",
      card: "rgba(254,250,253,0.55)", rule: "rgba(157,44,120,0.14)",
    },
    dark: {
      bg: "#140B14", bgSoft: "#1E141C",
      accent: "#D97BB5", accentSoft: "#E89BC8",
      text: "#F4E8F2", muted: "#A68FA0",
      card: "rgba(30,20,28,0.6)", rule: "rgba(217,123,181,0.14)",
    },
  },
  electric: {
    name: "Electric",
    desc: "Teal & violet",
    light: {
      bg: "#F8FBFB", bgSoft: "#E8F2F2",
      accent: "#0D7377", accentSoft: "#14A6AC",
      text: "#0A1A1C", muted: "#5E7678",
      card: "rgba(250,253,253,0.55)", rule: "rgba(13,115,119,0.14)",
    },
    dark: {
      bg: "#0A1416", bgSoft: "#131E21",
      accent: "#4ECDC4", accentSoft: "#7DE2DA",
      text: "#E8F2F2", muted: "#8FA5A8",
      card: "rgba(20,32,34,0.6)", rule: "rgba(78,205,196,0.14)",
    },
  },
  pastel: {
    name: "Pastel",
    desc: "Lavender & peach",
    light: {
      bg: "#FBF6FB", bgSoft: "#F3EBF5",
      accent: "#8B5A96", accentSoft: "#C9A8D4",
      text: "#201530", muted: "#7A6884",
      card: "rgba(253,250,253,0.55)", rule: "rgba(139,90,150,0.14)",
    },
    dark: {
      bg: "#18121F", bgSoft: "#221B2B",
      accent: "#C9A8D4", accentSoft: "#E0C6E8",
      text: "#F3EBF5", muted: "#A090A8",
      card: "rgba(30,22,38,0.6)", rule: "rgba(201,168,212,0.14)",
    },
  },
};
// Font pairs: heading / body
const FONT_THEMES = {
  editorial: {
    name: "Editorial",
    desc: "Fraunces + Inter",
    heading: "'Fraunces', serif",
    body: "'Inter', sans-serif",
    import: "family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700",
    headingWeight: 500,
    headingStyle: "normal",
    letterSpacing: "-0.02em",
  },
  geometric: {
    name: "Geometric",
    desc: "Space Grotesk",
    heading: "'Space Grotesk', sans-serif",
    body: "'Space Grotesk', sans-serif",
    import: "family=Space+Grotesk:wght@300;400;500;600;700",
    headingWeight: 600,
    headingStyle: "normal",
    letterSpacing: "-0.03em",
  },
  devEditorial: {
    name: "Developer",
    desc: "Plex Serif + Plex Mono",
    heading: "'IBM Plex Serif', serif",
    body: "'IBM Plex Mono', monospace",
    import: "family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400",
    headingWeight: 600,
    headingStyle: "normal",
    letterSpacing: "-0.01em",
  },
  minimal: {
    name: "Minimal",
    desc: "Inter only",
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    import: "family=Inter:wght@300;400;500;600;700;800",
    headingWeight: 700,
    headingStyle: "normal",
    letterSpacing: "-0.035em",
  },
};
const DEFAULT_COLOR = "jewel";
const DEFAULT_FONT = "devEditorial";
const DEFAULT_MODE = "light";
const buildFontsCSS = (colorKey, fontKey, mode) => {
  const t = COLOR_THEMES[colorKey][mode];
  const f = FONT_THEMES[fontKey];
  return `
  @import url('https://fonts.googleapis.com/css2?${f.import}&display=swap');
  :root {
    --bg: ${t.bg};
    --bg-soft: ${t.bgSoft};
    --accent: ${t.accent};
    --accent-soft: ${t.accentSoft};
    --text: ${t.text};
    --muted: ${t.muted};
    --card: ${t.card};
    --card-border: ${t.rule};
    --card-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);
    --rule: ${t.rule};
    --font-heading: ${f.heading};
    --font-body: ${f.body};
    --heading-weight: ${f.headingWeight};
    --heading-style: ${f.headingStyle};
    --heading-tracking: ${f.letterSpacing};
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    color: var(--text);
    font-family: var(--font-body);
    background: var(--bg);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  ::selection {
    background: var(--accent);
    color: var(--bg);
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flipIn {
    from { opacity: 0; transform: rotateY(-90deg); }
    to { opacity: 1; transform: rotateY(0deg); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
    50% { box-shadow: 0 0 24px 2px var(--accent); }
  }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
  .stagger-1 { animation-delay: 0.05s; opacity: 0; }
  .stagger-2 { animation-delay: 0.15s; opacity: 0; }
  .stagger-3 { animation-delay: 0.25s; opacity: 0; }
  .stagger-4 { animation-delay: 0.35s; opacity: 0; }
  .stagger-5 { animation-delay: 0.45s; opacity: 0; }
  .stagger-6 { animation-delay: 0.55s; opacity: 0; }
  /* Scroll-reveal */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: opacity, transform;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.08s; }
  .reveal-delay-2 { transition-delay: 0.16s; }
  .reveal-delay-3 { transition-delay: 0.24s; }
  .reveal-delay-4 { transition-delay: 0.32s; }
  .reveal-delay-5 { transition-delay: 0.4s; }
  /* Hover lift utility */
  .hover-lift {
    transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease;
    will-change: transform;
  }
  .hover-lift:hover {
    transform: translateY(-3px);
  }
  /* Flip card 3D */
  .flip-card { perspective: 1000px; }
  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-card.flipped .flip-inner {
    transform: rotateY(180deg);
  }
  .flip-face {
    position: absolute;
    inset: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: inherit;
  }
  .flip-back {
    transform: rotateY(180deg);
  }
`;
};
// ─── SCROLL REVEAL HOOK ─────────────────────────────────
function useReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    const nodes = document.querySelectorAll(".reveal:not(.visible)");
    nodes.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}
// Skill → where I used it (for flip card backs)
const SKILL_CONTEXT = {
  "Python": "ECRIE · Phoenix · Alzheimer's · NIDS · Pay Gap pipeline",
  "SQL": "TEAM PMC dashboards · Sales Forecasting · Graph Pipeline joins",
  "PostgreSQL": "TEAM PMC ETL · taxi data warehousing",
  "MySQL": "Book Recommender backend · academic coursework",
  "Snowflake": "Certified · cloud data warehousing coursework",
  "R": "Statistics for Data Analysts · time-series coursework",
  "C": "Operating Systems · DSA coursework",
  "C#": "2D Flappy Bird · Unity game dev",
  "Pandas": "ECRIE feature engineering · Phoenix analysis · NIDS prep",
  "Scikit-learn": "NIDS Random Forest · Alzheimer's XGBoost · Sales Forecasting",
  "NumPy": "Image enhancement research · ML preprocessing across projects",
  "XGBoost": "Alzheimer's 90.9% accuracy · ECRIE stock prediction ensemble",
  "SHAP": "Alzheimer's explainability · ECRIE feature importance",
  "LIME": "Alzheimer's local explanations · image enhancement research",
  "Statistical Modeling": "DA-IICT PSNR/SSIM benchmarking · coursework",
  "A/B Testing": "ISSC event promotion — drove 15% turnout lift",
  "ARIMA": "Sales Forecasting time-series modeling",
  "FinBERT": "ECRIE earnings call sentiment across 117 tickers",
  "Tableau": "TEAM PMC dashboards — 60% reporting reduction",
  "Power BI": "Cross-training with Tableau · viz coursework",
  "Matplotlib": "Phoenix income distribution · ECRIE SHAP plots",
  "Seaborn": "Statistical visualization across academic work",
  "D3.js": "Gender & Race Pay Gap scrollytelling web app",
  "Microsoft Excel": "TEAM PMC data consolidation · PivotTables + Power Query",
  "Git": "Version control for all 8+ portfolio projects",
  "Docker": "Neo4j containerization · reproducible research environments",
  "Neo4j": "Real-Time Graph Pipeline · NYC Taxi graph modeling",
  "Kafka": "Graph Pipeline streaming — ~150 msgs/sec",
  "Kubernetes": "Graph Pipeline orchestration · auto-scaling pods",
  "LangGraph": "ECRIE three-phase agentic architecture",
  "QGIS": "Phoenix Food Access — buffer + spatial join analysis",
  "Google Analytics": "Certified · event analytics integration",
  "Jupyter": "Exploratory analysis across ECRIE, Phoenix, NIDS",
};
// ─── DATA ─────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Phoenix Food Access Inequity Analysis",
    period: "Apr 2026",
    tagline: "Mapping grocery access vs income across 1,009 Phoenix neighborhoods.",
    summary: "A spatial analysis quantifying food access inequity in Maricopa County using QGIS, Python, and public USDA/Census data — revealing food desert neighborhoods earn 39% less and face 2.5× higher poverty rates than served ones.",
    description: "Phoenix has a food desert problem that doesn't always show up on income maps alone. This project combined grocery store locations from OpenStreetMap, census tract boundaries from US Census TIGER, and USDA's official Low-Income Low-Access classifications to quantify who actually struggles to reach a grocery store. In QGIS, I reprojected all layers to UTM Zone 12N for accurate meter-based distance operations, built 1-mile walking buffers around every grocery store, and spatial-joined those buffers against 1,009 Maricopa census tracts to flag neighborhoods falling outside every buffer. I then joined USDA income and poverty data to each tract via zero-padded GEOIDs, and did the statistical comparison in Python. The final output is a choropleth map showing income-graduated tracts with food desert boundaries overlaid, plus supporting matplotlib charts and a summary table. The key finding challenges the rural food desert stereotype: 97% of Maricopa food deserts are urban — 358,946 residents in Phoenix proper lack walkable grocery access.",
    highlights: [
      { label: "Tracts Analyzed", value: "1,009" },
      { label: "Income Gap", value: "39% lower" },
      { label: "Residents Affected", value: "358,946" },
    ],
    tags: ["QGIS", "Python", "Pandas", "Spatial Analysis", "OpenStreetMap", "USDA Atlas", "Census TIGER", "GeoPackage"],
    github: "https://github.com/freya-23/phoenix-food-desert-analysis",
    demo: "https://github.com/freya-23/phoenix-food-desert-analysis#readme",
  },
  {
    title: "Earnings Call & Risk Intelligence Engine (ECRIE)",
    period: "Jan 2026 – May 2026",
    tagline: "Agentic AI pipeline turning earnings calls into trading signals.",
    summary: "MS capstone: a three-phase agentic AI system that scrapes 900+ real earnings call transcripts, extracts sentiment with FinBERT, and predicts post-earnings stock movement via XGBoost with SHAP-based interpretability.",
    description: "ECRIE is my ASU MS capstone. The system ingests earnings call transcripts from SeekingAlpha for 117 S&P 500 tickers — over 900 real transcripts, no synthetic data — cleans and segments speaker turns, and runs FinBERT sentiment analysis on each segment. On top of that sits a three-phase agentic architecture orchestrated with LangGraph: (1) a feature-discovery agent that proposes candidate predictive signals, (2) a self-learning optimizer that tunes feature weighting across iterations, and (3) an XGBoost ensemble that predicts post-earnings stock direction. The sentiment classifier AUC improved to ~65% through iterative prompt engineering and segment-level features. SHAP feature importance surfaces which financial and linguistic drivers are moving predictions — critical for any investor-facing deployment. The project pushed me to integrate NLP, ML, and agentic orchestration end-to-end while working with real, messy financial data.",
    highlights: [
      { label: "Transcripts", value: "900+ real" },
      { label: "Tickers Covered", value: "117 S&P 500" },
      { label: "Sentiment AUC", value: "~65%" },
    ],
    tags: ["FinBERT", "XGBoost", "LangGraph", "SHAP", "Agentic AI", "Python", "NLP", "Financial Data"],
  },
  {
    title: "Scalable Real-Time Graph Analytics Pipeline",
    period: "Jan 2025 – May 2025",
    tagline: "From NYC taxis to real-time streaming graphs — built at scale.",
    summary: "A two-phase graph analytics system that processes NYC taxi data through Neo4j and scales to real-time streaming with Kafka and Kubernetes.",
    description: "This project tackled the challenge of analyzing massive transportation networks in real time. In Phase 1, I ingested NYC Yellow Taxi trip data into a Dockerized Neo4j instance and ran graph algorithms like PageRank (to identify the most connected pickup/drop-off zones) and BFS (to trace shortest routes through the trip network). Phase 2 was the real engineering challenge: I extended the batch system into a fully real-time streaming pipeline using Apache Kafka and Kubernetes. I configured Kafka Connect source connectors to stream filtered trip records directly into Neo4j, achieving ~150 messages/second throughput with sub-200ms end-to-end latency. The entire pipeline was orchestrated via Kubernetes pods for auto-scaling and fault tolerance. Validated results with automated integration tests and live graph visualizations.",
    highlights: [
      { label: "Throughput", value: "~150 msgs/sec" },
      { label: "Latency", value: "<200ms" },
      { label: "Architecture", value: "Kafka → Neo4j → K8s" },
    ],
    tags: ["Neo4j", "Kafka", "Kubernetes", "Docker", "PageRank", "BFS", "Graph Analytics"],
  },
  {
    title: "Visual Data Story: Gender & Race Pay Gap",
    period: "Aug 2024 – Dec 2024",
    tagline: "Scroll-driven storytelling that makes inequality visible.",
    summary: "A full-stack scrollytelling web app using D3.js to communicate complex wage disparity patterns through narrative-driven, interactive visualizations.",
    description: "Working in a team of six, I built an argumentative, scroll-driven data narrative that explores the gender and racial dimensions of the wage gap in the United States. The application uses D3.js extensively — from animated bar charts that reveal pay ratios across demographics, to custom-built visualization idioms like slope graphs and bump charts showing how disparities shift over time and across industries. The scroll-triggered architecture uses Intersection Observer to progressively reveal data points as the user scrolls, creating a cinematic storytelling experience. Each section builds on the last: starting with the overall gap, drilling into racial breakdowns, comparing industries, and ending with a call to action. I handled the full pipeline from raw Census Bureau data wrangling to front-end deployment.",
    highlights: [
      { label: "Team Size", value: "6 people" },
      { label: "Viz Library", value: "D3.js" },
      { label: "Technique", value: "Scrollytelling" },
    ],
    tags: ["D3.js", "JavaScript", "Scrollytelling", "Intersection Observer", "Data Viz", "GitHub"],
  },
  {
    title: "Network Intrusion Detection System",
    period: "Aug 2024 – Dec 2024",
    tagline: "99.77% accuracy — catching threats before they land.",
    summary: "Comprehensive research paper analyzing ML/DL models for cybersecurity threat detection on benchmark intrusion datasets.",
    description: "This was a deep-dive research project into how machine learning can power next-generation cybersecurity. I wrote an extensive paper evaluating multiple ML and deep learning models — including Random Forest, XGBoost, CNNs, and LSTMs — on two major benchmark datasets: NSL-KDD and CIC-IDS2017. The best-performing model (Random Forest with engineered features) achieved 99.77% accuracy in classifying network traffic as normal vs. malicious across multiple attack categories (DoS, Probe, R2L, U2R). A significant challenge was handling extreme class imbalance: some attack types made up less than 0.1% of the dataset. I addressed this through SMOTE oversampling, feature selection via mutual information, and stratified cross-validation. The paper also discusses real-time deployment challenges — how to maintain detection accuracy under live traffic loads while keeping false positive rates low enough for production use.",
    highlights: [
      { label: "Best Accuracy", value: "99.77%" },
      { label: "Datasets", value: "NSL-KDD & CIC-IDS2017" },
      { label: "Key Model", value: "Random Forest" },
    ],
    tags: ["Random Forest", "XGBoost", "CNN", "LSTM", "Cybersecurity", "SMOTE", "Research Paper"],
  },
  {
    title: "Alzheimer's Risk Prediction",
    period: "Jan 2025 – May 2025",
    tagline: "Interpretable ML for responsible early diagnosis.",
    summary: "Built an interpretable ML pipeline using XGBoost with SHAP and LIME explanations, designed to be fair across demographic groups.",
    description: "Healthcare ML comes with unique responsibilities — the model needs to be not just accurate, but explainable and fair. This project built an end-to-end pipeline for predicting Alzheimer's disease risk from patient health records. I trained an XGBoost classifier that achieved 90.9% accuracy, then layered on SHAP (SHapley Additive exPlanations) for global feature importance and LIME (Local Interpretable Model-agnostic Explanations) for individual prediction explanations. This means a clinician could see not just \"high risk\" but exactly which factors (age, cognitive test scores, biomarkers) drove that prediction. Crucially, I also conducted fairness audits across age groups, gender, and ethnicity to ensure the model didn't systematically underperform for any demographic — a common pitfall in medical AI that can reinforce existing healthcare disparities.",
    highlights: [
      { label: "Accuracy", value: "90.9%" },
      { label: "Explainability", value: "SHAP + LIME" },
      { label: "Fairness", value: "Audited across demographics" },
    ],
    tags: ["XGBoost", "SHAP", "LIME", "Healthcare ML", "Fairness", "Interpretability"],
  },
  {
    title: "Book Recommendation System",
    period: "Aug 2023 – Dec 2023",
    tagline: "35% engagement boost through smarter recommendations.",
    summary: "A personalized recommendation engine using Bayesian Personalized Ranking and collaborative filtering with implicit user feedback.",
    description: "Most recommendation systems rely on explicit ratings (1-5 stars), but real user behavior is messier — people browse, click, abandon, and revisit. This project built a recommendation engine that learns from implicit feedback signals: which books a user viewed, how long they spent on a page, and what they added to wishlists. The core algorithm uses Bayesian Personalized Ranking (BPR), which optimizes a pairwise ranking loss — essentially learning that a user prefers Book A over Book B based on interaction patterns, even without explicit ratings. I combined this with collaborative filtering to leverage similar users' behavior. The system achieved a 35% increase in user engagement metrics compared to a popularity-based baseline, measured through click-through rates and session duration on recommended items.",
    highlights: [
      { label: "Engagement Lift", value: "+35%" },
      { label: "Algorithm", value: "BPR + Collab Filtering" },
      { label: "Signal Type", value: "Implicit Feedback" },
    ],
    tags: ["BPR", "Collaborative Filtering", "Implicit Feedback", "Python", "Recommender Systems"],
  },
  {
    title: "Sales Forecasting with ML",
    period: "Jan 2023 – May 2023",
    tagline: "Predicting revenue with 40% more efficient pipelines.",
    summary: "Implemented multiple supervised ML algorithms for predictive sales analysis, with a focus on robust data preprocessing and model comparison.",
    description: "This project focused on the practical side of ML in business: building a sales forecasting pipeline that's reliable enough for real decision-making. I implemented and compared three approaches — Linear Regression (as a baseline), Ridge Regression (for handling multicollinearity in correlated sales features), and ARIMA (for capturing temporal patterns and seasonality). The biggest wins came from the data preprocessing stage: I built automated pipelines for handling missing values, encoding categorical features (product categories, regions, store types), and engineering time-based features (day-of-week effects, holiday indicators, rolling averages). This preprocessing automation alone improved efficiency by 40% compared to manual approaches. The final ensemble of models enabled accurate multi-step-ahead forecasting that the business team could use for inventory planning and revenue projections.",
    highlights: [
      { label: "Efficiency Gain", value: "+40%" },
      { label: "Models", value: "Linear, Ridge, ARIMA" },
      { label: "Use Case", value: "Revenue Forecasting" },
    ],
    tags: ["Scikit-learn", "ARIMA", "Ridge Regression", "Feature Engineering", "Python", "Time Series"],
  },
];
const SKILLS = {
  "Languages & Querying": [
    { name: "Python", level: "Advanced" },
    { name: "SQL", level: "Advanced" },
    { name: "PostgreSQL", level: "Advanced" },
    { name: "MySQL", level: "Advanced" },
    { name: "Snowflake", level: "Intermediate" },
    { name: "R", level: "Intermediate" },
    { name: "C", level: "Intermediate" },
    { name: "C#", level: "Intermediate" },
  ],
  "Data Science & Analytics": [
    { name: "Pandas", level: "Advanced" },
    { name: "Scikit-learn", level: "Advanced" },
    { name: "NumPy", level: "Advanced" },
    { name: "XGBoost", level: "Advanced" },
    { name: "SHAP", level: "Intermediate" },
    { name: "LIME", level: "Intermediate" },
    { name: "Statistical Modeling", level: "Intermediate" },
    { name: "A/B Testing", level: "Intermediate" },
    { name: "ARIMA", level: "Intermediate" },
    { name: "FinBERT", level: "Intermediate" },
  ],
  "Visualization & BI": [
    { name: "Tableau", level: "Advanced" },
    { name: "Power BI", level: "Intermediate" },
    { name: "Matplotlib", level: "Advanced" },
    { name: "Seaborn", level: "Intermediate" },
    { name: "D3.js", level: "Intermediate" },
    { name: "Microsoft Excel", level: "Advanced" },
  ],
  "Tools & Infrastructure": [
    { name: "Git", level: "Advanced" },
    { name: "Docker", level: "Intermediate" },
    { name: "Neo4j", level: "Intermediate" },
    { name: "Kafka", level: "Intermediate" },
    { name: "Kubernetes", level: "Intermediate" },
    { name: "LangGraph", level: "Intermediate" },
    { name: "QGIS", level: "Intermediate" },
    { name: "Google Analytics", level: "Intermediate" },
    { name: "Jupyter", level: "Advanced" },
  ],
};
const EXPERIENCE = [
  {
    role: "Indian Student Support Assistant",
    org: "Arizona State University – ISSC",
    period: "Aug 2025 – Present",
    points: [
      "Coordinate university-wide, culturally inclusive events and welcome week programming for 13,000+ international students — managing end-to-end execution across arrival logistics, campus orientations, and cultural initiatives.",
      "Designed A/B tests on multi-channel event promotion (WhatsApp, Instagram, email) and analyzed RSVP/engagement data to optimize outreach strategy — driving a 15% increase in average event turnout.",
      "Collect, clean, and analyze event participation datasets to identify turnout drivers and demographic preferences, translating findings into actionable recommendations for programming decisions.",
    ],
  },
  {
    role: "Summer Research Intern",
    org: "DA-IICT – Under Prof. Srimanta Mandal",
    period: "Jun 2025 – Aug 2025",
    points: [
      "Conducted a comparative study of low-light image enhancement techniques — LIME, Retinex (MSRCR), and SNR-Aware Transformers — evaluating trade-offs between pixel-level fidelity and structural similarity on the LOL dataset.",
      "Implemented LIME and Retinex methods in Python/OpenCV, running quantitative evaluations using PSNR and SSIM metrics across 15 paired low-light/normal-light image sets to benchmark performance.",
      "Authored a research report analyzing how classical optimization (LIME), biologically-inspired (Retinex), and deep learning (SNR-Aware Transformer) approaches handle noise, color restoration, and illumination correction differently.",
    ],
  },
  {
    role: "Data Analyst Intern",
    org: "TEAM (Technical Entrepreneur Agile Management) PMC – Ahmedabad, India",
    period: "Sep 2023 – May 2024",
    points: [
      "Built interactive Tableau dashboards tracking cost variances, design revision cycles, and quality inspection KPIs across 15+ residential projects (400,000 sq ft), reducing manual reporting effort by 60% and enabling data-driven project oversight.",
      "Designed ETL pipelines in Python to consolidate cost, scheduling, and QC data from disparate Excel workbooks into PostgreSQL; wrote SQL queries analyzing year-over-year patterns to identify top delay drivers and quality compliance trends.",
      "Partnered with project managers to translate construction KPIs into stakeholder-ready reports, surfacing actionable insights that influenced project oversight decisions.",
    ],
  },
  {
    role: "Intern – Robotics & Data Analytics",
    org: "MNT Infovision Pvt Ltd",
    period: "May 2023 – Aug 2023",
    points: [
      "Conducted market sizing, competitive analysis, and performance benchmarking on robotic systems for healthcare and hospitality verticals; presented data-driven ROI recommendations to leadership that contributed to securing a pilot with TAJ Hotels.",
      "Analyzed usability metrics and system performance data across deployments — identified navigation bottlenecks and drove a 20% improvement in interaction accuracy.",
    ],
  },
];
const EDUCATION = [
  { degree: "M.S. in Data Science, Analytics and Engineering", school: "Arizona State University, Tempe, Arizona", period: "Graduating May 2026", gpa: "GPA: 3.63", courses: "Data Mining, Information Assurance & Security, Data Processing at Scale, Statistics for Data Analysts, Statistical Machine Learning, Data Visualization" },
  { degree: "B.S. Honors in Computer Science", school: "Ahmedabad University, Gujarat, India", period: "May 2024", courses: "Machine Learning, Data Structures & Algorithms, Human-Computer Interactions, OOP, Operating Systems, Probabilistic Graphical Models" },
];
const CERTIFICATIONS = [
  "Google Data Analytics Professional Certificate",
  "Intro to Snowflake for Devs, Data Scientists, Data Engineers",
  "C-Programming (C-Tag)",
  "C# Programming for Unity Game Development",
];
const PAGES = ["Home", "About", "Projects", "Skills", "Experience", "Contact"];
// ─── DESIGN CONTROLS PANEL ───────────────────────────────
function DesignPanel({ colorKey, setColor, fontKey, setFont, mode, setMode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px", zIndex: 200,
      fontFamily: "var(--font-body)",
    }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open design panel"
        style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "var(--accent)", color: "var(--bg)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
          position: "absolute", bottom: 0, right: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </button>
      {/* Panel */}
      {open && (
        <div style={{
          position: "absolute", bottom: "60px", right: 0,
          width: "280px",
          background: "var(--bg)",
          border: "1px solid var(--rule)",
          borderRadius: "16px",
          padding: "18px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          animation: "fadeUp 0.25s ease-out",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "14px",
          }}>
            <div style={{
              fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
              fontSize: "0.95rem", color: "var(--text)",
            }}>Customize</div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--muted)", fontSize: "1.2rem", padding: "4px 8px",
              }}
            >×</button>
          </div>
          {/* Mode toggle */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px",
            }}>Mode</div>
            <div style={{ display: "flex", gap: "6px" }}>
              {["light", "dark"].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: "8px 12px", borderRadius: "8px",
                    background: mode === m ? "var(--accent)" : "transparent",
                    color: mode === m ? "var(--bg)" : "var(--text)",
                    border: `1px solid ${mode === m ? "var(--accent)" : "var(--rule)"}`,
                    cursor: "pointer",
                    fontSize: "0.82rem", fontWeight: 500,
                    fontFamily: "var(--font-body)",
                    textTransform: "capitalize",
                    transition: "all 0.15s ease",
                  }}
                >{m}</button>
              ))}
            </div>
          </div>
          {/* Color palette */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px",
            }}>Color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
              {Object.entries(COLOR_THEMES).map(([key, c]) => {
                const swatch = c[mode].accent;
                const active = colorKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setColor(key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 10px", borderRadius: "8px",
                      background: active ? "var(--bg-soft)" : "transparent",
                      border: `1px solid ${active ? "var(--accent)" : "var(--rule)"}`,
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "var(--font-body)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%",
                      background: swatch, flexShrink: 0,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                    }} />
                    <span style={{ fontSize: "0.78rem", color: "var(--text)", fontWeight: 500 }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Font */}
          <div>
            <div style={{
              fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px",
            }}>Typography</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {Object.entries(FONT_THEMES).map(([key, f]) => {
                const active = fontKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setFont(key)}
                    style={{
                      padding: "8px 12px", borderRadius: "8px",
                      background: active ? "var(--bg-soft)" : "transparent",
                      border: `1px solid ${active ? "var(--accent)" : "var(--rule)"}`,
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{
                      fontFamily: f.heading, fontWeight: f.headingWeight,
                      fontSize: "0.92rem", color: "var(--text)",
                    }}>{f.name}</div>
                    <div style={{
                      fontFamily: f.body, fontSize: "0.7rem", color: "var(--muted)",
                      marginTop: "2px",
                    }}>{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── SHARED ───────────────────────────────────────────────
function Page({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      {children}
    </div>
  );
}
function Navbar({ activePage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "18px 48px",
      background: scrolled ? "rgba(245,241,234,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
      transition: "all 0.25s ease",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div onClick={() => setPage("Home")} style={{
        fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem",
        cursor: "pointer", fontStyle: "italic", color: "var(--text)",
        letterSpacing: "-0.01em",
      }}>
        Freya Shah
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {PAGES.filter(p => p !== "Home").map(page => (
          <button key={page} onClick={() => setPage(page)} style={{
            background: "transparent",
            color: activePage === page ? "var(--accent)" : "var(--muted)",
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "0.88rem",
            fontWeight: activePage === page ? 600 : 500,
            fontFamily: "var(--font-body)",
            transition: "color 0.2s ease",
            position: "relative",
          }}
            onMouseEnter={e => { if (activePage !== page) e.target.style.color = "var(--text)"; }}
            onMouseLeave={e => { if (activePage !== page) e.target.style.color = "var(--muted)"; }}
          >
            {page}
            {activePage === page && (
              <span style={{
                position: "absolute", bottom: "-2px", left: "16px", right: "16px",
                height: "1px", background: "var(--accent)",
              }} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
function SectionLabel({ number, text }) {
  return (
    <div style={{
      fontSize: "0.72rem",
      fontWeight: 600,
      color: "var(--accent)",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: "16px",
      fontFamily: "var(--font-body)",
    }}>
      {number} — {text}
    </div>
  );
}
// ─── HOME ─────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [typedIndex, setTypedIndex] = useState(0);
  const roles = ["Data Analyst", "Data Engineer", "ML Engineer", "Visual Storyteller", "Problem Solver"];
  useEffect(() => {
    const interval = setInterval(() => {
      setTypedIndex(prev => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);
  const quickLinks = [
    { label: "Spatial Analysis", desc: "QGIS · USDA · Census TIGER", page: "Projects" },
    { label: "Agentic AI / ML", desc: "LangGraph · FinBERT · XGBoost", page: "Projects" },
    { label: "Streaming Pipelines", desc: "Kafka · Neo4j · Kubernetes", page: "Projects" },
    { label: "Data Storytelling", desc: "D3.js · Tableau · Power BI", page: "Projects" },
  ];
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 48px", maxWidth: "1180px", margin: "0 auto",
    }}>
      <div style={{ width: "100%" }}>
        <div className="fade-up stagger-1" style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          border: "1px solid var(--rule)", borderRadius: "100px",
          padding: "6px 16px 6px 10px", marginBottom: "32px",
          background: "var(--card)",
        }}>
          <span style={{
            display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
            background: "var(--accent)",
          }} />
          <span key={typedIndex} style={{
            fontSize: "0.82rem", fontWeight: 500, color: "var(--accent)",
            animation: "fadeUp 0.4s ease-out",
            letterSpacing: "0.02em",
          }}>
            {roles[typedIndex]}
          </span>
        </div>
        <h1 className="fade-up stagger-2" style={{
          fontFamily: "var(--font-heading)", fontWeight: 500,
          fontSize: "clamp(3rem, 8vw, 5.8rem)", lineHeight: 1.02,
          letterSpacing: "-0.035em", marginBottom: "32px",
          color: "var(--text)",
        }}>
          Hi, I'm <span style={{ fontStyle: "italic", fontWeight: 500, color: "var(--accent)" }}>Freya</span>.
        </h1>
        <p className="fade-up stagger-3" style={{
          fontSize: "1.15rem", lineHeight: 1.7, color: "var(--muted)",
          maxWidth: "620px", marginBottom: "48px",
          fontWeight: 400,
        }}>
          A Data Science grad student at ASU who likes turning messy data into things people actually use —
          from real-time streaming pipelines to interactive visual stories and agentic AI systems.
          Currently looking for a full-time data analyst or data engineering role.
        </p>
        <div className="fade-up stagger-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "72px" }}>
          <button onClick={() => setPage("Projects")} style={{
            background: "var(--accent)", color: "var(--bg)", border: "none",
            padding: "13px 28px", borderRadius: "100px",
            cursor: "pointer", fontSize: "0.92rem", fontWeight: 500, fontFamily: "var(--font-body)",
            transition: "all 0.2s ease", letterSpacing: "0.01em",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.background = "var(--text)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.background = "var(--accent)"; }}
          >View my work →</button>
          <button onClick={() => setPage("Contact")} style={{
            background: "transparent", color: "var(--text)",
            border: "1px solid var(--text)", padding: "13px 28px", borderRadius: "100px",
            cursor: "pointer", fontSize: "0.92rem", fontWeight: 500, fontFamily: "var(--font-body)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.target.style.background = "var(--text)"; e.target.style.color = "var(--bg)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--text)"; }}
          >Get in touch</button>
        </div>
        <div className="fade-up stagger-5" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px",
        }}>
          {quickLinks.map((link, i) => (
            <div
              key={i}
              onClick={() => setPage(link.page)}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === i ? "var(--bg-soft)" : "transparent",
                border: `1px solid ${hoveredCard === i ? "var(--accent)" : "var(--rule)"}`,
                borderRadius: "14px", padding: "22px 20px", cursor: "pointer",
                transition: "all 0.2s ease",
                transform: hoveredCard === i ? "translateY(-2px)" : "translateY(0)",
                position: "relative",
              }}
            >
              <div style={{
                fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem",
                color: "var(--text)", marginBottom: "6px",
              }}>
                {link.label}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 400, letterSpacing: "0.01em" }}>
                {link.desc}
              </div>
              <div style={{
                position: "absolute", bottom: "16px", right: "18px",
                opacity: hoveredCard === i ? 1 : 0,
                transform: hoveredCard === i ? "translateX(0)" : "translateX(-4px)",
                transition: "all 0.25s ease", color: "var(--accent)",
                fontSize: "0.9rem", fontWeight: 600,
              }}>→</div>
            </div>
          ))}
        </div>
        <div className="fade-up stagger-6" style={{
          marginTop: "56px", display: "flex", gap: "56px",
          borderTop: "1px solid var(--rule)", paddingTop: "28px",
          flexWrap: "wrap",
        }}>
          {[
            { num: "8+", label: "Projects shipped" },
            { num: "99.77%", label: "Best model accuracy" },
            { num: "13,000+", label: "Students served" },
            { num: "150 msg/s", label: "Pipeline throughput" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.5rem",
                color: "var(--text)", letterSpacing: "-0.01em",
              }}>{s.num}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px", fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ─── ABOUT ────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "140px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1"><SectionLabel number="01" text="About" /></div>
      <h2 className="fade-up stagger-2" style={{
        fontFamily: "var(--font-heading)", fontWeight: 500,
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.12,
        marginBottom: "56px", letterSpacing: "-0.02em", color: "var(--text)",
      }}>
        Data-driven by nature,<br />
        <span style={{ fontStyle: "italic", color: "var(--accent)" }}>impact-focused</span> by choice.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "56px" }}>
        <div className="fade-up stagger-3">
          <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "20px" }}>
            I'm <strong style={{ color: "var(--text)", fontWeight: 600 }}>Freya Hemal Shah</strong> — an analytical and motivated Data Science student with a strong CS foundation and hands-on experience building real-time analytics pipelines, ML models, and spatial analyses that extract actionable insights.
          </p>
          <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "20px" }}>
            My work spans streaming data through Kafka into Neo4j graphs, scrollytelling visualizations about wage inequality, agentic AI pipelines for financial analysis, geospatial analysis of food access in Phoenix, and coordinating cultural programming for thousands of international students at ASU.
          </p>
          <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--muted)" }}>
            I'm currently seeking a full-time data analyst or data engineering role where I can apply data-driven problem-solving toward impactful business outcomes.
          </p>
        </div>
        <div className="fade-up stagger-4">
          {EDUCATION.map((ed, i) => (
            <div key={i} style={{
              background: "var(--card)", borderRadius: "14px",
              padding: "24px", marginBottom: "14px",
              border: "1px solid var(--rule)",
            }}>
              <div style={{
                fontSize: "0.68rem", fontWeight: 600, color: "var(--accent)",
                letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px",
              }}>{ed.period}</div>
              <h4 style={{
                fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.05rem",
                marginBottom: "4px", color: "var(--text)",
              }}>{ed.degree}</h4>
              <div style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.88rem", marginBottom: "10px" }}>{ed.school}</div>
              {ed.gpa && <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "10px" }}>{ed.gpa}</div>}
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{ed.courses}</div>
            </div>
          ))}
          <div style={{
            background: "var(--card)", borderRadius: "14px",
            padding: "24px", border: "1px solid var(--rule)",
          }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 600, color: "var(--accent)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px",
            }}>Certifications</div>
            {CERTIFICATIONS.map((cert, i) => (
              <div key={i} style={{
                fontSize: "0.88rem", color: "var(--text)", fontWeight: 500,
                marginTop: i === 0 ? 0 : "8px",
                paddingTop: i === 0 ? 0 : "8px",
                borderTop: i === 0 ? "none" : "1px solid var(--rule)",
              }}>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── PROJECT ACTION BUTTONS ──────────────────────────────
function ProjectActions({ proj }) {
  if (!proj.github && !proj.demo) return null;
  return (
    <div style={{
      display: "flex", gap: "10px", marginTop: "24px", flexWrap: "wrap",
      paddingTop: "24px", borderTop: "1px solid var(--rule)",
    }}>
      {proj.demo && (
        <a
          href={proj.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--accent)", color: "var(--bg)",
            padding: "10px 22px", borderRadius: "100px",
            fontSize: "0.85rem", fontWeight: 500,
            textDecoration: "none", transition: "all 0.2s ease",
            fontFamily: "var(--font-body)", letterSpacing: "0.01em",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; }}
        >
          View Project <span>→</span>
        </a>
      )}
      {proj.github && (
        <a
          href={proj.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "transparent", color: "var(--text)",
            border: "1px solid var(--text)",
            padding: "10px 22px", borderRadius: "100px",
            fontSize: "0.85rem", fontWeight: 500,
            textDecoration: "none", transition: "all 0.2s ease",
            fontFamily: "var(--font-body)", letterSpacing: "0.01em",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View Code
        </a>
      )}
    </div>
  );
}
// ─── PROJECTS ─────────────────────────────────────────────
function ProjectCard({ proj, index, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);
  return (
    <div
      className={`fade-up stagger-${Math.min(index + 2, 6)}`}
      style={{
        background: "var(--card)",
        border: `1px solid ${isOpen ? "var(--accent)" : "var(--rule)"}`,
        borderRadius: "18px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: isOpen ? "var(--card-shadow)" : "none",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      <div style={{
        padding: "28px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
            <span style={{
              fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem",
              color: "var(--accent)",
            }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{
              fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              {proj.period}
            </span>
            {(proj.github || proj.demo) && !isOpen && (
              <span style={{
                marginLeft: "auto",
                fontSize: "0.62rem", fontWeight: 600, color: "var(--accent)",
                background: "var(--bg-soft)",
                border: "1px solid var(--rule)",
                padding: "2px 10px", borderRadius: "100px",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                Live
              </span>
            )}
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.3rem",
            lineHeight: 1.3, marginBottom: "8px", color: "var(--text)",
            letterSpacing: "-0.005em",
          }}>
            {proj.title}
          </h3>
          <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.55, fontWeight: 400 }}>
            {proj.tagline}
          </p>
        </div>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: isOpen ? "var(--accent)" : "transparent",
          border: `1px solid ${isOpen ? "var(--accent)" : "var(--rule)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease", flexShrink: 0, marginTop: "2px",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" style={{
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            <path d="M4 6l4 4 4-4" stroke={isOpen ? "var(--bg)" : "var(--muted)"} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div style={{
        maxHeight: isOpen ? `${contentHeight + 40}px` : "0",
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)",
      }}>
        <div ref={contentRef} style={{ padding: "0 32px 32px" }}>
          <div style={{ height: "1px", background: "var(--rule)", marginBottom: "24px" }} />
          <p style={{
            fontSize: "0.96rem", lineHeight: 1.72, color: "var(--text)",
            marginBottom: "20px", fontWeight: 500,
          }}>
            {proj.summary}
          </p>
          <p style={{
            fontSize: "0.9rem", lineHeight: 1.8, color: "var(--muted)",
            marginBottom: "28px",
          }}>
            {proj.description}
          </p>
          <div style={{ display: "flex", gap: "12px", marginBottom: "26px", flexWrap: "wrap" }}>
            {proj.highlights.map((h, i) => (
              <div key={i} style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--rule)",
                borderRadius: "10px", padding: "14px 20px", flex: "1", minWidth: "140px",
                animation: isOpen ? `slideRight 0.4s ease-out ${0.15 + i * 0.1}s both` : "none",
              }}>
                <div style={{
                  fontSize: "0.66rem", fontWeight: 600, color: "var(--muted)",
                  letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px",
                }}>
                  {h.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem",
                  color: "var(--text)", letterSpacing: "-0.01em",
                }}>
                  {h.value}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {proj.tags.map((tag, j) => (
              <span key={j} style={{
                background: "transparent", color: "var(--muted)",
                border: "1px solid var(--rule)",
                padding: "4px 12px", borderRadius: "100px",
                fontSize: "0.74rem", fontWeight: 500,
                animation: isOpen ? `fadeUp 0.3s ease-out ${0.3 + j * 0.04}s both` : "none",
              }}>{tag}</span>
            ))}
          </div>
          <ProjectActions proj={proj} />
        </div>
      </div>
    </div>
  );
}
function ProjectsPage() {
  const [openIndex, setOpenIndex] = useState(null);
  useReveal([openIndex]);
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);
  return (
    <div style={{ minHeight: "100vh", padding: "140px 48px 80px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="fade-up stagger-1"><SectionLabel number="02" text="Projects" /></div>
      <h2 className="fade-up stagger-2" style={{
        fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.12,
        marginBottom: "18px", letterSpacing: "var(--heading-tracking)", color: "var(--text)",
      }}>
        Things I've <span style={{ fontStyle: "italic", color: "var(--accent)" }}>built</span>.
      </h2>
      <p className="fade-up stagger-3" style={{
        fontSize: "1rem", color: "var(--muted)", marginBottom: "56px", maxWidth: "600px", lineHeight: 1.6,
      }}>
        Click any project to expand the full story — what I built, how I built it, and what it achieved.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {PROJECTS.map((proj, i) => (
          <div key={i} className={`reveal reveal-delay-${Math.min(i % 5 + 1, 5)}`}>
            <ProjectCard
              proj={proj}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
// ─── SKILLS ───────────────────────────────────────────────
function SkillCard({ skill, context, catColor }) {
  const [flipped, setFlipped] = useState(false);
  const levelBg = skill.level === "Advanced" ? "var(--accent)" : "var(--accent-soft)";
  return (
    <div
      className={`flip-card hover-lift ${flipped ? "flipped" : ""}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      style={{
        width: "100%", height: "84px",
        cursor: "pointer",
      }}
    >
      <div className="flip-inner">
        {/* FRONT */}
        <div
          className="flip-face"
          style={{
            background: "var(--card)",
            border: "1px solid var(--rule)",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            transition: "border-color 0.2s ease",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{
              display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
              background: levelBg, flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
              fontSize: "0.95rem", color: "var(--text)",
            }}>{skill.name}</span>
          </div>
          <div style={{
            fontSize: "0.68rem", color: "var(--muted)",
            letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
          }}>
            {skill.level} · hover for context
          </div>
        </div>
        {/* BACK */}
        <div
          className="flip-face flip-back"
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            border: "1px solid var(--accent)",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{
            fontSize: "0.66rem",
            letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
            opacity: 0.8, marginBottom: "4px",
          }}>
            Used in
          </div>
          <div style={{
            fontSize: "0.82rem", lineHeight: 1.4, fontWeight: 500,
          }}>
            {context || "Academic & project work"}
          </div>
        </div>
      </div>
    </div>
  );
}
function SkillsPage() {
  useReveal([]);
  const categoryKeys = ["All", ...Object.keys(SKILLS)];
  const [activeTab, setActiveTab] = useState("All");
  const [filter, setFilter] = useState("All");
  const colors = ["var(--accent)", "var(--accent-soft)"];
  // Flatten for filter, or group if specific tab
  const buildDisplay = () => {
    if (activeTab === "All") {
      return Object.entries(SKILLS).map(([cat, skills]) => [
        cat,
        skills.filter(s => filter === "All" || s.level === filter),
      ]).filter(([, skills]) => skills.length > 0);
    }
    return [[
      activeTab,
      SKILLS[activeTab].filter(s => filter === "All" || s.level === filter),
    ]].filter(([, skills]) => skills.length > 0);
  };
  const display = buildDisplay();
  // Totals for filter badges
  const allSkills = Object.values(SKILLS).flat();
  const advCount = allSkills.filter(s => s.level === "Advanced").length;
  const intCount = allSkills.filter(s => s.level === "Intermediate").length;
  return (
    <div style={{ minHeight: "100vh", padding: "140px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1"><SectionLabel number="03" text="Skills" /></div>
      <h2 className="fade-up stagger-2" style={{
        fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.12,
        marginBottom: "18px", letterSpacing: "var(--heading-tracking)", color: "var(--text)",
      }}>
        My <span style={{ fontStyle: "italic", color: "var(--accent)" }}>toolkit</span>.
      </h2>
      <p className="fade-up stagger-3" style={{
        fontSize: "1rem", color: "var(--muted)", marginBottom: "30px", maxWidth: "640px", lineHeight: 1.6,
      }}>
        Hover or tap any skill to see where I've actually used it. Filter by category or proficiency.
      </p>
      {/* CATEGORY TABS */}
      <div className="fade-up stagger-3" style={{
        display: "flex", gap: "6px", flexWrap: "wrap",
        marginBottom: "14px",
      }}>
        {categoryKeys.map((cat) => {
          const active = activeTab === cat;
          const count = cat === "All"
            ? allSkills.length
            : SKILLS[cat].length;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--bg)" : "var(--text)",
                border: `1px solid ${active ? "var(--accent)" : "var(--rule)"}`,
                padding: "8px 16px", borderRadius: "100px",
                fontSize: "0.82rem", fontWeight: 500,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--rule)"; }}
            >
              {cat}
              <span style={{
                fontSize: "0.7rem",
                opacity: active ? 0.8 : 0.6,
                fontWeight: 600,
              }}>{count}</span>
            </button>
          );
        })}
      </div>
      {/* LEVEL FILTER */}
      <div className="fade-up stagger-4" style={{
        display: "flex", gap: "6px", marginBottom: "40px", flexWrap: "wrap",
        alignItems: "center",
      }}>
        <span style={{
          fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600,
          letterSpacing: "0.14em", textTransform: "uppercase", marginRight: "6px",
        }}>Filter</span>
        {[
          { key: "All", label: "All levels", count: allSkills.length, dot: null },
          { key: "Advanced", label: "Advanced", count: advCount, dot: "var(--accent)" },
          { key: "Intermediate", label: "Intermediate", count: intCount, dot: "var(--accent-soft)" },
        ].map(f => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: active ? "var(--bg-soft)" : "transparent",
                color: "var(--text)",
                border: `1px solid ${active ? "var(--accent)" : "var(--rule)"}`,
                padding: "6px 14px", borderRadius: "100px",
                fontSize: "0.78rem", fontWeight: 500,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {f.dot && (
                <span style={{
                  display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
                  background: f.dot,
                }} />
              )}
              {f.label} <span style={{ opacity: 0.55 }}>({f.count})</span>
            </button>
          );
        })}
      </div>
      {/* SKILL GRID BY CATEGORY */}
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {display.map(([cat, skills], ci) => (
          <div key={cat} className={`reveal reveal-delay-${Math.min(ci + 1, 5)}`}>
            <div style={{
              display: "flex", alignItems: "baseline", gap: "14px",
              marginBottom: "18px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--rule)",
            }}>
              <h3 style={{
                fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
                fontSize: "1.15rem", color: "var(--text)", letterSpacing: "-0.005em",
              }}>{cat}</h3>
              <span style={{
                fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500,
                letterSpacing: "0.08em",
              }}>
                {skills.length} {skills.length === 1 ? "tool" : "tools"}
              </span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "10px",
            }}>
              {skills.map((skill) => (
                <SkillCard
                  key={`${cat}-${skill.name}`}
                  skill={skill}
                  context={SKILL_CONTEXT[skill.name]}
                />
              ))}
            </div>
          </div>
        ))}
        {display.length === 0 && (
          <div style={{
            padding: "40px", textAlign: "center",
            background: "var(--card)", border: "1px solid var(--rule)",
            borderRadius: "12px",
            color: "var(--muted)", fontSize: "0.9rem",
          }}>
            No skills match the current filter. Try clearing it.
          </div>
        )}
      </div>
    </div>
  );
}
// ─── EXPERIENCE ───────────────────────────────────────────
function ExperiencePage() {
  useReveal([]);
  return (
    <div style={{ minHeight: "100vh", padding: "140px 48px 80px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="fade-up stagger-1"><SectionLabel number="04" text="Experience" /></div>
      <h2 className="fade-up stagger-2" style={{
        fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.12,
        marginBottom: "56px", letterSpacing: "var(--heading-tracking)", color: "var(--text)",
      }}>
        Where I've <span style={{ fontStyle: "italic", color: "var(--accent)" }}>worked</span>.
      </h2>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: "7px", top: "6px", bottom: "20px",
          width: "1px", background: "var(--rule)",
        }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 5)}`} style={{
            display: "flex", gap: "32px", marginBottom: "36px", position: "relative",
          }}>
            <div style={{
              width: "15px", minWidth: "15px", display: "flex", justifyContent: "center",
              paddingTop: "6px",
            }}>
              <div style={{
                width: "15px", height: "15px", borderRadius: "50%",
                background: i === 0 ? "var(--accent)" : "var(--bg)",
                border: `2px solid var(--accent)`,
                boxShadow: i === 0 ? "0 0 0 4px var(--bg-soft)" : "none",
              }} />
            </div>
            <div className="hover-lift" style={{
              flex: 1, background: "var(--card)", borderRadius: "14px",
              padding: "26px 28px", border: "1px solid var(--rule)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                flexWrap: "wrap", gap: "12px", marginBottom: "14px",
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontWeight: "var(--heading-weight)",
                    fontSize: "1.2rem",
                    color: "var(--text)", letterSpacing: "-0.005em",
                  }}>{exp.role}</h3>
                  <div style={{
                    color: "var(--accent)", fontWeight: 500, fontSize: "0.9rem", marginTop: "4px",
                  }}>{exp.org}</div>
                </div>
                <span style={{
                  background: i === 0 ? "var(--accent)" : "transparent",
                  color: i === 0 ? "var(--bg)" : "var(--muted)",
                  border: i === 0 ? "none" : "1px solid var(--rule)",
                  padding: "5px 14px", borderRadius: "100px",
                  fontSize: "0.74rem", fontWeight: 500, letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                }}>{exp.period}</span>
              </div>
              {exp.points.map((pt, j) => (
                <div key={j} style={{
                  padding: "5px 0", fontSize: "0.9rem", color: "var(--muted)",
                  lineHeight: 1.7, display: "flex", gap: "12px", alignItems: "flex-start",
                }}>
                  <span style={{ color: "var(--accent)", marginTop: "11px", fontSize: "0.35rem", flexShrink: 0 }}>●</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─── CONTACT ──────────────────────────────────────────────
function ContactPage() {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText("freyash2321@gmail.com").then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ minHeight: "100vh", padding: "140px 48px 80px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="fade-up stagger-1"><SectionLabel number="05" text="Contact" /></div>
      <h2 className="fade-up stagger-2" style={{
        fontFamily: "var(--font-heading)", fontWeight: 500,
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.12,
        marginBottom: "22px", letterSpacing: "-0.02em", color: "var(--text)",
      }}>
        Let's <span style={{ fontStyle: "italic", color: "var(--accent)" }}>connect</span>.
      </h2>
      <p className="fade-up stagger-3" style={{
        fontSize: "1.05rem", lineHeight: 1.7, color: "var(--muted)",
        maxWidth: "580px", marginBottom: "48px",
      }}>
        Currently open to full-time data analyst, data engineering, and consulting roles.
        Whether you have an opportunity, a project, or just want to chat — I'd love to hear from you.
      </p>
      <div className="fade-up stagger-4" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", maxWidth: "780px",
      }}>
        {[
          { label: "Email", value: "freyash2321@gmail.com", onClick: copyEmail, action: copied ? "✓ Copied" : "Copy" },
          { label: "LinkedIn", value: "freya-shah-5a608623a", onClick: () => window.open("https://www.linkedin.com/in/freya-shah-5a608623a/", "_blank"), action: "Visit →" },
          { label: "GitHub", value: "freya-23", onClick: () => window.open("https://github.com/freya-23", "_blank"), action: "Visit →" },
        ].map((c, i) => (
          <div key={i} onClick={c.onClick} style={{
            background: "var(--card)", border: "1px solid var(--rule)", borderRadius: "14px",
            padding: "26px", cursor: "pointer", transition: "all 0.25s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              fontSize: "0.68rem", color: "var(--muted)", fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px",
            }}>{c.label}</div>
            <div style={{
              fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1rem",
              wordBreak: "break-all", color: "var(--text)", marginBottom: "14px",
              letterSpacing: "-0.005em",
            }}>{c.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>{c.action}</div>
          </div>
        ))}
      </div>
      <div className="fade-up stagger-5" style={{
        marginTop: "28px", padding: "22px 26px",
        background: "var(--card)", borderRadius: "14px",
        border: "1px solid var(--rule)",
        display: "flex", alignItems: "center", gap: "20px",
        maxWidth: "780px",
      }}>
        <div style={{
          fontSize: "0.68rem", color: "var(--muted)", fontWeight: 600,
          letterSpacing: "0.16em", textTransform: "uppercase",
        }}>Phone</div>
        <div style={{
          fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1rem",
          color: "var(--text)", letterSpacing: "-0.005em",
        }}>+1 (480) 494-3563</div>
      </div>
      <div className="fade-up stagger-6" style={{
        marginTop: "96px", paddingTop: "28px", borderTop: "1px solid var(--rule)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1rem",
          fontStyle: "italic", color: "var(--text)",
        }}>Freya Shah</div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Designed with care · © 2026</div>
      </div>
    </div>
  );
}
// ─── APP ──────────────────────────────────────────────────
export default function Portfolio() {
  const [page, setPage] = useState("Home");
  const [fadeKey, setFadeKey] = useState(0);
  const [colorKey, setColorKey] = useState(() => {
    try { return localStorage.getItem("freya-color") || DEFAULT_COLOR; }
    catch (e) { return DEFAULT_COLOR; }
  });
  const [fontKey, setFontKey] = useState(() => {
    try { return localStorage.getItem("freya-font") || DEFAULT_FONT; }
    catch (e) { return DEFAULT_FONT; }
  });
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("freya-mode") || DEFAULT_MODE; }
    catch (e) { return DEFAULT_MODE; }
  });
  const handleSetColor = (k) => {
    setColorKey(k);
    try { localStorage.setItem("freya-color", k); } catch (e) {}
  };
  const handleSetFont = (k) => {
    setFontKey(k);
    try { localStorage.setItem("freya-font", k); } catch (e) {}
  };
  const handleSetMode = (m) => {
    setMode(m);
    try { localStorage.setItem("freya-mode", m); } catch (e) {}
  };
  const changePage = (p) => {
    setPage(p);
    setFadeKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const render = () => {
    switch (page) {
      case "Home": return <HomePage setPage={changePage} />;
      case "About": return <AboutPage />;
      case "Projects": return <ProjectsPage />;
      case "Skills": return <SkillsPage />;
      case "Experience": return <ExperiencePage />;
      case "Contact": return <ContactPage />;
      default: return <HomePage setPage={changePage} />;
    }
  };
  return (
    <>
      <style>{buildFontsCSS(colorKey, fontKey, mode)}</style>
      <Page>
        <Navbar activePage={page} setPage={changePage} />
        <div key={fadeKey} style={{ animation: "scaleIn 0.3s ease-out" }}>{render()}</div>
        <DesignPanel
          colorKey={colorKey} setColor={handleSetColor}
          fontKey={fontKey} setFont={handleSetFont}
          mode={mode} setMode={handleSetMode}
        />
      </Page>
    </>
  );
}
