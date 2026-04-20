import React, { useState, useEffect, useRef } from "react";
const FONTS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  :root {
    --bg1: #FFF7F2;
    --bg2: #F3EAFF;
    --accent: #D9604A;
    --accent2: #8B5CF6;
    --text: #2D2235;
    --muted: #7A7089;
    --card: rgba(255,255,255,0.7);
    --card-border: rgba(180,160,200,0.2);
    --card-shadow: 0 4px 30px rgba(139,92,246,0.06);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
  }
  ::selection {
    background: var(--accent2);
    color: white;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(35px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-14px); }
  }
  @keyframes shimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes blobMove {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes expandIn {
    from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; }
    to { opacity: 1; max-height: 600px; padding-top: 24px; padding-bottom: 24px; margin-top: 16px; }
  }
  @keyframes collapseOut {
    from { opacity: 1; max-height: 600px; }
    to { opacity: 0; max-height: 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.15); }
    50% { box-shadow: 0 0 20px 4px rgba(139,92,246,0.1); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.7s ease-out forwards; }
  .stagger-1 { animation-delay: 0.1s; opacity: 0; }
  .stagger-2 { animation-delay: 0.2s; opacity: 0; }
  .stagger-3 { animation-delay: 0.3s; opacity: 0; }
  .stagger-4 { animation-delay: 0.4s; opacity: 0; }
  .stagger-5 { animation-delay: 0.5s; opacity: 0; }
  .stagger-6 { animation-delay: 0.6s; opacity: 0; }
