/** Real cybersecurity command reference for ICT lab sessions */

export const CHEAT_CATEGORIES = [
  { id: 'nmap', label: 'Nmap', icon: '🕵️' },
  { id: 'linux', label: 'Linux', icon: '🐧' },
  { id: 'wireshark', label: 'Wireshark', icon: '🌐' },
  { id: 'web', label: 'Web / SQL', icon: '🛡️' },
  { id: 'ir', label: 'Incident Response', icon: '🚨' },
  { id: 'ports', label: 'Common Ports', icon: '🔌' },
  { id: 'owasp', label: 'OWASP Top 10', icon: '⚠️' },
]

export const CHEAT_COMMANDS = {
  nmap: [
    { cmd: 'nmap -sV 192.168.1.1', desc: 'Service version scan on one host' },
    { cmd: 'nmap -sS -p- 10.0.0.5', desc: 'Stealth SYN scan — all ports' },
    { cmd: 'nmap -sn 192.168.1.0/24', desc: 'Ping sweep — find live hosts' },
    { cmd: 'nmap -A -T4 target.com', desc: 'Aggressive scan (OS, scripts, traceroute)' },
    { cmd: 'nmap --script vuln 10.0.0.5', desc: 'Run NSE vulnerability scripts' },
    { cmd: 'nmap -p 80,443,8080 192.168.1.10', desc: 'Scan specific ports only' },
  ],
  linux: [
    { cmd: 'grep "FAILED" /var/log/auth.log', desc: 'Find failed login attempts' },
    { cmd: 'find / -perm -4000 2>/dev/null', desc: 'Find SUID binaries (priv esc check)' },
    { cmd: 'netstat -tulpn | grep LISTEN', desc: 'Show listening ports & processes' },
    { cmd: 'chmod 600 ~/.ssh/id_rsa', desc: 'Secure private SSH key permissions' },
    { cmd: 'tail -f /var/log/syslog', desc: 'Live tail system logs' },
    { cmd: 'ps aux | grep suspicious', desc: 'Find running processes by name' },
    { cmd: 'sha256sum file.exe', desc: 'Generate file hash for malware triage' },
    { cmd: 'curl -I https://example.com', desc: 'Check HTTP headers only' },
  ],
  wireshark: [
    { cmd: 'http.request.method == "POST"', desc: 'Filter POST requests' },
    { cmd: 'ip.addr == 192.168.1.100', desc: 'Traffic to/from one IP' },
    { cmd: 'tcp.port == 443', desc: 'HTTPS traffic only' },
    { cmd: 'dns.qry.name contains "login"', desc: 'DNS queries with "login"' },
    { cmd: 'http contains "password"', desc: 'HTTP packets mentioning password' },
    { cmd: 'tcp.flags.syn == 1 && tcp.flags.ack == 0', desc: 'SYN scan detection' },
    { cmd: 'frame contains "SELECT"', desc: 'Possible SQL in cleartext' },
  ],
  web: [
    { cmd: "' OR '1'='1' --", desc: 'Classic SQL injection test (lab only)' },
    { cmd: '<script>alert(1)</script>', desc: 'Basic XSS proof-of-concept (lab only)' },
    { cmd: 'sqlmap -u "http://lab.test?id=1" --batch', desc: 'Automated SQLi test (authorized lab)' },
    { cmd: 'curl -X POST -d "user=admin" http://lab/login', desc: 'Test login form via curl' },
    { cmd: 'nikto -h http://lab.test', desc: 'Web vulnerability scanner' },
    { cmd: 'gobuster dir -u http://lab.test -w wordlist.txt', desc: 'Directory brute-force (lab scope)' },
  ],
  ir: [
    { cmd: '1. Identify → 2. Contain → 3. Eradicate → 4. Recover → 5. Lessons', desc: 'NIST IR lifecycle order' },
    { cmd: 'Isolate infected host from network VLAN', desc: 'First containment step for malware' },
    { cmd: 'Preserve logs before reboot (auth, sys, EDR)', desc: 'Evidence collection priority' },
    { cmd: 'Reset credentials for compromised accounts', desc: 'Stop ongoing access abuse' },
    { cmd: 'Check IOCs: hash, IP, domain in SIEM', desc: 'Hunt related activity' },
    { cmd: 'Document timeline with UTC timestamps', desc: 'Required for post-incident report' },
  ],
  ports: [
    { cmd: '22 — SSH', desc: 'Remote shell — brute-force target' },
    { cmd: '80 / 443 — HTTP / HTTPS', desc: 'Web traffic — OWASP testing' },
    { cmd: '53 — DNS', desc: 'Domain lookups — tunneling risk' },
    { cmd: '25 / 587 — SMTP', desc: 'Email — phishing relay check' },
    { cmd: '3389 — RDP', desc: 'Windows remote desktop' },
    { cmd: '445 — SMB', desc: 'File sharing — ransomware vector' },
    { cmd: '3306 — MySQL', desc: 'Database — SQLi if exposed' },
    { cmd: '8080 — HTTP Alt', desc: 'Dev servers often exposed' },
  ],
  owasp: [
    { cmd: 'A01 — Broken Access Control', desc: 'IDOR, forced browsing, missing RBAC' },
    { cmd: 'A02 — Cryptographic Failures', desc: 'Weak crypto, exposed secrets, no TLS' },
    { cmd: 'A03 — Injection', desc: 'SQLi, XSS, command injection' },
    { cmd: 'A04 — Insecure Design', desc: 'Missing threat modeling in design' },
    { cmd: 'A05 — Security Misconfiguration', desc: 'Default creds, verbose errors' },
    { cmd: 'A06 — Vulnerable Components', desc: 'Outdated libraries (Log4j, OpenSSL)' },
    { cmd: 'A07 — Auth Failures', desc: 'Weak passwords, no MFA, session issues' },
    { cmd: 'A08 — Integrity Failures', desc: 'Unsigned updates, CI/CD tampering' },
    { cmd: 'A09 — Logging Failures', desc: 'No audit trail for attacks' },
    { cmd: 'A10 — SSRF', desc: 'Server-side request forgery to internal systems' },
  ],
}

