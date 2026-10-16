// ─── CONTENT ──────────────────────────────────────────────
// Everything a recruiter reads lives in this file. Edit text here;
// layout and graphics live in App.js, Glyphs.js and ContourField.js.

// Put your resume PDF in /public (for example /public/Freya_Shah_Resume.pdf)
// and set this to "/Freya_Shah_Resume.pdf" to show a "Download resume" button.
export const RESUME_URL = null;

export const PROFILE = {
  name: "Freya Shah",
  fullName: "Freya Hemal Shah",
  role: "Data analyst",
  // The hero line types these out one after another.
  roles: ["Data analyst", "BI analyst", "Financial analyst", "Data storyteller"],
  lede: "I turn messy data into maps, dashboards and models people can act on.",
  status:
    "MS in Data Science, Arizona State University, 2026. Data analyst intern at KGS Technology Group, and open to full-time data analyst, BI analyst and financial analyst roles.",
  email: "freyash2321@gmail.com",
  phone: "+1 (480) 494-3563",
  phoneHref: "tel:+14804943563",
  links: {
    linkedin: "https://www.linkedin.com/in/freya-shah-5a608623a/",
    github: "https://github.com/freya-23",
    tableau: "https://public.tableau.com/app/profile/freya.shah7150",
    source: "https://github.com/freya-23/freya-23.github.io",
  },
};

export const LANES = [
  { key: "all", label: "All" },
  { key: "bi", label: "Analytics and BI" },
  { key: "finance", label: "Finance" },
  { key: "ml", label: "Machine learning" },
  { key: "eng", label: "Engineering and automation" },
];