`;
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
    color: "#0891B2",
    github: "https://github.com/freya-23/phoenix-food-desert-analysis",
    demo: "https://github.com/freya-23/phoenix-food-desert-analysis#readme",
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
    color: "var(--accent2)",
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
    color: "var(--accent)",
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
    color: "#E67E22",
  },
  {
    title: "Alzheimer's Risk Prediction",
    period: "Research Project",
    tagline: "Interpretable ML for responsible early diagnosis.",
    summary: "Built an interpretable ML pipeline using XGBoost with SHAP and LIME explanations, designed to be fair across demographic groups.",
    description: "Healthcare ML comes with unique responsibilities — the model needs to be not just accurate, but explainable and fair. This project built an end-to-end pipeline for predicting Alzheimer's disease risk from patient health records. I trained an XGBoost classifier that achieved 90.9% accuracy, then layered on SHAP (SHapley Additive exPlanations) for global feature importance and LIME (Local Interpretable Model-agnostic Explanations) for individual prediction explanations. This means a clinician could see not just \"high risk\" but exactly which factors (age, cognitive test scores, biomarkers) drove that prediction. Crucially, I also conducted fairness audits across age groups, gender, and ethnicity to ensure the model didn't systematically underperform for any demographic — a common pitfall in medical AI that can reinforce existing healthcare disparities.",
    highlights: [
      { label: "Accuracy", value: "90.9%" },
      { label: "Explainability", value: "SHAP + LIME" },
      { label: "Fairness", value: "Audited across demographics" },
    ],
    tags: ["XGBoost", "SHAP", "LIME", "Healthcare ML", "Fairness", "Interpretability"],
    color: "#10B981",
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
    color: "#6366F1",
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
    color: "#EC4899",
  },
];
const SKILLS = {
  "Languages": [
    { name: "Python", level: "Advanced", pct: 92 },
    { name: "SQL", level: "Advanced", pct: 88 },
    { name: "R", level: "Intermediate", pct: 70 },
    { name: "C", level: "Intermediate", pct: 65 },
    { name: "C#", level: "Intermediate", pct: 60 },
    { name: "Clingo", level: "Beginner", pct: 45 },
    { name: "CSS", level: "Intermediate", pct: 68 },
  ],
  "Data Science & ML": [
    { name: "Pandas", level: "Advanced", pct: 90 },
    { name: "Scikit-learn", level: "Advanced", pct: 88 },
    { name: "NumPy", level: "Advanced", pct: 87 },
    { name: "Tableau", level: "Advanced", pct: 85 },
    { name: "Matplotlib", level: "Intermediate", pct: 80 },
    { name: "Seaborn", level: "Intermediate", pct: 75 },
    { name: "Statistical Modeling", level: "Intermediate", pct: 78 },
    { name: "MySQL", level: "Advanced", pct: 85 },
    { name: "ARIMA", level: "Intermediate", pct: 70 },
    { name: "DBMS", level: "Advanced", pct: 82 },
  ],
  "Tools & Infra": [
    { name: "Git", level: "Advanced", pct: 90 },
    { name: "Docker", level: "Intermediate", pct: 75 },
    { name: "Neo4j", level: "Intermediate", pct: 72 },
    { name: "Kafka", level: "Intermediate", pct: 70 },
    { name: "Kafka Connect", level: "Intermediate", pct: 68 },
    { name: "Kubernetes", level: "Beginner", pct: 55 },
    { name: "QGIS", level: "Intermediate", pct: 65 },
  ],
  "Platforms": [
    { name: "Figma", level: "Advanced", pct: 85 },
    { name: "Canva", level: "Advanced", pct: 88 },
    { name: "Adobe XD", level: "Intermediate", pct: 65 },
    { name: "Microsoft Excel", level: "Advanced", pct: 85 },
    { name: "GIS", level: "Intermediate", pct: 60 },
    { name: "Cloud Tools", level: "Intermediate", pct: 60 },
  ],
};
const EXPERIENCE = [
  {
    role: "Indian Student Support Assistant",
    org: "Arizona State University – ISSC",
    period: "Aug 2025 – Present",
    points: [
      "Coordinate university-wide, culturally inclusive events for 10,000+ international students across multiple departments.",
      "Collect, clean, and analyze event participation and engagement datasets to identify turnout drivers and demographic preferences.",
      "Translate event data into actionable recommendations that improved student engagement outcomes.",
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
    role: "Intern – Robotics Division",
    org: "MNT Infovision Pvt Ltd",
    period: "May 2023 – Aug 2023",
    points: [
      "Customized robotic systems for healthcare and hospitality clients, identifying 3+ automation opportunities.",
      "Delivered market analysis presentations contributing to pilot partnerships with TAJ Hotels and Resorts.",
    ],
  },
];
const EDUCATION = [
  { degree: "M.S. in Data Science, Analytics and Engineering", school: "Arizona State University, Tempe, Arizona", period: "Graduating May 2026", gpa: "GPA: 3.63", courses: "Data Mining, Information Assurance & Security, Data Processing at Scale, Statistics for Data Analysts, Statistical Machine Learning, Data Visualization" },
  { degree: "B.S. Honors in Computer Science", school: "Ahmedabad University, Gujarat, India", period: "May 2024", courses: "Machine Learning, Data Structures & Algorithms, Human-Computer Interactions, OOP, Operating Systems, Probabilistic Graphical Models" },
];
const OTHER_PROJECTS = [
  {
    title: "Football Tournament Booking Platform",
    period: "Design Project",
    tagline: "Human-centered design for seamless sports booking.",
    description: "Designed and prototyped a full football tournament booking platform with a human-centered design (HCD) approach. The project followed the double-diamond design process: starting with user research and contextual inquiry to understand pain points in existing tournament booking systems, then synthesizing insights into personas and journey maps. I designed wireframes and high-fidelity prototypes in Figma, focusing on intuitive navigation for booking fields, managing team registrations, viewing bracket schedules, and handling payments. Conducted usability testing with real users and iterated on feedback to improve task completion rates and reduce booking errors.",
    tags: ["Figma", "HCI", "User Research", "Prototyping", "Usability Testing"],
    color: "#14B8A6",
    highlights: [
      { label: "Approach", value: "Human-Centered Design" },
      { label: "Tools", value: "Figma + Research" },
    ],
  },
  {
    title: "2D Flappy Bird Game",
    period: "Game Dev Project",
    tagline: "Physics, collision, and pixel-perfect fun — built from scratch.",
    description: "Built a fully functional 2D Flappy Bird clone using C# in the Unity game engine. Implemented core game mechanics from the ground up: gravity-based physics for the bird's movement, procedurally generated pipe obstacles with randomized gap positions, collision detection using Unity's 2D physics engine, and a scoring system that tracks the player's best run. Added polish through sprite animations, particle effects on collision, a start/game-over screen flow, and smooth difficulty scaling (pipes gradually speed up and gaps narrow). This project was a deep dive into Unity's component-based architecture, MonoBehaviour lifecycle, and real-time game loops.",
    tags: ["C#", "Unity", "Game Physics", "2D Graphics", "Procedural Generation"],
    color: "#F97316",
    highlights: [
      { label: "Engine", value: "Unity" },
      { label: "Language", value: "C#" },
    ],
  },
  {
    title: "Music Library Management System",
    period: "Full-Stack Project",
    tagline: "Python frontend meets optimized SQL — built for scale.",
    description: "Engineered a complete music library management system with a Python-based frontend and a relational database backend. The frontend provided intuitive search, browse, and playlist management through a clean terminal UI with fuzzy search capabilities. On the backend, I designed a normalized relational schema (artists, albums, tracks, playlists, genres) and wrote optimized SQL queries with proper indexing for high-performance lookups — even with thousands of songs. Key features included: full CRUD operations, playlist creation with drag-and-drop ordering, advanced filtering (by genre, year, artist, duration), and bulk import from CSV. The architecture was designed with scalability in mind, using connection pooling and prepared statements to handle concurrent users.",
    tags: ["Python", "SQL", "Relational DB", "Query Optimization", "Full-Stack"],
    color: "#8B5CF6",
    highlights: [
      { label: "Frontend", value: "Python CLI" },
      { label: "Backend", value: "Relational SQL" },
    ],
  },
];
const PAGES = ["Home", "About", "Projects", "Skills", "Experience", "Contact"];
// ─── SHARED ───────────────────────────────────────────────
function GradientBG({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--bg1) 0%, #FEF0E8 25%, #F5ECFF 50%, var(--bg2) 75%, #EDE4FF 100%)",
      backgroundAttachment: "fixed", position: "relative",
    }}>
      <div style={{ position: "fixed", top: "10%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", borderRadius: "50%", animation: "blobMove 12s ease-in-out infinite, float 7s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "15%", left: "3%", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(217,96,74,0.07) 0%, transparent 70%)", borderRadius: "50%", animation: "blobMove 10s ease-in-out infinite 3s, float 9s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
function Navbar({ activePage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 40px", background: scrolled ? "rgba(255,247,242,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--card-border)" : "none", transition: "all 0.3s ease", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div onClick={() => setPage("Home")} style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.5rem", cursor: "pointer", fontStyle: "italic", color: "var(--accent)", letterSpacing: "-0.02em" }}>F. Shah</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {PAGES.filter(p => p !== "Home").map(page => (
          <button key={page} onClick={() => setPage(page)} style={{
            background: activePage === page ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "transparent",
            color: activePage === page ? "white" : "var(--muted)", border: "none", padding: "8px 18px", borderRadius: "30px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.25s ease",
          }}
            onMouseEnter={e => { if (activePage !== page) e.target.style.color = "var(--text)"; }}
            onMouseLeave={e => { if (activePage !== page) e.target.style.color = "var(--muted)"; }}
          >{page}</button>
        ))}
      </div>
    </nav>
  );
}
// ─── HOME ─────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [typedIndex, setTypedIndex] = useState(0);
  const roles = ["Data Scientist", "ML Engineer", "Visual Storyteller", "Pipeline Builder", "Problem Solver"];
  useEffect(() => {
    const interval = setInterval(() => {
      setTypedIndex(prev => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  const quickLinks = [
    { label: "Real-Time Pipelines", icon: "⚡", desc: "Kafka + Neo4j + K8s", page: "Projects", color: "var(--accent2)" },
    { label: "ML & AI Models", icon: "🧠", desc: "XGBoost, FinBERT, CNNs", page: "Projects", color: "var(--accent)" },
    { label: "Spatial Analysis", icon: "🗺️", desc: "QGIS + Python + USDA", page: "Projects", color: "#0891B2" },
    { label: "Community Impact", icon: "🌍", desc: "10,000+ students served", page: "Experience", color: "#10B981" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 80px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ width: "100%" }}>
        {/* Rotating role tag */}
        <div className="fade-up stagger-1" style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "var(--card)", backdropFilter: "blur(10px)",
          border: "1px solid var(--card-border)", borderRadius: "40px",
          padding: "8px 20px 8px 12px", marginBottom: "24px",
        }}>
          <span style={{
            display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
            background: "var(--accent2)", animation: "pulseGlow 2s ease-in-out infinite",
          }} />
          <span key={typedIndex} style={{
            fontSize: "0.88rem", fontWeight: 600, color: "var(--accent2)",
            animation: "fadeUp 0.4s ease-out",
          }}>
            {roles[typedIndex]}
          </span>
        </div>
        <h1 className="fade-up stagger-2" style={{
          fontFamily: "'Fraunces', serif", fontWeight: 800,
          fontSize: "clamp(3rem, 7.5vw, 6rem)", lineHeight: 1.0,
          letterSpacing: "-0.03em", marginBottom: "28px",
        }}>
          Hi, I'm{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 20%, var(--accent2) 80%)",
            backgroundSize: "200% 200%", animation: "shimmer 5s ease infinite",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic",
          }}>Freya</span>
          <span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="fade-up stagger-3" style={{
          fontSize: "1.2rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "600px", marginBottom: "44px",
        }}>
          I'm a Data Science grad student at ASU who loves building things that
          actually work — from real-time streaming pipelines that process thousands
          of messages per second, to interactive visualizations that make complex
          data click. Currently looking for my next full-time adventure.
        </p>
        <div className="fade-up stagger-4" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "60px" }}>
          <button onClick={() => setPage("Projects")} style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            color: "white", border: "none", padding: "14px 36px", borderRadius: "50px",
            cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 30px rgba(139,92,246,0.25)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >View My Work →</button>
          <button onClick={() => setPage("Contact")} style={{
            background: "var(--card)", color: "var(--text)",
            border: "1px solid var(--card-border)", padding: "14px 36px", borderRadius: "50px",
            cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s ease", backdropFilter: "blur(10px)",
          }}
            onMouseEnter={e => e.target.style.borderColor = "var(--accent2)"}
            onMouseLeave={e => e.target.style.borderColor = "var(--card-border)"}
          >Get in Touch</button>
        </div>
        {/* Interactive quick-link cards */}
        <div className="fade-up stagger-5" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px",
        }}>
          {quickLinks.map((link, i) => (
            <div
              key={i}
              onClick={() => setPage(link.page)}
              onMouseEnter={() => setHoveredRole(i)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                background: "var(--card)", backdropFilter: "blur(10px)",
                border: `1px solid ${hoveredRole === i ? link.color : "var(--card-border)"}`,
                borderRadius: "18px", padding: "22px 20px", cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: hoveredRole === i ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hoveredRole === i ? `0 12px 30px ${link.color}18` : "var(--card-shadow)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Hover glow */}
              <div style={{
                position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px",
                background: `radial-gradient(circle, ${link.color}15 0%, transparent 70%)`,
                opacity: hoveredRole === i ? 1 : 0, transition: "opacity 0.3s ease",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>{link.icon}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
                  {link.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>
                  {link.desc}
                </div>
              </div>
              {/* Arrow that appears on hover */}
              <div style={{
                position: "absolute", bottom: "16px", right: "16px",
                opacity: hoveredRole === i ? 1 : 0,
                transform: hoveredRole === i ? "translateX(0)" : "translateX(-8px)",
                transition: "all 0.3s ease", color: link.color, fontSize: "0.85rem", fontWeight: 700,
              }}>→</div>
            </div>
          ))}
        </div>
        {/* Bottom stats */}
        <div className="fade-up stagger-6" style={{
          marginTop: "50px", display: "flex", gap: "50px",
          borderTop: "1px solid var(--card-border)", paddingTop: "28px",
        }}>
          {[
            { num: "7+", label: "Projects Shipped" },
            { num: "99.77%", label: "Best Model Accuracy" },
            { num: "10,000+", label: "Students Served" },
            { num: "150 msg/s", label: "Pipeline Throughput" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--accent)" }}>{s.num}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "3px", fontWeight: 500 }}>{s.label}</div>
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
    <div style={{ minHeight: "100vh", padding: "120px 80px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>01 — About</div>
      <h2 className="fade-up stagger-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.1, marginBottom: "50px" }}>
        Data-driven by nature,<br /><span style={{ color: "var(--accent)", fontStyle: "italic" }}>impact-focused</span> by choice.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "50px" }}>
        <div className="fade-up stagger-3">
          <p style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "22px" }}>
            I'm <strong style={{ color: "var(--text)" }}>Freya Hemal Shah</strong> — an analytical and motivated Data Science student with a strong CS foundation and hands-on experience building real-time analytics pipelines and ML models to extract actionable insights.
          </p>
          <p style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "22px" }}>
            My work ranges from streaming data through Kafka into Neo4j graphs, to building scrollytelling visualizations about wage inequality, to coordinating cultural events for thousands of international students at ASU.
          </p>
          <p style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--muted)" }}>
            I'm seeking a full-time role where I can apply data-driven problem-solving and technical expertise toward impactful business outcomes.
          </p>
        </div>
        <div className="fade-up stagger-4">
          {EDUCATION.map((ed, i) => (
            <div key={i} style={{ background: "var(--card)", backdropFilter: "blur(10px)", borderRadius: "18px", padding: "28px", marginBottom: "16px", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>{ed.period}</div>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>{ed.degree}</h4>
              <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "10px" }}>{ed.school}</div>
              {ed.gpa && <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{ed.gpa}</div>}
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{ed.courses}</div>
            </div>
          ))}
          <div style={{ background: "var(--card)", backdropFilter: "blur(10px)", borderRadius: "18px", padding: "24px", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Certifications</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>C-Programming (C-Tag)</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500, marginTop: "4px" }}>C# Programming for Unity Game Development</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── PROJECT ACTION BUTTONS (shared) ─────────────────────
function ProjectActions({ proj }) {
  if (!proj.github && !proj.demo) return null;
  return (
    <div style={{
      display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap",
      paddingTop: "20px", borderTop: `1px dashed ${proj.color}25`,
    }}>
      {proj.demo && (
        <a
          href={proj.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: proj.color, color: "white",
            padding: "10px 22px", borderRadius: "30px",
            fontSize: "0.82rem", fontWeight: 600,
            textDecoration: "none", transition: "all 0.2s ease",
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${proj.color}40`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
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
            background: "transparent", color: proj.color,
            border: `1.5px solid ${proj.color}`,
            padding: "10px 22px", borderRadius: "30px",
            fontSize: "0.82rem", fontWeight: 600,
            textDecoration: "none", transition: "all 0.2s ease",
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${proj.color}12`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View Code
        </a>
      )}
    </div>
  );
}
// ─── PROJECTS (Interactive!) ──────────────────────────────
function ProjectCard({ proj, index, isOpen, onToggle, isAnyOpen }) {
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
        backdropFilter: "blur(10px)",
        border: `1.5px solid ${isOpen ? proj.color : "var(--card-border)"}`,
        borderRadius: "24px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isOpen ? `0 20px 60px ${proj.color}20` : "var(--card-shadow)",
        transform: isOpen ? "scale(1.01)" : "scale(1)",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={onToggle}
    >
      {/* Accent gradient stripe at top */}
      <div style={{
        height: "4px",
        background: `linear-gradient(90deg, ${proj.color}, ${proj.color}66)`,
        transition: "opacity 0.3s ease",
        opacity: isOpen ? 1 : 0.4,
      }} />
      {/* Header — always visible */}
      <div style={{ padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "30px", height: "30px", borderRadius: "10px",
              background: `${proj.color}15`, color: proj.color,
              fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "0.82rem",
            }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: proj.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {proj.period}
            </span>
            {(proj.github || proj.demo) && !isOpen && (
              <span style={{
                marginLeft: "auto",
                fontSize: "0.65rem", fontWeight: 700, color: proj.color,
                background: `${proj.color}15`,
                padding: "3px 10px", borderRadius: "12px",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Live
              </span>
            )}
          </div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.35rem", lineHeight: 1.3, marginBottom: "8px" }}>
            {proj.title}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.5 }}>
            {proj.tagline}
          </p>
        </div>
        {/* Toggle indicator */}
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: isOpen ? proj.color : `${proj.color}10`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.35s ease", flexShrink: 0, marginTop: "4px",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{
            transition: "transform 0.35s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            <path d="M4 6l4 4 4-4" stroke={isOpen ? "white" : proj.color} strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* Expandable content — slides out from inside */}
      <div style={{
        maxHeight: isOpen ? `${contentHeight + 40}px` : "0",
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div ref={contentRef} style={{ padding: "0 32px 32px" }}>
          {/* Divider */}
          <div style={{ height: "1px", background: `linear-gradient(90deg, ${proj.color}30, transparent)`, marginBottom: "24px" }} />
          {/* Summary */}
          <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "20px", fontWeight: 500 }}>
            {proj.summary}
          </p>
          {/* Full description */}
          <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "24px" }}>
            {proj.description}
          </p>
          {/* Highlights — metric cards */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            {proj.highlights.map((h, i) => (
              <div key={i} style={{
                background: `${proj.color}08`, border: `1px solid ${proj.color}20`,
                borderRadius: "14px", padding: "14px 20px", flex: "1", minWidth: "140px",
                animation: isOpen ? `slideRight 0.4s ease-out ${0.15 + i * 0.1}s both` : "none",
              }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {h.label}
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", color: proj.color }}>
                  {h.value}
                </div>
              </div>
            ))}
          </div>
          {/* Tags */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {proj.tags.map((tag, j) => (
              <span key={j} style={{
                background: `${proj.color}10`, color: proj.color,
                padding: "5px 14px", borderRadius: "20px", fontSize: "0.74rem", fontWeight: 600,
                animation: isOpen ? `fadeUp 0.3s ease-out ${0.3 + j * 0.04}s both` : "none",
              }}>{tag}</span>
            ))}
          </div>
          {/* Action buttons — GitHub / Live Demo */}
          <ProjectActions proj={proj} />
        </div>
      </div>
    </div>
  );
}
function ProjectsPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [openOther, setOpenOther] = useState(null);
  const toggle = (i) => {
    setOpenIndex(prev => prev === i ? null : i);
    if (openOther !== null) setOpenOther(null);
  };
  const toggleOther = (i) => {
    setOpenOther(prev => prev === i ? null : i);
    if (openIndex !== null) setOpenIndex(null);
  };
  return (
    <div style={{ minHeight: "100vh", padding: "120px 80px 80px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="fade-up stagger-1" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>
        02 — Projects
      </div>
      <h2 className="fade-up stagger-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.1, marginBottom: "16px" }}>
        Things I've <span style={{ color: "var(--accent)", fontStyle: "italic" }}>built</span>.
      </h2>
      <p className="fade-up stagger-2" style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: "50px" }}>
        Click on any project to expand the full story — what I built, how I built it, and what it achieved.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {PROJECTS.map((proj, i) => (
          <ProjectCard
            key={i}
            proj={proj}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            isAnyOpen={openIndex !== null}
          />
        ))}
      </div>
      {/* Other projects — now interactive too */}
      <div className="fade-up stagger-5" style={{ marginTop: "40px" }}>
        <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "18px", color: "var(--text)", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ display: "inline-block", width: "30px", height: "2px", background: "linear-gradient(90deg, var(--accent2), transparent)" }} />
          More Projects
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {OTHER_PROJECTS.map((proj, i) => {
            const isOpen = openOther === i;
            return (
              <div
                key={i}
                onClick={() => toggleOther(i)}
                style={{
                  background: "var(--card)",
                  backdropFilter: "blur(10px)",
                  border: `1.5px solid ${isOpen ? proj.color : "var(--card-border)"}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isOpen ? `0 16px 50px ${proj.color}18` : "var(--card-shadow)",
                  cursor: "pointer",
                  transform: isOpen ? "scale(1.01)" : "scale(1)",
                }}
              >
                {/* Color stripe */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${proj.color}, ${proj.color}44)`, opacity: isOpen ? 1 : 0.3, transition: "opacity 0.3s ease" }} />
                {/* Header */}
                <div style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "24px", height: "24px", borderRadius: "8px",
                        background: `${proj.color}15`, color: proj.color,
                        fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "0.7rem",
                      }}>
                        +{i + 1}
                      </span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, color: proj.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {proj.period}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.3 }}>
                      {proj.title}
                    </h3>
                    {!isOpen && (
                      <p style={{ fontSize: "0.82rem", color: "var(--muted)", fontStyle: "italic", marginTop: "4px" }}>
                        {proj.tagline}
                      </p>
                    )}
                  </div>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: isOpen ? proj.color : `${proj.color}10`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.35s ease", flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" style={{
                      transition: "transform 0.35s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      <path d="M4 6l4 4 4-4" stroke={isOpen ? "white" : proj.color} strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                {/* Expandable content */}
                <div style={{
                  maxHeight: isOpen ? "500px" : "0",
                  opacity: isOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                  <div style={{ padding: "0 28px 28px" }}>
                    <div style={{ height: "1px", background: `linear-gradient(90deg, ${proj.color}30, transparent)`, marginBottom: "20px" }} />
                    <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "20px" }}>
                      {proj.description}
                    </p>
                    {/* Highlights */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                      {proj.highlights.map((h, hi) => (
                        <div key={hi} style={{
                          background: `${proj.color}08`, border: `1px solid ${proj.color}20`,
                          borderRadius: "12px", padding: "10px 16px",
                          animation: isOpen ? `slideRight 0.4s ease-out ${0.15 + hi * 0.1}s both` : "none",
                        }}>
                          <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                            {h.label}
                          </div>
                          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.95rem", color: proj.color }}>
                            {h.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Tags */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {proj.tags.map((tag, j) => (
                        <span key={j} style={{
                          background: `${proj.color}10`, color: proj.color,
                          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 600,
                          animation: isOpen ? `fadeUp 0.3s ease-out ${0.3 + j * 0.04}s both` : "none",
                        }}>{tag}</span>
                      ))}
                    </div>
                    {/* Action buttons if any */}
                    <ProjectActions proj={proj} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// ─── SKILLS ───────────────────────────────────────────────
function SkillsPage() {
  const [active, setActive] = useState(Object.keys(SKILLS)[0]);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [animated, setAnimated] = useState(false);
  const colors = ["var(--accent)", "var(--accent2)", "#E67E22", "#10B981"];
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [active]);
  const levelColor = (level) => {
    if (level === "Advanced") return "#10B981";
    if (level === "Intermediate") return "#F59E0B";
    return "#94A3B8";
  };
  const levelEmoji = (level) => {
    if (level === "Advanced") return "🟢";
    if (level === "Intermediate") return "🟡";
    return "⚪";
  };
  const skills = SKILLS[active];
  const ci = Object.keys(SKILLS).indexOf(active);
  const catColor = colors[ci];
  // Stats for the active category
  const advCount = skills.filter(s => s.level === "Advanced").length;
  const intCount = skills.filter(s => s.level === "Intermediate").length;
  const begCount = skills.filter(s => s.level === "Beginner").length;
  return (
    <div style={{ minHeight: "100vh", padding: "120px 80px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>03 — Skills</div>
      <h2 className="fade-up stagger-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.1, marginBottom: "50px" }}>
        My <span style={{ fontStyle: "italic", color: "var(--accent2)" }}>toolkit</span>.
      </h2>
      {/* Category tabs */}
      <div className="fade-up stagger-3" style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {Object.keys(SKILLS).map((cat, i) => (
          <button key={cat} onClick={() => setActive(cat)} style={{
            background: active === cat ? `linear-gradient(135deg, ${colors[i]}, ${colors[(i + 1) % colors.length]})` : "var(--card)",
            color: active === cat ? "white" : "var(--muted)",
            border: `1px solid ${active === cat ? "transparent" : "var(--card-border)"}`,
            padding: "10px 24px", borderRadius: "30px", cursor: "pointer",
            fontSize: "0.88rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            transition: "all 0.25s ease", backdropFilter: "blur(10px)",
          }}>{cat}</button>
        ))}
      </div>
      {/* Level legend + category summary */}
      <div className="fade-up stagger-3" style={{
        display: "flex", gap: "24px", marginBottom: "30px", alignItems: "center", flexWrap: "wrap",
      }}>
        {[
          { label: "Advanced", emoji: "🟢", count: advCount },
          { label: "Intermediate", emoji: "🟡", count: intCount },
          { label: "Beginner", emoji: "⚪", count: begCount },
        ].filter(l => l.count > 0).map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--muted)" }}>
            <span>{l.emoji}</span>
            <span style={{ fontWeight: 600 }}>{l.count}</span>
            <span>{l.label}</span>
          </div>
        ))}
      </div>
      {/* Skills with proficiency bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {skills.map((skill, i) => (
          <div
            key={`${active}-${skill.name}`}
            onMouseEnter={() => setHoveredSkill(i)}
            onMouseLeave={() => setHoveredSkill(null)}
            style={{
              background: "var(--card)", backdropFilter: "blur(10px)",
              border: `1px solid ${hoveredSkill === i ? catColor : "var(--card-border)"}`,
              borderRadius: "16px", padding: "18px 24px",
              transition: "all 0.3s ease", cursor: "default",
              boxShadow: hoveredSkill === i ? `0 8px 25px ${catColor}12` : "var(--card-shadow)",
              transform: hoveredSkill === i ? "translateX(6px)" : "translateX(0)",
              animation: `fadeUp 0.4s ease-out ${i * 0.06}s both`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.85rem" }}>{levelEmoji(skill.level)}</span>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem" }}>
                  {skill.name}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  background: `${levelColor(skill.level)}18`,
                  color: levelColor(skill.level),
                  padding: "3px 12px", borderRadius: "20px",
                  fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  {skill.level}
                </span>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem", color: catColor, minWidth: "36px", textAlign: "right" }}>
                  {skill.pct}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{
              height: "6px", borderRadius: "4px",
              background: "rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "4px",
                background: `linear-gradient(90deg, ${catColor}, ${levelColor(skill.level)})`,
                width: animated ? `${skill.pct}%` : "0%",
                transition: `width 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s`,
              }} />
            </div>
          </div>
        ))}
      </div>
      {/* Everything at a Glance */}
      <div className="fade-up stagger-5" style={{
        marginTop: "60px", padding: "32px", background: "var(--card)", backdropFilter: "blur(10px)",
        borderRadius: "20px", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)",
      }}>
        <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", marginBottom: "18px", color: "var(--muted)" }}>Everything at a Glance</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {Object.entries(SKILLS).flatMap(([cat, skills], ci) =>
            skills.map(skill => (
              <span key={`${cat}-${skill.name}`} style={{
                background: `${colors[ci]}0D`, color: colors[ci],
                border: `1px solid ${colors[ci]}25`,
                padding: "6px 16px", borderRadius: "30px", fontSize: "0.78rem", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <span style={{ fontSize: "0.6rem" }}>{levelEmoji(skill.level)}</span>
                {skill.name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// ─── EXPERIENCE ───────────────────────────────────────────
function ExperiencePage() {
  return (
    <div style={{ minHeight: "100vh", padding: "120px 80px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>04 — Experience</div>
      <h2 className="fade-up stagger-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.1, marginBottom: "50px" }}>
        Where I've <span style={{ color: "var(--accent)", fontStyle: "italic" }}>worked</span>.
      </h2>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "22px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, var(--accent), var(--accent2), transparent)", borderRadius: "2px" }} />
        {EXPERIENCE.map((exp, i) => (
          <div key={i} className={`fade-up stagger-${i + 3}`} style={{ display: "flex", gap: "36px", marginBottom: "40px", position: "relative" }}>
            <div style={{ width: "46px", minWidth: "46px", display: "flex", justifyContent: "center", paddingTop: "6px" }}>
              <div style={{
                width: "14px", height: "14px", borderRadius: "50%",
                background: i === 0 ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "white",
                border: `2px solid ${i === 0 ? "var(--accent)" : "var(--accent2)"}`,
                boxShadow: i === 0 ? "0 0 16px rgba(217,96,74,0.3)" : "none",
              }} />
            </div>
            <div style={{ flex: 1, background: "var(--card)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "30px", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)", transition: "all 0.3s ease" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = i === 0 ? "var(--accent)" : "var(--accent2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--card-border)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.3rem" }}>{exp.role}</h3>
                  <div style={{ color: "var(--accent2)", fontWeight: 600, fontSize: "0.92rem", marginTop: "4px" }}>{exp.org}</div>
                </div>
                <span style={{
                  background: i === 0 ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--card)",
                  color: i === 0 ? "white" : "var(--muted)",
                  border: i === 0 ? "none" : "1px solid var(--card-border)",
                  padding: "6px 16px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600,
                }}>{exp.period}</span>
              </div>
              {exp.points.map((pt, j) => (
                <div key={j} style={{ padding: "6px 0", fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.65, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", marginTop: "8px", fontSize: "0.35rem" }}>●</span>{pt}
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
  const copyEmail = () => { navigator.clipboard.writeText("freyash2321@gmail.com").then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  return (
    <div style={{ minHeight: "100vh", padding: "120px 80px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="fade-up stagger-1" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>05 — Contact</div>
      <h2 className="fade-up stagger-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.1, marginBottom: "20px" }}>
        Let's <span style={{ color: "var(--accent2)", fontStyle: "italic" }}>connect</span>.
      </h2>
      <p className="fade-up stagger-3" style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "560px", marginBottom: "50px" }}>
        Currently open to full-time data analyst, data engineering, and consulting roles. Whether you have an opportunity, a project, or just want to chat — I'd love to hear from you.
      </p>
      <div className="fade-up stagger-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", maxWidth: "800px" }}>
        {[
          { icon: "📧", label: "Email", value: "freyash2321@gmail.com", onClick: copyEmail, action: copied ? "✓ Copied!" : "Copy Email" },
          { icon: "💼", label: "LinkedIn", value: "freya-shah-5a608623a", onClick: () => window.open("https://www.linkedin.com/in/freya-shah-5a608623a/", "_blank"), action: "Visit →" },
          { icon: "🐙", label: "GitHub", value: "freya-23", onClick: () => window.open("https://github.com/freya-23", "_blank"), action: "Visit →" },
        ].map((c, i) => (
          <div key={i} onClick={c.onClick} style={{
            background: "var(--card)", backdropFilter: "blur(10px)", border: "1px solid var(--card-border)", borderRadius: "20px",
            padding: "30px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "var(--card-shadow)",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "14px" }}>{c.icon}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>{c.label}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.95rem", wordBreak: "break-all" }}>{c.value}</div>
            <div style={{ marginTop: "14px", fontSize: "0.82rem", color: "var(--accent2)", fontWeight: 600 }}>{c.action}</div>
          </div>
        ))}
      </div>
      <div className="fade-up stagger-6" style={{ marginTop: "60px", padding: "28px", background: "var(--card)", backdropFilter: "blur(10px)", borderRadius: "20px", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "1.4rem" }}>📞</span>
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Phone</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.05rem" }}>+1 (480) 494-3563</div>
        </div>
      </div>
      <div className="fade-up stagger-6" style={{ marginTop: "100px", paddingTop: "30px", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.1rem", fontStyle: "italic", color: "var(--accent)" }}>F. Shah</div>
        <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Designed with care · © 2026</div>
      </div>
    </div>
  );
}
// ─── APP ──────────────────────────────────────────────────
export default function Portfolio() {
  const [page, setPage] = useState("Home");
  const [fadeKey, setFadeKey] = useState(0);
  const changePage = (p) => { setPage(p); setFadeKey(k => k + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
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
      <style>{FONTS_CSS}</style>
      <GradientBG>
        <Navbar activePage={page} setPage={changePage} />
        <div key={fadeKey} style={{ animation: "scaleIn 0.4s ease-out" }}>{render()}</div>
      </GradientBG>
    </>
  );
}
