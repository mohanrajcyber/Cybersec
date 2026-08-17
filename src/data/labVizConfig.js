export const LAB_VIZ_CONFIG = {
  recon: {
    stage: 'scan',
    phases: {
      idle: { title: 'Ready to Scan', caption: 'Start Scan click pannunga — animation + terminal sync aagum', tamil: 'Scan start pannumbodhu visual demo kaatum' },
      dns: { title: 'Step 1 — DNS Lookup', caption: 'Hostname-a IP address-ku maathurathu', tamil: 'Server address thedura step' },
      connect: { title: 'Step 2 — Target Online', caption: 'Server respond pannutha-nu verify pannurathu', tamil: 'Target reachable-a nu check' },
      scanning: { title: 'Step 3 — Port Scan', caption: 'Ovvoru port-kum knock panni open nu check', tamil: 'Ports one-by-one test aagum' },
      done: { title: 'Step 4 — Complete', caption: 'Open ports ready — challenge-la best service pick pannunga', tamil: 'Results ready — next step challenge' },
    },
  },
  phishing: {
    stage: 'email',
    phases: {
      idle: { title: 'Select Email Sample', caption: 'Difficulty level pick pannitu Analyze Email click pannunga', tamil: 'Email sample select pannunga' },
      analyze: { title: 'Step 1 — Parsing Email', caption: 'Headers, sender, subject check pannurathu', tamil: 'Email header analyze aaguthu' },
      headers: { title: 'Step 2 — Sender Check', caption: 'Fake sender domain spoof pannirukka nu paakurathu', tamil: 'Sender legitimate-a nu verify' },
      urls: { title: 'Step 3 — Link Analysis', caption: 'Suspicious links & urgency words thedura step', tamil: 'Links safe-a nu check pannurathu' },
      verdict: { title: 'Step 4 — Verdict', caption: 'Risk score + phishing indicators result', tamil: 'Safe or Phishing nu result varum' },
      done: { title: 'Learn Why', caption: 'Each indicator explain pannunga — real email-la apply pannalam', tamil: 'Indicators purinjukonga' },
    },
  },
  network: {
    stage: 'packets',
    phases: {
      idle: { title: 'Packet Capture Ready', caption: 'Start Capture click pannunga — Wireshark sim run aagum', tamil: 'Network packets capture demo' },
      capture: { title: 'Step 1 — Capturing', caption: 'Network traffic record aaguthu (847 packets sim)', tamil: 'Traffic capture nadakuthu' },
      analyze: { title: 'Step 2 — Analyzing', caption: 'Source, destination, protocol compare pannurathu', tamil: 'Packets analyze pannunga' },
      suspicious: { title: 'Step 3 — Threat Found', caption: 'Unusual port / repeated connections — suspicious packet', tamil: 'Suspicious traffic kandupidichirukkom' },
      done: { title: 'Analysis Complete', caption: 'SOC team-ku escalate panna correct packet select pannirukkinga', tamil: 'Correct packet identify panniten' },
    },
  },
  password: {
    stage: 'password',
    phases: {
      idle: { title: 'Password Lab Ready', caption: 'Password type pannunga — live strength meter update aagum', tamil: 'Password type pannunga' },
      typing: { title: 'Step 1 — Entering Password', caption: 'Characters type pannumbodhu entropy calculate aagum', tamil: 'Password analyze start aaguthu' },
      analyze: { title: 'Step 2 — Strength Check', caption: 'Dictionary, patterns, length check pannurathu', tamil: 'Weak or strong nu check' },
      strong: { title: 'Step 3 — Strong Password!', caption: '12+ chars + high score = secure credential', tamil: 'Nalla password — MFA use pannunga' },
      weak: { title: 'Weak Password Detected', caption: 'Common patterns avoid pannunga — passphrase use pannunga', tamil: 'Password weak — improve pannunga' },
    },
  },
  owasp: {
    stage: 'web',
    phases: {
      idle: { title: 'OWASP Lab Ready', caption: 'Vulnerability select pannunga — SQLi, XSS, Auth', tamil: 'Web attack types learn pannunga' },
      select: { title: 'Step 1 — Select Attack', caption: 'Training vulnerability load aaguthu', tamil: 'Attack type select pannirukkinga' },
      attack: { title: 'Step 2 — Attack Demo', caption: 'Attacker input exploit pannura maari simulate', tamil: 'Attack epdi work aagudhu nu paakalam' },
      prevent: { title: 'Step 3 — Prevention', caption: 'Input validation, encoding, auth fix — secure coding', tamil: 'Eppadi prevent pannalam nu learn' },
    },
  },
  soc: {
    stage: 'soc',
    phases: {
      idle: { title: 'SOC Lab Ready', caption: 'Run SIEM click pannunga — logs analyze aagum', tamil: 'Security logs analyze pannunga' },
      ingest: { title: 'Step 1 — Log Ingestion', caption: 'Auth logs, firewall logs SIEM-ku send aaguthu', tamil: 'Logs collect aaguthu' },
      parse: { title: 'Step 2 — Parsing Logs', caption: '12,000+ entries scan panni patterns theduthu', tamil: 'Logs parse aaguthu' },
      alert: { title: 'Step 3 — Anomalies Found', caption: 'Brute force, privilege escalation, exfiltration alerts', tamil: '3 anomalies detect aachu' },
      done: { title: 'Step 4 — Respond', caption: 'Block IP, isolate host, escalate to IR team', tamil: 'Incident response start pannunga' },
    },
  },
  ir: {
    stage: 'ir',
    phases: {
      idle: { title: 'Incident Response Lab', caption: 'IR lifecycle steps correct order-la arrange pannunga', tamil: 'Detect, Contain, Eradicate, Recover order' },
      scenario: { title: 'Step 1 — Breach Scenario', caption: 'Simulated breach — ransomware + data exfiltration', tamil: 'Breach scenario read pannunga' },
      order: { title: 'Step 2 — Order Steps', caption: 'Drag panni correct IR lifecycle arrange pannunga', tamil: 'Steps drag panni order pannunga' },
      verify: { title: 'Step 3 — Verify Order', caption: 'Detect → Contain → Eradicate → Recover', tamil: 'Correct order-a check pannunga' },
      done: { title: 'IR Complete', caption: 'Standard IR lifecycle follow pannirukkinga', tamil: 'IR steps correct!' },
    },
  },
  ctf: {
    stage: 'ctf',
    phases: {
      idle: { title: 'Mini CTF Ready', caption: 'Challenges solve panni flags capture pannunga', tamil: 'ICT flag format use pannunga' },
      challenge: { title: 'Step 1 — Read Challenge', caption: 'Hint read pannitu answer think pannunga', tamil: 'Challenge padichu solve pannunga' },
      hint: { title: 'Step 2 — Hint Unlocked', caption: 'Hint use pannalam — score affect aagalam', tamil: 'Hint help-a irukku' },
      flag: { title: 'Step 3 — Flag Captured!', caption: 'Correct flag — next challenge try pannunga', tamil: 'Flag correct — adutha challenge' },
      done: { title: 'All Flags Captured!', caption: 'CTF complete — cyber skills test aachu', tamil: 'Ellaa flags capture panniten' },
    },
  },
}

export function getLabPhaseInfo(labId, phase) {
  const cfg = LAB_VIZ_CONFIG[labId]
  if (cfg) return cfg.phases[phase] || cfg.phases.idle
  return {
    title: 'Training Lab',
    caption: 'Read the scenario and complete the interactive challenge',
    tamil: 'Scenario padichu challenge complete pannunga',
  }
}

export function getLabSpeech(labId, phase) {
  const info = getLabPhaseInfo(labId, phase)
  if (!info) return { en: '', ta: '' }
  return {
    en: info.speechEn || `${info.title}. ${info.caption}`,
    ta: info.speechTa || info.tamil,
  }
}
