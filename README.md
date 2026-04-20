# Freya Shah — Portfolio

Personal portfolio website built with React.

## 🚀 How to Deploy (Step-by-Step)

### Prerequisites
Make sure you have these installed on your laptop:
- **Node.js** (v18+) → Download from https://nodejs.org
- **Git** → Download from https://git-scm.com
- **A GitHub account** → https://github.com

To check if they're installed, open your terminal and run:
```bash
node --version
git --version
```

---

### Step 1: Download this project folder
Save the entire `freya-portfolio` folder to your laptop (e.g., in Downloads or Desktop).

### Step 2: Open terminal and navigate to the folder
```bash
cd path/to/freya-portfolio
```
For example:
```bash
cd ~/Desktop/freya-portfolio
```

### Step 3: Install dependencies
```bash
npm install
```
This will take 1-2 minutes. It downloads React and everything the project needs.

### Step 4: Test locally (optional but recommended)
```bash
npm start
```
This opens the site at `http://localhost:3000` in your browser. Press `Ctrl+C` to stop.

### Step 5: Create a GitHub repo
1. Go to https://github.com/new
2. Name it: `freya-23.github.io` (this gives you the cleanest URL)
3. Keep it **Public**
4. Do NOT add a README (we already have one)
5. Click **Create repository**

### Step 6: Push code to GitHub
Run these commands one by one in your terminal:
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/freya-23/freya-23.github.io.git
git push -u origin main
```

### Step 7: Deploy to GitHub Pages
```bash
npm run deploy
```
This builds the site and pushes it to a `gh-pages` branch automatically.

### Step 8: Enable GitHub Pages
1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Branch: `gh-pages` → folder: `/ (root)` → Save

### Step 9: Visit your site! 🎉
Wait 1-2 minutes, then go to:
**https://freya-23.github.io**

---

## 🔄 How to Update Later
Whenever you change something:
```bash
git add .
git commit -m "Updated portfolio"
git push
npm run deploy
```

---

## 🌐 Connecting Vercel Later (Even Easier Deploys)
When you're ready:
1. Go to https://vercel.com → Sign in with GitHub
2. Click **Import Project** → Select your repo
3. Click **Deploy**
4. Done! Auto-deploys every time you push to GitHub.

---

## 📁 Project Structure
```
freya-portfolio/
├── public/
│   └── index.html          ← HTML shell
├── src/
│   ├── index.js            ← React entry point
│   └── App.js              ← Your entire portfolio
├── package.json            ← Dependencies & scripts
├── .gitignore              ← Files to ignore in Git
└── README.md               ← You're reading this!
```