/** Simulated threat intel — real CVE patterns for classroom discussion */
export const THREAT_FEED = [
  { id: 'CVE-2024-3400', severity: 'Critical', title: 'Palo Alto PAN-OS command injection — patch immediately', date: 'Apr 2024' },
  { id: 'CVE-2023-4966', severity: 'Critical', title: 'Citrix Bleed — session token leak (active exploitation)', date: 'Oct 2023' },
  { id: 'CVE-2024-3094', severity: 'Critical', title: 'XZ Utils backdoor — supply chain attack in liblzma', date: 'Mar 2024' },
  { id: 'CVE-2021-44228', severity: 'Critical', title: 'Log4Shell — Log4j RCE (still found in legacy apps)', date: 'Dec 2021' },
  { id: 'CVE-2024-21413', severity: 'High', title: 'Microsoft Outlook MonikerLink — clickless code execution', date: 'Feb 2024' },
  { id: 'CVE-2023-22515', severity: 'Critical', title: 'Atlassian Confluence broken access control', date: 'Oct 2023' },
]

export const QUICK_TOOLS = [
  { name: 'Nmap', use: 'Port & service discovery', link: '/recon' },
  { name: 'Wireshark', use: 'Packet capture analysis', link: '/network' },
  { name: 'Burp Suite', use: 'Web app proxy testing', link: '/owasp' },
  { name: 'Hashcat', use: 'Password hash cracking (lab)', link: '/lab/hash' },
  { name: 'Metasploit', use: 'Exploit framework (authorized only)', link: '/lab/enumeration' },
  { name: 'Volatility', use: 'Memory forensics', link: '/lab/forensics' },
]
