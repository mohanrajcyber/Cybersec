import { SIM_LAB_DETAILS } from './simLabs'

export const moduleDetails = {
  recon: [
    { id: 'what', icon: '🔍', title: 'What is Reconnaissance?', type: 'concept', content: 'Reconnaissance (Recon) is the first phase of a cyber security assessment. It means gathering information about a target — open ports, running services, domain names, IP addresses, and system configurations — before any deeper testing begins.' },
    { id: 'why', icon: '💡', title: 'Why is it Used?', type: 'why', content: 'Security teams use recon to understand what is exposed on a network. Attackers use it to find entry points. Defenders use the same techniques to discover misconfigurations, unnecessary open ports, and outdated services before criminals do.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Select a training target.\n2. Run a simulated port scan.\n3. Review open ports and services.\n4. Answer which service to investigate first.\n5. Document findings — standard SOC and pentest workflow.' },
    { id: 'tools', icon: '🧰', title: 'Common Tools', type: 'tools', content: '• Nmap — port scanning & service detection\n• WHOIS / DNS — domain & IP info\n• Shodan — internet device search\n• Netcat — banner grabbing\n• Wireshark — traffic analysis' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Map attack surface before a breach\n• Verify firewall rules\n• Support vulnerability audits\n• Prepare incident response playbooks\n• Core skill for SOC analysts & pentesters' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'Recon must ONLY be done on systems you own or have written permission to test. This lab uses pre-loaded simulated targets — no real scanning occurs.' },
  ],
  network: [
    { id: 'what', icon: '🌐', title: 'What is Network Analysis?', type: 'concept', content: 'Network analysis is the process of inspecting packet captures and traffic flows to understand what devices are communicating, which protocols are used, and whether any activity looks suspicious or malicious.' },
    { id: 'why', icon: '💡', title: 'Why is it Used?', type: 'why', content: 'SOC teams analyze network traffic to detect intrusions, malware callbacks, data exfiltration, and unauthorized connections. It helps identify C2 (Command & Control) beacons, port scans, and abnormal protocol usage.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Open the simulated packet capture output.\n2. Read protocol hierarchy and alert messages.\n3. Identify suspicious IPs, ports, and patterns.\n4. Review the Key Insights section.\n5. Connect findings to incident response steps.' },
    { id: 'tools', icon: '🧰', title: 'Common Tools', type: 'tools', content: '• Wireshark — packet capture & analysis\n• tcpdump — command-line capture\n• Zeek / Suricata — IDS & network monitoring\n• NetworkMiner — host & file extraction\n• Splunk — log correlation with network events' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Detect malware phone-home traffic\n• Investigate security incidents\n• Troubleshoot network issues\n• Validate segmentation & firewall policies\n• Essential Blue Team skill' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'Capture and analyze traffic only on networks you are authorized to monitor. This lab uses fictional packet data for training purposes.' },
  ],
  owasp: [
    { id: 'what', icon: '🛡️', title: 'What is OWASP / Web Security?', type: 'concept', content: 'OWASP (Open Web Application Security Project) publishes the Top 10 most critical web application risks — like SQL Injection, XSS, and Broken Authentication. Web security is about protecting apps from these attacks.' },
    { id: 'why', icon: '💡', title: 'Why is it Used?', type: 'why', content: 'Most breaches start through web apps — login pages, forms, and APIs. Developers and security testers must understand these vulnerabilities to build secure code and test applications before attackers exploit them.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. View the simulated login page.\n2. Select a vulnerability tab (SQLi, XSS, Auth).\n3. Read the attack concept and example.\n4. Learn why it happens.\n5. Study how to prevent it in real projects.' },
    { id: 'tools', icon: '🧰', title: 'Common Tools', type: 'tools', content: '• Burp Suite — web proxy & scanner\n• OWASP ZAP — free security testing\n• SQLMap — SQL injection testing (authorized only)\n• Browser DevTools — inspect requests & responses\n• Nikto — web server scanner' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Secure web application development\n• Penetration testing & bug bounty\n• Code review & DevSecOps pipelines\n• Compliance audits (PCI-DSS, etc.)\n• Interview-ready practical knowledge' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'Never test web apps without permission. This lab is a safe simulation — no real exploitation or attacks are performed.' },
  ],
  phishing: [
    { id: 'what', icon: '🎣', title: 'What is Phishing?', type: 'concept', content: 'Phishing is a social engineering attack where criminals send fake emails, messages, or websites that look legitimate to trick users into revealing passwords, OTPs, or clicking malicious links.' },
    { id: 'why', icon: '💡', title: 'Why Learn Detection?', type: 'why', content: 'Phishing is the #1 attack vector for data breaches. Employees, students, and even experts can fall for well-crafted emails. Learning indicators helps you protect yourself and your organization.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Read the suspicious training email.\n2. Click "Analyze Email" to run detection.\n3. Review threat indicators and risk score.\n4. Read the verdict.\n5. Click "Why?" to understand each indicator.' },
    { id: 'tools', icon: '🧰', title: 'Detection Techniques', type: 'tools', content: '• Check sender domain & reply-to address\n• Hover over links before clicking\n• Look for urgency & threat language\n• Verify URLs match official domains\n• Use email security gateways & SPF/DKIM checks' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Protect personal & work accounts\n• SOC email triage & analysis\n• Security awareness training\n• Incident reporting workflows\n• Reduce organizational risk' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'The email in this lab is a fake training sample. Never use phishing techniques against real people without authorized security awareness programs.' },
  ],
  password: [
    { id: 'what', icon: '🔐', title: 'What is Password Security?', type: 'concept', content: 'Password security covers creating strong credentials, storing them safely with hashing (bcrypt, Argon2), and adding extra layers like Multi-Factor Authentication (MFA) to protect accounts.' },
    { id: 'why', icon: '💡', title: 'Why is it Important?', type: 'why', content: 'Weak or reused passwords cause most account takeovers. Attackers use dictionary attacks, credential stuffing, and rainbow tables. Strong passwords and MFA block the majority of automated attacks.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Review the password analysis terminal output.\n2. Compare weak vs strong passphrase examples.\n3. Read entropy and crack-time estimates.\n4. Study hashing and MFA best practices.\n5. Apply rules to your own accounts.' },
    { id: 'tools', icon: '🧰', title: 'Common Tools', type: 'tools', content: '• Password managers (Bitwarden, 1Password)\n• Have I Been Pwned — breach checking\n• Hashcat — password cracking (authorized testing)\n• zxcvbn — strength estimation libraries\n• Authenticator apps — TOTP MFA' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Personal account protection\n• Secure application design\n• Identity & access management (IAM)\n• Compliance requirements\n• Prevent credential-based breaches' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'Only test password strength on your own accounts or in authorized penetration tests. Never crack passwords you do not own.' },
  ],
  soc: [
    { id: 'what', icon: '📊', title: 'What is SOC / Log Analysis?', type: 'concept', content: 'A Security Operations Center (SOC) monitors systems 24/7 using logs from servers, firewalls, and applications. Log analysis means parsing these records to find anomalies, attacks, and security incidents.' },
    { id: 'why', icon: '💡', title: 'Why is it Used?', type: 'why', content: 'Every system generates logs. Skilled analysts turn raw log data into actionable alerts — failed logins, privilege escalation, data exfiltration — before damage spreads across the network.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Read the SIEM analyzer terminal output.\n2. Identify anomaly alerts in the logs.\n3. Understand severity levels.\n4. Review recommended response actions.\n5. Study the Key Insights for each finding.' },
    { id: 'tools', icon: '🧰', title: 'Common Tools', type: 'tools', content: '• Splunk / ELK Stack — log aggregation\n• Microsoft Sentinel — cloud SIEM\n• Wazuh — open-source monitoring\n• Sigma rules — detection logic\n• SOAR platforms — automated response' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Detect breaches in real time\n• Incident investigation & forensics\n• Compliance & audit logging\n• Threat hunting\n• Core Blue Team career path' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'Access logs only within your authorized role. Log data often contains sensitive information — handle it according to privacy and company policies.' },
  ],
  ctf: [
    { id: 'what', icon: '🏆', title: 'What is CTF?', type: 'concept', content: 'Capture The Flag (CTF) is a competitive cyber security challenge format. Participants solve puzzles — decoding, forensics, web exploits, cryptography — to find hidden "flags" and earn points.' },
    { id: 'why', icon: '💡', title: 'Why Practice CTF?', type: 'why', content: 'CTF builds practical problem-solving under pressure. It combines recon, coding, analysis, and creative thinking — exactly the skills employers look for in junior security roles.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Read each challenge.\n2. Use hints to guide your thinking.\n3. Format answers as ICT{your_answer}.\n4. Submit flags to earn points.\n5. Capture all 3 flags for the CTF Champion badge.' },
    { id: 'tools', icon: '🧰', title: 'Skills You Will Use', type: 'tools', content: '• Base64 / encoding decoding\n• Port & protocol knowledge\n• Security terminology\n• Linux command line basics\n• Research & logical deduction' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• Build a security portfolio\n• Prepare for hackathons & competitions\n• Strengthen interview problem-solving\n• Learn across multiple security domains\n• Fun, gamified learning' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'CTF skills must only be applied in authorized competitions and labs. Never use challenge techniques on live systems without permission.' },
  ],
  ir: [
    { id: 'what', icon: '🚨', title: 'What is Incident Response?', type: 'concept', content: 'Incident Response (IR) is the structured process of handling security breaches — from detection through containment, eradication, recovery, and lessons learned.' },
    { id: 'why', icon: '💡', title: 'Why is it Used?', type: 'why', content: 'When a breach occurs, every minute counts. A defined IR process minimizes damage, preserves evidence, and restores operations quickly.' },
    { id: 'how', icon: '📋', title: 'How to Use This Lab?', type: 'how', content: '1. Read the breach scenario.\n2. Drag the IR steps into correct order.\n3. Click Check Order.\n4. Learn the Detect → Contain → Eradicate → Recover lifecycle.' },
    { id: 'tools', icon: '🧰', title: 'IR Frameworks', type: 'tools', content: '• NIST IR lifecycle\n• SANS Incident Handler steps\n• SOAR playbooks\n• SIEM alerting\n• Forensic evidence preservation' },
    { id: 'benefits', icon: '🎯', title: 'Real-World Uses', type: 'benefits', content: '• SOC analyst core skill\n• Ransomware response\n• Data breach management\n• Enterprise security operations\n• Compliance requirements' },
    { id: 'ethics', icon: '⚖️', title: 'Ethics & Legal', type: 'ethics', content: 'IR activities must follow organizational policy and legal requirements for evidence handling and notification.' },
  ],
  progress: [
    { id: 'what', icon: '📚', title: 'What is Learning Progress?', type: 'concept', content: 'This dashboard tracks your journey through CyberSec Arena — bootcamp topics completed, modules visited, and overall training percentage.' },
    { id: 'why', icon: '💡', title: 'Why Track Progress?', type: 'why', content: 'Structured tracking helps you see what you have learned, what is remaining, and keeps you motivated through the 3-day bootcamp curriculum and individual lab modules.' },
    { id: 'how', icon: '📋', title: 'How to Use It?', type: 'how', content: '1. Complete bootcamp day topics by clicking each item.\n2. Visit labs — they auto-record when you practice.\n3. Check overall completion percentage.\n4. Return here to review your journey.\n5. Use gaps to plan your next study session.' },
    { id: 'tools', icon: '🧰', title: 'What Gets Tracked', type: 'tools', content: '• Bootcamp day topics (12 total)\n• Modules you have opened and practiced\n• Overall bootcamp percentage\n• Local browser storage persistence' },
    { id: 'benefits', icon: '🎯', title: 'Benefits', type: 'benefits', content: '• Visual learning roadmap\n• Interview demo — show structured training\n• Identify weak areas to revisit\n• Stay organized across multiple labs\n• Motivation through measurable progress' },
  ],
}

export function getModuleDetails(id) {
  return moduleDetails[id] || SIM_LAB_DETAILS[id] || []
}
