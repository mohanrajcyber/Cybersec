# CyberSec Arena — Interactive Student Cyber Lab

A professional, browser-based cyber security training platform built for **ICT Academy students**  
**Trainer:** Mohan Raj · Auxilium College, Pudukkottai · Batch G5937

**Learn → Explore → Defend**

---

## For Students — Quick Start (GitHub-la irundhu open panna)

### Requirements
- **Node.js 18+** — [https://nodejs.org](https://nodejs.org) (LTS version install pannunga)
- **Git** (optional) — clone panna use pannalam

### Step 1 — Download / Clone

**Option A — Git clone**
```bash
git clone https://github.com/YOUR_USERNAME/cybersec-arena.git
cd cybersec-arena
```

**Option B — ZIP download**  
GitHub page-la **Code → Download ZIP** → extract pannunga → folder open pannunga.

### Step 2 — Install & Run

```bash
npm install
npm run dev
```

Browser-la open pannunga: **http://localhost:5173**

> **Phone-la use pannunga?** Chrome/Safari mobile browser-la open pannalam — bottom navigation (Home, War Room, Bootcamp, CTF) + **More** menu irukku. App full mobile layout-ku set pannirukku.

> Port busy na automatic-a **5174** use aagum — terminal-la exact URL parunga.

### Step 3 — Student Login

1. **Student Login** tab select pannunga
2. **Username** — unga name (e.g. `mohanraj`, `priya_2026`) — lowercase, no spaces
3. **Password** — trainer solra password (minimum 4 characters)
4. First time login → account auto-create aagum
5. Next time same username + password use pannanum

**QR login:** Trainer share panna QR scan pannalum direct login aagum.

### Step 4 — Main Labs to Try

| Page | URL | What to do |
|------|-----|------------|
| Dashboard | `/` | All modules overview |
| Cyber War Room | `/war-room` | SSH brute force + SMS phishing + Phone hack + **15 Student Try scenarios** |
| Phishing Detector | `/phishing` | Fake email analyze pannunga |
| Recon Lab | `/recon` | Nmap simulation |
| OWASP Lab | `/owasp` | SQLi, XSS, Broken Auth |
| Bootcamp | `/bootcamp` | 3-day curriculum |
| Cheat Sheet | `/cheatsheet` | Commands reference |
| CTF | `/ctf` | Capture the flag challenges |

### War Room — Student Try (15 Scenarios)

1. Sidebar or War Room-la **Try Student** button click
2. 15 attack cards-la irundhu oru scenario select pannunga
3. **Launch Attack** → victim side-la correct choice select pannunga
4. Progress auto-save aagum (browser localStorage)

Scenarios: WiFi Evil Twin, Ransomware, QR Scam, SIM Swap, WhatsApp Mom, USB Drop, Fake Job, Aadhaar KYC, Deepfake Voice, DDoS, Instagram OSINT, Cryptojacking, Portal Hack, Fake Antivirus, Chain Phishing

---

## For Trainer — GitHub Push

Project folder-la first time:

```bash
git init
git add .
git commit -m "CyberSec Arena — ICT Academy student lab platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cybersec-arena.git
git push -u origin main
```

> `node_modules` and `dist` `.gitignore`-la irukku — push aagathu (correct).

**Trainer login** — Admin panel only. Student-ku trainer password share panna vendaam.

---

## Build for Production

```bash
npm run build
npm run preview
```

Build output: `dist/` folder.

---

## Features

| Module | Description |
|--------|-------------|
| ⚔ Cyber War Room | Attack vs Defense simulation + 15 student try scenarios |
| 🕵️ Recon Lab | Simulated Nmap scan on `training-lab.local` |
| 🎣 Phishing Detector | Analyze fake-but-safe emails with threat scoring |
| 🛡️ OWASP Lab | SQL Injection, XSS, Broken Auth |
| 🌐 Network Analysis | Wireshark-style packet capture |
| 🔐 Password Security | Strength analysis & hashing concepts |
| 📊 SOC / Log Analysis | SIEM log parsing & incident detection |
| 🏆 Mini CTF | Capture-the-flag challenges |
| 🎓 3-Day Bootcamp | Foundation → Hands-On → Defense |
| 📚 Progress Tracking | Bootcamp & module completion (localStorage) |
| 📋 Cheat Sheet | Cyber commands reference |
| 🎓 Admin Dashboard | Trainer: student accounts, QR codes, bulk import |

---

## Tech Stack

- React 19 + Vite 8
- React Router 7
- Pure CSS (custom cyber theme)
- localStorage for progress & student accounts

---

## Troubleshooting (Students)

| Problem | Solution |
|---------|----------|
| `npm` not found | Node.js install pannunga, terminal restart |
| `npm install` fail | Internet check, `npm install` again |
| Port already in use | Terminal-la show aagura alternate port use pannunga |
| Login fail | Username lowercase-a irukka check, trainer-kitta password confirm |
| Progress lost | Same browser use pannunga — data localStorage-la save aagum |
| Page blank | `npm run dev` running-a check, browser refresh |

---

## Safety

All labs are **simulations only**. No real scanning, exploitation, or network attacks.  
Never attack real systems without written authorization.

**ICT Academy · Mohan Raj · Auxilium College, Pudukkottai**