export const PROJECTS = [
  {
    slug: "phoenix-food-access",
    short: "Phoenix food access",
    chart: "phoenix",
    featured: true,
    glyph: "phoenix",
    image: "/img/phoenix-thumb.jpg",
    imageAlt: "Choropleth of metro Phoenix census tracts shaded by income, with food desert tracts outlined in blue",
    gallery: [
      { src: "/img/phoenix-map.jpg", alt: "Full map of food access inequity in Maricopa County" },
      { src: "/img/phoenix-income.jpg", alt: "Income distribution of food desert tracts compared with served tracts" },
    ],
    title: "Phoenix Food Access Inequity Analysis",
    period: "Mar to Apr 2026",
    context: "Independent project",
    lanes: ["bi"],
    tagline: "Mapping grocery access against income across 1,009 Maricopa County census tracts.",
    summary:
      "A spatial analysis of food access in Maricopa County using QGIS, Python and public USDA and Census data. Food desert tracts earn 39% less than served tracts and face 2.5 times the poverty rate.",
    body: [
      "Phoenix has a food desert problem that does not always show up on income maps alone. I combined grocery store locations from OpenStreetMap, census tract boundaries from US Census TIGER, and USDA Low Income Low Access classifications to measure who actually struggles to reach a grocery store.",
      "In QGIS I reprojected every layer to UTM Zone 12N for accurate distances, built one mile walking buffers around each of about 665 grocery stores, and spatially joined them against 1,009 census tracts to flag the tracts outside every buffer. I joined USDA income and poverty data through zero padded GEOIDs and ran the statistical comparison in Python.",
      "The finding challenges the rural food desert stereotype: 97% of Maricopa food desert tracts are urban, and 358,946 urban Maricopa residents lack walkable grocery access.",
    ],
    facts: [
      { label: "Census tracts analyzed", value: "1,009" },
      { label: "Income gap", value: "39% lower" },
      { label: "Urban residents without walkable access", value: "358,946" },
    ],
    tags: ["QGIS", "Python", "Pandas", "Matplotlib", "OpenStreetMap", "USDA Atlas", "Census TIGER"],
    links: [{ label: "View code and maps on GitHub", href: "https://github.com/freya-23/phoenix-food-desert-analysis" }],
  },
  {
    slug: "ecrie",
    short: "ECRIE",
    chart: "ecrie",
    featured: true,
    glyph: "ecrie",
    title: "Earnings Call and Risk Intelligence Engine (ECRIE)",
    period: "Jan to May 2026",
    context: "MS capstone, Arizona State University (FSE 570)",
    lanes: ["finance", "ml"],
    tagline: "Can the language of an earnings call predict how the stock moves next?",
    summary:
      "My MS capstone tested whether earnings call language predicts post earnings stock direction. XGBoost on combined language and financial features reached a held out ROC AUC of 0.633, against 0.568 for a logistic regression baseline.",
    body: [
      "The data came from three places: 917 real earnings call transcripts scraped from Seeking Alpha, 1.24 million daily price records for 503 S&P 500 tickers, and 3,125 quarterly financials from SEC EDGAR. After temporal alignment, 798 calls had complete records. I led the real transcript acquisition and the NLP re-run.",
      "Each call became an 863 dimension feature vector: FinBERT embeddings, Loughran McDonald dictionary scores, and financial and market features. The pipeline runs as six LangGraph agents for ingestion, preprocessing, feature extraction, integration, modeling and reporting, with quality gates between stages. The predictions themselves come from XGBoost on a chronological train and test split.",
      "I ran the final model ablation and SHAP analysis. Seven of the ten strongest drivers were linguistic, such as average sentence length, question count and uncertainty language, so how management talks carried more signal than raw financials. An autonomous feature discovery agent tested 109 candidate features and did not improve cross validated AUC, and that negative result stayed in the report. Results are served through a Streamlit app with SHAP waterfall charts.",
    ],
    facts: [
      { label: "Real transcripts", value: "917" },
      { label: "Held out ROC AUC", value: "0.633 vs 0.568 baseline" },
      { label: "Top 10 drivers that are linguistic", value: "7" },
    ],
    tags: ["Python", "FinBERT", "XGBoost", "SHAP", "LangGraph", "Streamlit", "SEC EDGAR"],
    links: [],
  },
  {
    slug: "pay-gap-story",
    short: "Pay gap story",
    featured: true,
    glyph: "paygap",
    title: "Visual Data Story: Gender and Race Pay Gap",
    period: "Aug to Dec 2025",
    context: "Course project, Data Visualization (CSE 578), team of six",
    lanes: ["bi"],
    tagline: "A scroll driven story that makes wage inequality visible.",
    summary:
      "An argumentative, scroll driven web story in D3.js about the gender and racial dimensions of the US wage gap, built from Census Bureau data.",
    body: [
      "The story moves from the overall gap to racial breakdowns, then industry comparisons, and ends with a call to action. It uses animated bar charts for pay ratios plus slope graphs and bump charts to show how disparities shift over time and across industries.",
      "Scroll position drives the narrative through Intersection Observer, so each data point appears as the reader reaches it. I contributed across the pipeline, from Census Bureau data wrangling to the D3 front end.",
    ],
    facts: [
      { label: "Visualization library", value: "D3.js" },
      { label: "Chart types", value: "Bars, slope graphs, bump charts" },
      { label: "Data", value: "US Census Bureau" },
    ],
    tags: ["D3.js", "JavaScript", "Scrollytelling", "Intersection Observer", "Census data"],
    links: [],
  },
  {
    slug: "alzheimers-risk",
    short: "Alzheimer's risk",
    glyph: "alz",
    title: "Alzheimer's Risk Prediction",
    period: "Jan to May 2025",
    lanes: ["ml"],
    tagline: "Interpretable machine learning for responsible early diagnosis.",
    summary:
      "An XGBoost pipeline for Alzheimer's risk with SHAP and LIME explanations and fairness checks across demographic groups.",
    body: [
      "Healthcare models need to be explainable and fair, not only accurate. I trained an XGBoost classifier on patient health records that reached 90.9% accuracy, then added SHAP for global feature importance and LIME for individual explanations, so a clinician can see which factors such as age, cognitive scores and biomarkers drove a prediction.",
      "I also audited performance across age groups, gender and ethnicity to check that the model did not systematically underperform for any group, a common way medical AI reinforces existing disparities.",
    ],
    facts: [
      { label: "Accuracy", value: "90.9%" },
      { label: "Explainability", value: "SHAP and LIME" },
      { label: "Fairness", value: "Audited across demographics" },
    ],
    tags: ["XGBoost", "SHAP", "LIME", "Python", "Fairness"],
    links: [],
  },
  {
    slug: "clean-and-summarize",
    short: "Excel macro",
    glyph: "macro",
    title: "CleanAndSummarize Excel Macro",
    period: "2024",
    context: "Automation tool",
    lanes: ["eng", "finance"],
    tagline: "A VBA macro that turns a messy raw export into a clean summary in one click.",
    summary:
      "A working VBA macro that cleans raw Excel exports from expense trackers, CRMs and finance tools and builds a category summary sheet.",
    body: [
      "Raw exports arrive with blank rows, duplicate rows from re-exports and stray whitespace. The macro trims every cell, removes blank and exact duplicate rows, then rebuilds a Summary sheet with a row count and total amount per category every time it runs.",
      "The repo includes a sample export with exactly those problems, so anyone can import the macro and watch it work.",
    ],
    facts: [
      { label: "Stack", value: "Excel VBA" },
      { label: "Output", value: "Clean data plus category summary" },
      { label: "Runs in", value: "One click" },
    ],
    tags: ["Excel", "VBA", "Automation"],
    links: [{ label: "View code on GitHub", href: "https://github.com/freya-23/clean-and-summarize-excel-macro" }],
  },
  {
    slug: "daily-digest",
    short: "Daily Digest",
    glyph: "digest",
    title: "Daily Digest Pipeline",
    period: "Mar to May 2026",
    context: "Personal automation",
    lanes: ["eng"],
    tagline: "An LLM pipeline that reads the news so I don't have to open ten tabs.",
    summary:
      "A cron job that pulls five RSS categories and live market data, summarizes them with Llama 3.3 70B on Groq, and sends a dashboard to my iMessage every morning.",
    body: [
      "A Python script runs at 8am, pulls five personalized RSS categories alongside live market data, and passes everything through Llama 3.3 70B on Groq to write a single readable brief.",
      "The brief renders as an HTML dashboard and arrives in iMessage through AppleScript. No app to open and no feed to scroll.",
    ],
    facts: [
      { label: "Sources", value: "5 RSS categories plus markets" },
      { label: "Model", value: "Llama 3.3 70B on Groq" },
      { label: "Delivery", value: "iMessage at 8am" },
    ],
    tags: ["Python", "Groq", "Llama 3.3", "Cron", "AppleScript"],
    links: [],
  },
  {
    slug: "graph-pipeline",
    short: "Graph pipeline",
    glyph: "graph",
    title: "Real-Time Graph Analytics Pipeline",
    period: "Jan to May 2025",
    context: "Course project, Data Processing at Scale (CSE 511)",
    lanes: ["eng"],
    tagline: "Streaming NYC taxi trips into a live Neo4j graph with Kafka and Kubernetes.",
    summary:
      "A two phase graph analytics system that loads NYC taxi data into Neo4j and then extends it to real time streaming with Kafka and Kubernetes.",
    body: [
      "In phase one I loaded NYC Yellow Taxi trips into a Dockerized Neo4j instance and ran PageRank to find the most connected pickup and drop off zones and BFS to trace routes through the trip network.",
      "In phase two I extended the batch system into a streaming pipeline: Kafka Connect source connectors stream filtered trip records into Neo4j at about 150 messages per second with under 200 ms end to end latency, orchestrated on Kubernetes pods and validated with integration tests.",
    ],
    facts: [
      { label: "Throughput", value: "About 150 msgs per second" },
      { label: "Latency", value: "Under 200 ms" },
      { label: "Flow", value: "Kafka to Neo4j on Kubernetes" },
    ],
    tags: ["Neo4j", "Kafka", "Kubernetes", "Docker", "PageRank", "BFS"],
    links: [],
  },
  {
    slug: "intrusion-detection",
    short: "Intrusion detection",
    glyph: "nids",
    title: "Network Intrusion Detection Research",
    period: "Aug to Dec 2024",
    context: "Research paper",
    lanes: ["ml"],
    tagline: "Comparing machine learning and deep learning models for spotting malicious network traffic.",
    summary:
      "A research paper evaluating Random Forest, XGBoost, CNN and LSTM models on the NSL-KDD and CIC-IDS2017 benchmark datasets.",
    body: [
      "I compared machine learning and deep learning models on two standard intrusion benchmarks. Random Forest with engineered features performed best at 99.77% accuracy across DoS, Probe, R2L and U2R attack categories.",
      "The hard part was class imbalance, with some attack types under 0.1% of the data. I handled it with SMOTE oversampling, mutual information feature selection and stratified cross validation. The paper also covers what changes in live deployment, where traffic loads and false positive costs are harsher than on benchmark data.",
    ],
    facts: [
      { label: "Best benchmark accuracy", value: "99.77%" },
      { label: "Datasets", value: "NSL-KDD and CIC-IDS2017" },
      { label: "Best model", value: "Random Forest" },
    ],
    tags: ["Random Forest", "XGBoost", "CNN", "LSTM", "SMOTE", "Python"],
    links: [],
  },
  {
    slug: "state-bar-scraper",
    short: "State Bar scraper",
    glyph: "scraper",
    title: "California State Bar Scraper",
    period: "2025",
    context: "Automation tool",
    lanes: ["eng"],
    tagline: "Bulk attorney lookups from a site that only searches one name at a time.",
    summary: "A Python and Playwright scraper that pulls attorney records from the California State Bar's public lookup in bulk.",
    body: [
      "The State Bar's lookup only searches one attorney at a time, which does not scale for a list of names. I automated it with Python and Playwright so a repetitive manual task runs unattended and returns structured records.",
    ],
    facts: [
      { label: "Stack", value: "Python and Playwright" },
      { label: "Solves", value: "Bulk attorney record lookup" },
    ],
    tags: ["Python", "Playwright", "Web scraping", "Automation"],
    links: [],
  },
  {
    slug: "book-recommender",
    short: "Book recommender",
    glyph: "books",
    title: "Book Recommendation System",
    period: "Aug to Dec 2023",
    context: "Undergraduate project",
    lanes: ["ml"],
    tagline: "Recommending books from implicit signals like views and wishlists.",
    summary:
      "A recommender built on Bayesian Personalized Ranking and collaborative filtering, trained on implicit feedback instead of star ratings.",
    body: [
      "Most recommenders rely on explicit ratings, but real behavior is messier: people browse, click, abandon and come back. This system learns from implicit signals such as which books a user viewed and what they added to a wishlist.",
      "The core is Bayesian Personalized Ranking, which optimizes a pairwise ranking loss to learn that a user prefers one book over another from interaction patterns alone, combined with collaborative filtering over similar users. It outperformed a popularity based baseline by 35%.",
    ],
    facts: [
      { label: "Lift over popularity baseline", value: "35%" },
      { label: "Method", value: "BPR plus collaborative filtering" },
      { label: "Signal", value: "Implicit feedback" },
    ],
    tags: ["Python", "BPR", "Collaborative filtering", "Recommender systems"],
    links: [],
  },
  {
    slug: "sales-forecasting",
    short: "Sales forecasting",
    glyph: "sales",
    title: "Sales Forecasting with Machine Learning",
    period: "Jan to May 2023",
    context: "Undergraduate project",
    lanes: ["ml", "finance"],
    tagline: "Comparing linear, ridge and ARIMA models for revenue forecasting.",
    summary:
      "A forecasting pipeline that compares Linear Regression, Ridge Regression and ARIMA, with automated preprocessing for missing values, categorical encoding and time features.",
    body: [
      "Linear Regression served as the baseline, Ridge handled multicollinearity between correlated sales features, and ARIMA captured trend and seasonality.",
      "Most of the gain came from preprocessing. Automated handling of missing values, encoding for product categories, regions and store types, and time features such as day of week effects, holidays and rolling averages cut preparation effort by about 40% compared with doing it by hand. The models support multi step forecasts for inventory planning and revenue projection.",
    ],
    facts: [
      { label: "Prep effort saved", value: "About 40%" },
      { label: "Models", value: "Linear, Ridge, ARIMA" },
      { label: "Use case", value: "Revenue forecasting" },
    ],
    tags: ["Python", "Scikit-learn", "ARIMA", "Ridge regression", "Time series"],
    links: [],
  },
];

export const EXPERIENCE = [
  {
    role: "Data Analyst Intern",
    org: "KGS Technology Group",
    place: "Remote",
    period: "Jul 2026 to Present",
    points: [
      "Assigned as the data analyst on GreenTrack, an environmental and renewable energy analytics system, with weekly phase deliverables.",
    ],
  },
  {
    role: "Indian Student Support Assistant",
    org: "Arizona State University, International Students and Scholars Center",
    metric: { value: 15, text: "+15%", label: "average event turnout" },
    place: "Tempe, Arizona",
    period: "Aug 2025 to May 2026",
    points: [
      "Coordinated welcome week programming and culturally inclusive events for a community of 13,000+ international students, from arrival logistics to campus orientations.",
      "Designed A/B tests on event promotion across WhatsApp, Instagram and email and analyzed RSVP and engagement data, lifting average event turnout by 15%.",
      "Cleaned and analyzed participation data to find turnout drivers and audience preferences, and turned the findings into programming recommendations.",
    ],
  },
  {
    role: "Summer Research Intern",
    org: "DA-IICT (Dhirubhai Ambani Institute of Information and Communication Technology), with Prof. Srimanta Mandal",
    place: "Gandhinagar, India",
    period: "May to Aug 2025",
    points: [
      "Compared low light image enhancement methods (LIME, Retinex MSRCR and SNR-Aware Transformers) on the LOL dataset, weighing pixel fidelity against structural similarity.",
      "Implemented LIME and Retinex in Python and OpenCV and benchmarked them with PSNR and SSIM across 15 paired image sets.",
      "Wrote a research report on how optimization based, biologically inspired and deep learning approaches differ on noise, color restoration and illumination.",
    ],
  },
  {
    role: "Data Analyst Intern",
    org: "TEAM (Technical Entrepreneur Agile Management) PMC",
    metric: { value: 60, text: "60% less", label: "manual reporting effort" },
    place: "Ahmedabad, India",
    period: "Sep 2023 to May 2024",
    points: [
      "Built Tableau dashboards tracking cost variances, design revision cycles and quality inspection KPIs across 15+ residential projects (400,000 sq ft), cutting manual reporting effort by 60%.",
      "Designed Python ETL pipelines that consolidated cost, schedule and QC data from scattered Excel workbooks into PostgreSQL, and wrote SQL to find the top delay drivers and quality trends year over year.",
      "Worked with project managers to turn construction KPIs into stakeholder ready reports that shaped project oversight decisions.",
    ],
    link: { label: "See the dashboards on Tableau Public", href: "https://public.tableau.com/app/profile/freya.shah7150" },
  },
  {
    role: "Robotics and Data Intern",
    org: "MNT Technologies Pvt Ltd",
    metric: { value: 20, text: "+20%", label: "interaction accuracy" },
    place: "India",
    period: "May to Aug 2023",
    points: [
      "Ran market sizing, competitive analysis and performance benchmarking on robotic systems for healthcare and hospitality, and presented ROI recommendations to leadership that contributed to a pilot with TAJ Hotels.",
      "Analyzed usability and performance data across deployments, found navigation bottlenecks, and drove a 20% improvement in interaction accuracy.",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "MS in Data Science, Analytics and Engineering",
    school: "Arizona State University, Tempe",
    period: "May 2026",
    gpa: "GPA 3.62",
    courses: "Data Mining, Statistical Machine Learning, Data Processing at Scale, Statistics for Data Analysts, Data Visualization, Information Assurance and Security",
  },
  {
    degree: "BS Honors in Computer Science",
    school: "Ahmedabad University, Gujarat, India",
    period: "May 2024",
    courses: "Machine Learning, Data Structures and Algorithms, Probabilistic Graphical Models, Human Computer Interaction, Operating Systems",
  },
];

export const CERTIFICATIONS = [
  "Google Data Analytics Professional Certificate",
  "Intro to Snowflake for Devs, Data Scientists, Data Engineers",
  "C Programming (C-Tag)",
  "C# Programming for Unity Game Development",
];

// level: Advanced | Intermediate | Familiar. icon: file in /public/icons, or null for a monogram.
export const SKILLS = {
  "Languages and querying": [
    { name: "Python", level: "Advanced", icon: "python", used: "ECRIE, Phoenix, Alzheimer's, intrusion detection, Daily Digest", links: ["ecrie","phoenix-food-access","alzheimers-risk","intrusion-detection","daily-digest","state-bar-scraper","book-recommender","sales-forecasting","exp-team-pmc","exp-daiict"] },
    { name: "SQL", level: "Advanced", icon: null, used: "TEAM PMC delay and quality analysis, Graph Pipeline joins, sales forecasting", links: ["exp-team-pmc","sales-forecasting","graph-pipeline"] },
    { name: "PostgreSQL", level: "Advanced", icon: "postgresql", used: "TEAM PMC ETL target database", links: ["exp-team-pmc"] },
    { name: "MySQL", level: "Advanced", icon: "mysql", used: "Book recommender backend and coursework", links: ["book-recommender"] },
    { name: "Snowflake", level: "Intermediate", icon: null, used: "Intro to Snowflake certificate course, cloud warehousing", links: ["coursework"] },
    { name: "R", level: "Intermediate", icon: "r", used: "Statistics for Data Analysts, time series coursework", links: ["coursework"] },
    { name: "C", level: "Intermediate", icon: null, used: "Operating Systems and DSA coursework", links: ["coursework"] },
    { name: "C#", level: "Intermediate", icon: null, used: "Unity game development course", links: ["coursework"] },
  ],
  "Analysis and modeling": [
    { name: "Pandas", level: "Advanced", icon: "pandas", used: "ECRIE feature engineering, Phoenix tract joins, intrusion data prep", links: ["ecrie","phoenix-food-access","intrusion-detection"] },
    { name: "Scikit-learn", level: "Advanced", icon: "scikitlearn", used: "Intrusion detection Random Forest, sales forecasting models", links: ["intrusion-detection","sales-forecasting"] },
    { name: "NumPy", level: "Advanced", icon: "numpy", used: "Image enhancement research, preprocessing across projects", links: ["exp-daiict"] },
    { name: "XGBoost", level: "Advanced", icon: null, used: "ECRIE predictions (AUC 0.633), Alzheimer's model (90.9%)", links: ["ecrie","alzheimers-risk","intrusion-detection"] },
    { name: "SHAP", level: "Intermediate", icon: null, used: "ECRIE driver analysis, Alzheimer's explanations", links: ["ecrie","alzheimers-risk"] },
    { name: "LIME", level: "Intermediate", icon: null, used: "Alzheimer's local explanations, low light enhancement research", links: ["alzheimers-risk","exp-daiict"] },
    { name: "Statistical modeling", level: "Intermediate", icon: null, used: "DA-IICT PSNR and SSIM benchmarking, coursework", links: ["exp-daiict","coursework"] },
    { name: "A/B testing", level: "Intermediate", icon: null, used: "ISSC event promotion, 15% turnout lift", links: ["exp-issc"] },
    { name: "ARIMA", level: "Intermediate", icon: null, used: "Sales forecasting time series", links: ["sales-forecasting"] },
    { name: "FinBERT", level: "Intermediate", icon: null, used: "ECRIE earnings call language features", links: ["ecrie"] },
  ],
  "Visualization and BI": [
    { name: "Tableau", level: "Advanced", icon: null, used: "TEAM PMC dashboards, 60% less manual reporting; Tableau Public profile", links: ["exp-team-pmc"] },
    { name: "Excel", level: "Advanced", icon: null, used: "TEAM PMC data consolidation, PivotTables, Power Query, VBA macro", links: ["exp-team-pmc","clean-and-summarize"] },
    { name: "Matplotlib", level: "Advanced", icon: "matplotlib", used: "Phoenix income charts, ECRIE SHAP plots", links: ["phoenix-food-access","ecrie"] },
    { name: "Seaborn", level: "Intermediate", icon: null, used: "Statistical charts across coursework", links: ["coursework"] },
    { name: "D3.js", level: "Intermediate", icon: "d3js", used: "Pay gap scrollytelling story", links: ["pay-gap-story"] },
    { name: "React", level: "Intermediate", icon: "react", used: "This site, built and maintained end to end", links: ["site"] },
    { name: "JavaScript", level: "Intermediate", icon: "javascript", used: "This site's graphics, pay gap story", links: ["site","pay-gap-story"] },
    { name: "Power BI", level: "Familiar", icon: null, used: "Coursework exposure; my production dashboards are in Tableau", links: ["coursework"] },
  ],
  "Tools and infrastructure": [
    { name: "Git", level: "Advanced", icon: "git", used: "Version control for this site and my project repos", links: ["site"] },
    { name: "Jupyter", level: "Advanced", icon: "jupyter", used: "Exploratory analysis for ECRIE, Phoenix and intrusion detection", links: ["ecrie","phoenix-food-access","intrusion-detection"] },
    { name: "QGIS", level: "Intermediate", icon: null, used: "Phoenix Food Access buffers and spatial joins", links: ["phoenix-food-access"] },
    { name: "LangGraph", level: "Intermediate", icon: null, used: "ECRIE six agent pipeline orchestration", links: ["ecrie"] },
    { name: "Docker", level: "Intermediate", icon: "docker", used: "Neo4j containers for the Graph Pipeline", links: ["graph-pipeline"] },
    { name: "Neo4j", level: "Intermediate", icon: "neo4j", used: "Graph Pipeline, NYC taxi graph modeling", links: ["graph-pipeline"] },
    { name: "Kafka", level: "Intermediate", icon: "apachekafka", used: "Graph Pipeline streaming at about 150 messages per second", links: ["graph-pipeline"] },
    { name: "Kubernetes", level: "Intermediate", icon: "kubernetes", used: "Graph Pipeline orchestration (course project)", links: ["graph-pipeline"] },
    { name: "Google Analytics", level: "Intermediate", icon: null, used: "Event analytics integration", links: [] },
  ],
};

// Extra nodes for the skills network: jobs, this site and coursework.
export const NETWORK_EXTRA = [
  { id: "exp-team-pmc", label: "TEAM PMC", href: "#experience", kind: "job" },
  { id: "exp-issc", label: "ASU ISSC", href: "#experience", kind: "job" },
  { id: "exp-daiict", label: "DA-IICT research", href: "#experience", kind: "job" },
  { id: "site", label: "This website", href: "#top", kind: "project" },
  { id: "coursework", label: "Coursework", href: "#about", kind: "course" },
];

export const ABOUT = [
  "I'm Freya Hemal Shah. I finished my MS in Data Science, Analytics and Engineering at Arizona State University in May 2026, after a BS Honors in Computer Science at Ahmedabad University.",
  "Most of my work starts with a question someone actually has: which neighborhoods can't walk to a grocery store, whether an earnings call says more than the numbers, where a construction project is losing time. I like owning the whole path, from raw exports to the chart or model a manager can use.",
  "Outside work: food, travel, and basketball, which I played at the state level in school.",
];
