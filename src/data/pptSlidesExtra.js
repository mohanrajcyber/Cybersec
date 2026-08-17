/** Medium priority, career, and premium visual slides — appended before summary */
export const PPT_SLIDES_EXTRA = [
  {
    id: 'ethical-hacking',
    type: 'split',
    visual: 'shield',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'Ethical Hacking vs Black Hat',
        subtitle: 'Same skills — completely different intent and legality',
        left: {
          title: 'White Hat (Ethical)',
          items: [
            'Has written permission before testing any system.',
            'Goal: find weaknesses so they can be fixed before real attackers.',
            'Works for companies, bug bounty programs, or security firms.',
            'Follows responsible disclosure — report bugs privately first.',
          ],
        },
        right: {
          title: 'Black Hat (Illegal)',
          items: [
            'Attacks systems without permission — this is a crime.',
            'Goal: steal data, money, or cause damage for personal gain.',
            'Faces arrest under cyber crime laws in every country.',
            "Never justified — even \"just trying\" on someone else's system is illegal.",
          ],
        },
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'Ethical Hacking vs Black Hat',
        subtitle: 'ஒரே skills — முற்றிலும் வேறு intent மற்றும் legality',
        left: {
          title: 'White Hat (Ethical)',
          items: [
            'எந்த system-ஐ test செய்வதற்கும் முன் written permission வேண்டும்.',
            'Goal: weaknesses கண்டுபிடித்து real attackers-க்கு முன் fix.',
            'Companies, bug bounty, security firms-ல் work.',
            'Responsible disclosure — bugs privately report.',
          ],
        },
        right: {
          title: 'Black Hat (Illegal)',
          items: [
            'Permission இல்லாமல் attack — crime.',
            'Goal: data, money steal அல்லது damage.',
            'Cyber crime laws-Under arrest ஆகலாம்.',
            'Never justified — others system-ல் "just trying" கூட illegal.',
          ],
        },
      },
    },
  },
  {
    id: 'osi-model',
    type: 'layers',
    visual: 'network',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'OSI Model — 7 Layers',
        subtitle: 'How data travels from your app to the network and back',
        layers: [
          { num: 7, name: 'Application', desc: 'What users interact with — browsers, email apps', ex: 'HTTP, DNS, FTP' },
          { num: 6, name: 'Presentation', desc: 'Data format, encryption, compression', ex: 'SSL/TLS, JPEG' },
          { num: 5, name: 'Session', desc: 'Manages connections between applications', ex: 'Login sessions' },
          { num: 4, name: 'Transport', desc: 'Reliable or fast delivery of data', ex: 'TCP, UDP' },
          { num: 3, name: 'Network', desc: 'Routing between networks using IP addresses', ex: 'IP, ICMP' },
          { num: 2, name: 'Data Link', desc: 'Node-to-node transfer on same network', ex: 'MAC address, Ethernet' },
          { num: 1, name: 'Physical', desc: 'Actual cables, WiFi signals, hardware', ex: 'Cables, hubs, radio' },
        ],
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'OSI Model — 7 Layers',
        subtitle: 'App-லிருந்து network-க்கு data எப்படி travel',
        layers: [
          { num: 7, name: 'Application', desc: 'Users interact — browsers, email', ex: 'HTTP, DNS, FTP' },
          { num: 6, name: 'Presentation', desc: 'Format, encryption, compression', ex: 'SSL/TLS, JPEG' },
          { num: 5, name: 'Session', desc: 'Applications இடையில் connections', ex: 'Login sessions' },
          { num: 4, name: 'Transport', desc: 'Reliable or fast delivery', ex: 'TCP, UDP' },
          { num: 3, name: 'Network', desc: 'IP addresses-ஆல் routing', ex: 'IP, ICMP' },
          { num: 2, name: 'Data Link', desc: 'Same network node-to-node', ex: 'MAC, Ethernet' },
          { num: 1, name: 'Physical', desc: 'Cables, WiFi, hardware', ex: 'Cables, hubs' },
        ],
      },
    },
  },
  {
    id: 'wifi-security',
    type: 'grid',
    visual: 'router',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'WiFi Security Essentials',
        subtitle: 'Protect yourself on home, college, and public networks',
        cards: [
          { icon: 'router', title: 'WPA2 / WPA3', desc: 'Always use WPA3 if available. WEP and open WiFi are easily hacked.' },
          { icon: 'threat', title: 'Public WiFi Danger', desc: 'Airport, café WiFi — attackers can intercept unencrypted traffic.' },
          { icon: 'lock', title: 'Use VPN on Public WiFi', desc: 'VPN encrypts all traffic — safe for browsing on untrusted networks.' },
          { icon: 'shield', title: 'Strong WiFi Password', desc: '12+ characters — prevents neighbors from joining your network.' },
          { icon: 'mobile', title: 'Disable Auto-Connect', desc: 'Phone auto-joining random networks exposes you to fake hotspots.' },
          { icon: 'firewall', title: 'Router Firmware Updates', desc: 'Keep router updated — old firmware has known security holes.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'WiFi Security Essentials',
        subtitle: 'Home, college, public networks-ல் protect',
        cards: [
          { icon: 'router', title: 'WPA2 / WPA3', desc: 'WPA3 use. WEP, open WiFi easily hacked.' },
          { icon: 'threat', title: 'Public WiFi Danger', desc: 'Airport, café — unencrypted traffic intercept.' },
          { icon: 'lock', title: 'VPN on Public WiFi', desc: 'VPN encrypts traffic — untrusted networks-ல் safe.' },
          { icon: 'shield', title: 'Strong WiFi Password', desc: '12+ characters — neighbors join prevent.' },
          { icon: 'mobile', title: 'Disable Auto-Connect', desc: 'Random networks auto-join — fake hotspot risk.' },
          { icon: 'firewall', title: 'Router Firmware Updates', desc: 'Old firmware — known security holes.' },
        ],
      },
    },
  },
  {
    id: 'encryption',
    type: 'showcase',
    visual: 'lock',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'Encryption Basics',
        subtitle: 'Scrambling data so only authorized people can read it',
        bullets: [
          'Plain text = readable by anyone. Encrypted text = scrambled nonsense without the key.',
          'HTTPS uses TLS/SSL — your bank login and card numbers are encrypted in transit.',
          'AES-256 is the gold standard for encrypting files, databases, and messages.',
          'Hashing (SHA-256) is one-way — passwords are hashed, never stored as plain text.',
          'End-to-end encryption (WhatsApp) means only sender and receiver can read messages.',
        ],
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'Encryption Basics',
        subtitle: 'Authorized நபர்கள் மட்டும் படிக்க data scramble',
        bullets: [
          'Plain text = anyone read. Encrypted = key இல்லாமல் nonsense.',
          'HTTPS TLS/SSL — bank login, card numbers transit-ல் encrypted.',
          'AES-256 — files, databases, messages encrypt gold standard.',
          'Hashing SHA-256 one-way — passwords hashed, plain text store இல்லை.',
          'End-to-end encryption WhatsApp — sender, receiver மட்டும் read.',
        ],
      },
    },
  },
  {
    id: 'malware-detail',
    type: 'grid',
    visual: 'threat',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'Malware Types — Deep Dive',
        subtitle: 'Know what you are fighting against',
        cards: [
          { icon: 'threat', title: 'Virus', desc: 'Attaches to files and spreads when opened. Example: infected email attachment.' },
          { icon: 'lock', title: 'Trojan', desc: 'Disguised as legitimate software. Example: fake game crack that steals passwords.' },
          { icon: 'server', title: 'Ransomware', desc: 'Encrypts all files and demands payment. Example: WannaCry, LockBit.' },
          { icon: 'globe', title: 'Spyware', desc: 'Secretly monitors activity. Example: keyloggers recording every keystroke.' },
          { icon: 'network', title: 'Worm', desc: 'Self-spreads across networks without user action. Example: Conficker worm.' },
          { icon: 'mobile', title: 'Adware', desc: 'Shows unwanted ads and tracks browsing. Example: fake browser extensions.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'Malware Types — Deep Dive',
        subtitle: 'எதிர்த்து fight செய்வது என்ன என்று அறியுங்கள்',
        cards: [
          { icon: 'threat', title: 'Virus', desc: 'Files attach, open-ஆ spread. Infected email attachment.' },
          { icon: 'lock', title: 'Trojan', desc: 'Legitimate software disguise. Fake game crack steals passwords.' },
          { icon: 'server', title: 'Ransomware', desc: 'Files encrypt, payment demand. WannaCry, LockBit.' },
          { icon: 'globe', title: 'Spyware', desc: 'Secretly monitor. Keyloggers record keystrokes.' },
          { icon: 'network', title: 'Worm', desc: 'Self-spread networks. Conficker worm.' },
          { icon: 'mobile', title: 'Adware', desc: 'Unwanted ads, browsing track. Fake browser extensions.' },
        ],
      },
    },
  },
  {
    id: 'digital-footprint',
    type: 'bullets',
    visual: 'globe',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'Digital Footprint & Privacy',
        subtitle: 'Everything you post online can be found by attackers',
        points: [
          { icon: 'globe', text: 'Social media profiles reveal birthday, location, school, and family details.' },
          { icon: 'threat', text: 'Hackers use OSINT — open-source intelligence from public posts to craft targeted attacks.' },
          { icon: 'lock', text: 'Set profiles to private. Remove phone numbers and home addresses from public view.' },
          { icon: 'mobile', text: 'Think before posting — deleted posts can be cached, screenshotted, or archived.' },
          { icon: 'shield', text: 'Google yourself — see what attackers see. Remove old unused accounts.' },
        ],
        labLink: { path: '/lab/footprint', label: '👣 Digital Footprint Checker →' },
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'Digital Footprint & Privacy',
        subtitle: 'Online post செய்வது எல்லாம் attackers find செய்யலாம்',
        points: [
          { icon: 'globe', text: 'Social media birthday, location, school, family details reveal.' },
          { icon: 'threat', text: 'Hackers OSINT use — public posts-ஆ targeted attacks craft.' },
          { icon: 'lock', text: 'Profiles private set. Phone, address public view-ல் remove.' },
          { icon: 'mobile', text: 'Post செய்வதற்கு முன் think — deleted posts cached, screenshotted.' },
          { icon: 'shield', text: 'Google yourself — attackers என்ன see. Old accounts remove.' },
        ],
        labLink: { path: '/lab/footprint', label: '👣 Footprint Checker →' },
      },
    },
  },
  {
    id: 'indian-cyber-laws',
    type: 'showcase',
    visual: 'shield',
    content: {
      en: {
        tag: 'MODULE 06',
        title: 'Indian Cyber Laws & Reporting',
        subtitle: 'Know your rights and how to report cyber crime in India',
        bullets: [
          'IT Act 2000 (amended 2008) — governs cyber crime, data protection, and digital signatures in India.',
          'Section 66 — hacking, identity theft, and spreading viruses are punishable offences.',
          'Report cyber crime at cybercrime.gov.in or call national helpline 1930.',
          'CERT-In (cert-in.org.in) — national agency for cyber security incidents and advisories.',
          'Save evidence: screenshots, URLs, SMS, transaction IDs before reporting.',
        ],
      },
      ta: {
        tag: 'தொகுதி 06',
        title: 'Indian Cyber Laws & Reporting',
        subtitle: 'India-ல் cyber crime report எப்படி — உங்கள் rights',
        bullets: [
          'IT Act 2000 (2008 amended) — cyber crime, data protection, digital signatures India.',
          'Section 66 — hacking, identity theft, virus spread punishable.',
          'cybercrime.gov.in report அல்லது helpline 1930 call.',
          'CERT-In cert-in.org.in — national cyber security incidents, advisories.',
          'Evidence save: screenshots, URLs, SMS, transaction IDs report前.',
        ],
      },
    },
  },
  {
    id: 'certifications',
    type: 'grid',
    visual: 'career',
    content: {
      en: {
        tag: 'MODULE 07 · CAREER',
        title: 'Certifications Path',
        subtitle: "Industry-recognized credentials — including your trainer's certifications",
        cards: [
          { icon: 'career', title: 'CEH (EC-Council)', desc: 'Certified Ethical Hacker — penetration testing fundamentals. Trainer: Mohan Raj ✓' },
          { icon: 'shield', title: 'CompTIA Security+', desc: 'Entry-level global cert covering networks, threats, and compliance.' },
          { icon: 'lock', title: 'CC (ISC2)', desc: 'Certified in Cybersecurity — beginner-friendly ISC2 credential. Trainer: Mohan Raj ✓' },
          { icon: 'network', title: 'Cisco CyberOps', desc: 'SOC analyst skills — log analysis and threat detection. Trainer: Mohan Raj ✓' },
          { icon: 'linux', title: 'RHCSA', desc: 'Red Hat Linux administration — essential for server and cloud roles.' },
          { icon: 'cloud', title: 'AWS / Azure Security', desc: 'Cloud-specific certs for the fastest-growing security job segment.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 07 · CAREER',
        title: 'Certifications Path',
        subtitle: 'Industry credentials — trainer certifications உட்பட',
        cards: [
          { icon: 'career', title: 'CEH (EC-Council)', desc: 'Certified Ethical Hacker — pentest fundamentals. Trainer: Mohan Raj ✓' },
          { icon: 'shield', title: 'CompTIA Security+', desc: 'Entry-level global cert — networks, threats, compliance.' },
          { icon: 'lock', title: 'CC (ISC2)', desc: 'Certified in Cybersecurity — beginner ISC2. Trainer: Mohan Raj ✓' },
          { icon: 'network', title: 'Cisco CyberOps', desc: 'SOC analyst — log analysis, threat detection. Trainer: Mohan Raj ✓' },
          { icon: 'linux', title: 'RHCSA', desc: 'Red Hat Linux admin — server, cloud roles.' },
          { icon: 'cloud', title: 'AWS / Azure Security', desc: 'Cloud certs — fastest-growing security jobs.' },
        ],
      },
    },
  },
  {
    id: 'red-blue-team',
    type: 'split',
    visual: 'target',
    content: {
      en: {
        tag: 'MODULE 07 · CAREER',
        title: 'Red Team vs Blue Team',
        subtitle: 'Two sides of cyber security — attack and defend',
        left: {
          title: 'Red Team (Offense)',
          items: [
            'Simulates real attackers to test defenses.',
            'Uses pentesting, social engineering, and exploit tools.',
            'Finds vulnerabilities before criminals do.',
            'Roles: Penetration Tester, Red Team Operator, Bug Bounty Hunter.',
          ],
        },
        right: {
          title: 'Blue Team (Defense)',
          items: [
            'Monitors, detects, and responds to attacks 24/7.',
            'Uses SIEM, firewalls, log analysis, and incident response.',
            'Protects systems and recovers from breaches.',
            'Roles: SOC Analyst, Incident Responder, Security Engineer.',
          ],
        },
      },
      ta: {
        tag: 'தொகுதி 07 · CAREER',
        title: 'Red Team vs Blue Team',
        subtitle: 'Cyber security இரண்டு பக்கங்கள் — attack & defend',
        left: {
          title: 'Red Team (Offense)',
          items: [
            'Real attackers simulate — defenses test.',
            'Pentesting, social engineering, exploit tools.',
            'Criminals-க்கு முன் vulnerabilities find.',
            'Roles: Pentester, Red Team Operator, Bug Bounty Hunter.',
          ],
        },
        right: {
          title: 'Blue Team (Defense)',
          items: [
            '24/7 attacks monitor, detect, respond.',
            'SIEM, firewalls, log analysis, incident response.',
            'Systems protect, breaches recover.',
            'Roles: SOC Analyst, Incident Responder, Security Engineer.',
          ],
        },
      },
    },
  },
  {
    id: 'cloud-security',
    type: 'showcase',
    visual: 'cloud',
    content: {
      en: {
        tag: 'MODULE 07 · CAREER',
        title: 'Cloud Security (AWS / Azure)',
        subtitle: 'The fastest-growing area in cyber security jobs',
        bullets: [
          'Cloud = running servers, apps, and data on AWS, Azure, or Google Cloud instead of local hardware.',
          'Misconfigured cloud storage (open S3 buckets) causes massive data breaches every year.',
          'Shared responsibility model — cloud provider secures infrastructure, YOU secure your data and access.',
          'Key skills: IAM policies, encryption at rest, VPC networking, and cloud logging.',
          'High demand in India — most companies are migrating to cloud post-2020.',
        ],
      },
      ta: {
        tag: 'தொகுதி 07 · CAREER',
        title: 'Cloud Security (AWS / Azure)',
        subtitle: 'Cyber security jobs-ல் fastest-growing area',
        bullets: [
          'Cloud = AWS, Azure, Google Cloud-ல் servers, apps, data — local hardware இல்லை.',
          'Misconfigured cloud storage open S3 buckets — massive breaches yearly.',
          'Shared responsibility — provider infrastructure secure, YOU data & access secure.',
          'Key skills: IAM policies, encryption at rest, VPC, cloud logging.',
          'India-ல் high demand — companies cloud migrate post-2020.',
        ],
      },
    },
  },
  {
    id: 'bug-bounty',
    type: 'bullets',
    visual: 'target',
    content: {
      en: {
        tag: 'MODULE 07 · CAREER',
        title: 'Bug Bounty Basics',
        subtitle: 'Get paid to find security bugs — legally and ethically',
        points: [
          { icon: 'target', text: 'Companies pay researchers who find and report security vulnerabilities responsibly.' },
          { icon: 'globe', text: 'Platforms: HackerOne, Bugcrowd, Intigriti — connect hackers with companies.' },
          { icon: 'shield', text: 'Always stay within scope — only test systems listed in the program rules.' },
          { icon: 'lock', text: 'Never exploit beyond proof-of-concept — report immediately through official channels.' },
          { icon: 'career', text: 'Top hunters earn lakhs per year — great portfolio builder for freshers.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 07 · CAREER',
        title: 'Bug Bounty Basics',
        subtitle: 'Security bugs find — legally, ethically, paid',
        points: [
          { icon: 'target', text: 'Companies vulnerabilities report researchers-க்கு pay.' },
          { icon: 'globe', text: 'Platforms: HackerOne, Bugcrowd, Intigriti.' },
          { icon: 'shield', text: 'Scope-க்குள் மட்டும் — program rules listed systems only.' },
          { icon: 'lock', text: 'Proof-of-concept beyond exploit வேண்டாம் — official channels report.' },
          { icon: 'career', text: 'Top hunters lakhs/year — freshers portfolio builder.' },
        ],
      },
    },
  },
  {
    id: 'resume-interview',
    type: 'bullets',
    visual: 'career',
    content: {
      en: {
        tag: 'MODULE 07 · CAREER',
        title: 'Resume & Interview Tips',
        subtitle: 'Stand out as a cyber security fresher',
        points: [
          { icon: 'career', text: 'List labs completed: Recon, Phishing, OWASP, SOC, CTF — with CyberSec Arena as your platform.' },
          { icon: 'shield', text: 'Mention certifications: CEH, Security+, CC — even training counts on a fresher resume.' },
          { icon: 'terminal', text: 'Highlight Linux commands, Nmap, Wireshark — tools you practiced hands-on.' },
          { icon: 'target', text: 'Prepare STAR stories: Situation, Task, Action, Result for behavioral questions.' },
          { icon: 'lock', text: 'Common interview Q: "Explain CIA Triad", "What is phishing?", "Difference between TCP and UDP".' },
        ],
      },
      ta: {
        tag: 'தொகுதி 07 · CAREER',
        title: 'Resume & Interview Tips',
        subtitle: 'Cyber security fresher-ஆ stand out',
        points: [
          { icon: 'career', text: 'Labs list: Recon, Phishing, OWASP, SOC, CTF — CyberSec Arena platform.' },
          { icon: 'shield', text: 'Certifications: CEH, Security+, CC — training கூட fresher resume-ல் count.' },
          { icon: 'terminal', text: 'Linux commands, Nmap, Wireshark highlight — hands-on tools.' },
          { icon: 'target', text: 'STAR stories prepare: Situation, Task, Action, Result.' },
          { icon: 'lock', text: 'Interview Q: CIA Triad, phishing, TCP vs UDP difference.' },
        ],
      },
    },
  },
  {
    id: 'attack-timeline',
    type: 'timeline',
    visual: 'threat',
    content: {
      en: {
        tag: 'MODULE 08 · VISUAL',
        title: 'Attack Timeline — Phishing to Breach',
        subtitle: 'Animated flow: how one click leads to disaster',
        steps: [
          { icon: 'mobile', label: '1. Phishing Email', desc: 'Victim receives urgent fake bank SMS or email' },
          { icon: 'threat', label: '2. Malicious Link', desc: 'User clicks link — malware downloads silently' },
          { icon: 'lock', label: '3. Credential Theft', desc: 'Fake login page captures username and password' },
          { icon: 'server', label: '4. Lateral Movement', desc: 'Attacker spreads inside the network undetected' },
          { icon: 'shield', label: '5. Data Exfiltration', desc: 'Sensitive files stolen — breach complete' },
        ],
      },
      ta: {
        tag: 'தொகுதி 08 · VISUAL',
        title: 'Attack Timeline — Phishing to Breach',
        subtitle: 'Animated flow: one click → disaster',
        steps: [
          { icon: 'mobile', label: '1. Phishing Email', desc: 'Fake bank SMS/email urgent' },
          { icon: 'threat', label: '2. Malicious Link', desc: 'Link click — malware silent download' },
          { icon: 'lock', label: '3. Credential Theft', desc: 'Fake login page username, password capture' },
          { icon: 'server', label: '4. Lateral Movement', desc: 'Attacker network-ல் undetected spread' },
          { icon: 'shield', label: '5. Data Exfiltration', desc: 'Sensitive files stolen — breach complete' },
        ],
      },
    },
  },
  {
    id: 'password-compare',
    type: 'compare',
    visual: 'lock',
    content: {
      en: {
        tag: 'MODULE 08 · VISUAL',
        title: 'Weak vs Strong Password',
        subtitle: 'Side-by-side — why password strength matters',
        bad: {
          title: 'Weak Password',
          example: 'password123',
          items: ['Cracked in seconds by dictionary attack', 'No special characters or numbers mix', 'Used on multiple sites — one breach = all accounts lost', 'Shows as WEAK on strength meter'],
        },
        good: {
          title: 'Strong Password',
          example: 'Tr@in#2026!Lab',
          items: ['Would take centuries to brute-force', 'Mix of upper, lower, numbers, symbols', 'Unique per account — breach isolated to one site', 'Shows STRONG — enable MFA for best protection'],
        },
        labLink: { path: '/lab/breach', label: '💥 Password Breach Simulator →' },
      },
      ta: {
        tag: 'தொகுதி 08 · VISUAL',
        title: 'Weak vs Strong Password',
        subtitle: 'Side-by-side — password strength ஏன் matter',
        bad: {
          title: 'Weak Password',
          example: 'password123',
          items: ['Dictionary attack-ல் seconds-ல் crack', 'Special characters, numbers mix இல்லை', 'Multiple sites same — one breach all lost', 'Strength meter WEAK'],
        },
        good: {
          title: 'Strong Password',
          example: 'Tr@in#2026!Lab',
          items: ['Brute-force centuries', 'Upper, lower, numbers, symbols mix', 'Unique per account — breach isolated', 'STRONG — MFA enable best protection'],
        },
        labLink: { path: '/lab/breach', label: '💥 Breach Simulator →' },
      },
    },
  },
  {
    id: 'casestudy-wannacry',
    type: 'casestudy',
    visual: 'threat',
    content: {
      en: {
        tag: 'MODULE 08 · CASE STUDY',
        title: 'Case Study: WannaCry (2017)',
        subtitle: 'Real-world ransomware that hit 200,000+ computers worldwide',
        facts: [
          { label: 'What happened', text: 'Ransomware spread via EternalBlue exploit — encrypted files and demanded Bitcoin payment.' },
          { label: 'Impact', text: 'NHS hospitals in UK shut down. FedEx, Renault factories halted. Thousands of crores in damage.' },
          { label: 'Root cause', text: 'Unpatched Windows systems — Microsoft had released a fix 2 months earlier.' },
          { label: 'Lesson', text: 'Always install security updates immediately. Backup data regularly. Never pay ransom.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 08 · CASE STUDY',
        title: 'Case Study: WannaCry (2017)',
        subtitle: '200,000+ computers worldwide ransomware',
        facts: [
          { label: 'What happened', text: 'EternalBlue exploit — files encrypted, Bitcoin payment demand.' },
          { label: 'Impact', text: 'UK NHS hospitals shut. FedEx, Renault halted. Crores damage.' },
          { label: 'Root cause', text: 'Unpatched Windows — Microsoft fix 2 months earlier release.' },
          { label: 'Lesson', text: 'Security updates immediately install. Backup regularly. Ransom pay வேண்டாம்.' },
        ],
      },
    },
  },
  {
    id: 'casestudy-upi',
    type: 'casestudy',
    visual: 'mobile',
    content: {
      en: {
        tag: 'MODULE 08 · CASE STUDY',
        title: 'Case Study: UPI Scam (India)',
        subtitle: 'How social engineering steals lakhs from ordinary users daily',
        facts: [
          { label: 'Attack method', text: 'Fake "you received ₹5000" SMS with malicious link or QR code scan request.' },
          { label: 'Social trick', text: 'Caller pretends to be bank officer — asks for OTP "to verify refund".' },
          { label: 'Real impact', text: 'Victims lose entire bank balance in seconds — money transferred to mule accounts.' },
          { label: 'Protection', text: 'NEVER share OTP. Banks never ask OTP over phone. Verify via official app only.' },
        ],
      },
      ta: {
        tag: 'தொகுதி 08 · CASE STUDY',
        title: 'Case Study: UPI Scam (India)',
        subtitle: 'Social engineering daily lakhs steal',
        facts: [
          { label: 'Attack method', text: 'Fake "₹5000 received" SMS malicious link/QR scan.' },
          { label: 'Social trick', text: 'Bank officer pretend — OTP "refund verify" ask.' },
          { label: 'Real impact', text: 'Seconds-ல் full balance lost — mule accounts transfer.' },
          { label: 'Protection', text: 'OTP NEVER share. Banks phone-ல் OTP ask இல்லை. Official app only verify.' },
        ],
      },
    },
  },
  {
    id: 'bootcamp-roadmap',
    type: 'bootcamp',
    visual: 'target',
    content: {
      en: {
        tag: 'MODULE 08 · ROADMAP',
        title: 'ICT Academy 3-Day Session Plan',
        subtitle: 'IBM Adult Learner 2026-27 · Auxilium College · Batch G5937',
        days: [
          { day: 'DAY 01 · 19 Aug', title: 'Cybersecurity Fundamentals', topics: ['Introduction to Cybersecurity', 'Attack Methods & Techniques', 'Cyber Threat Landscape', 'Intelligence & Assessment', 'Strategy & Impact'] },
          { day: 'DAY 02 · 20 Aug', title: 'Threat Intelligence & Hunting', topics: ['Targeted Industries & Trends', 'Core Security & Intelligence', 'Protect Your Organization', 'Enterprise Security Solutions', 'Attack Taxonomy'] },
          { day: 'DAY 03 · 21 Aug', title: 'Project & Assessment', topics: ['URL & Phishing Defense', 'OSINT Footprint Check', 'Network & WiFi Security', 'Hands-on CTF Project', 'Certificate & Review'] },
        ],
        labLink: { path: '/bootcamp', label: '🎓 Open ICT Session Plan →' },
      },
      ta: {
        tag: 'தொகுதி 08 · ROADMAP',
        title: 'ICT Academy 3-Day Session Plan',
        subtitle: 'IBM Adult Learner 2026-27 · Auxilium College · Batch G5937',
        days: [
          { day: 'DAY 01 · 19 Aug', title: 'Cybersecurity Fundamentals', topics: ['Introduction to Cybersecurity', 'Attack Methods & Techniques', 'Cyber Threat Landscape', 'Intelligence & Assessment', 'Strategy & Impact'] },
          { day: 'DAY 02 · 20 Aug', title: 'Threat Intelligence & Hunting', topics: ['Targeted Industries & Trends', 'Core Security & Intelligence', 'Protect Organization', 'Enterprise Security', 'Attack Taxonomy'] },
          { day: 'DAY 03 · 21 Aug', title: 'Project & Assessment', topics: ['URL & Phishing Defense', 'OSINT Footprint', 'Network & WiFi Security', 'Hands-on CTF', 'Certificate & Review'] },
        ],
        labLink: { path: '/bootcamp', label: '🎓 ICT Session Plan →' },
      },
    },
  },
  {
    id: 'lab-map',
    type: 'labmap',
    visual: 'target',
    content: {
      en: {
        tag: 'MODULE 08 · LABS',
        title: 'After PPT → Try These 8 Labs',
        subtitle: 'Hands-on practice on CyberSec Arena dashboard',
        labs: [
          { icon: '🕵️', name: 'Recon Lab', path: '/recon', desc: 'Nmap port scanning simulation' },
          { icon: '🎣', name: 'Phishing Detector', path: '/phishing', desc: 'Spot fake emails & scams' },
          { icon: '🔐', name: 'Password Security', path: '/password', desc: 'Strength testing & MFA' },
          { icon: '🌐', name: 'Network Analysis', path: '/network', desc: 'Wireshark packet analysis' },
          { icon: '🛡️', name: 'Web Security / OWASP', path: '/owasp', desc: 'SQLi & XSS simulations' },
          { icon: '📊', name: 'SOC / Log Analysis', path: '/soc', desc: 'Detect anomalies in logs' },
          { icon: '🚨', name: 'Incident Response', path: '/ir', desc: 'IR lifecycle step ordering' },
          { icon: '🏆', name: 'Mini CTF', path: '/ctf', desc: 'Capture the flag challenges' },
        ],
      },
      ta: {
        tag: 'தொகுதி 08 · LABS',
        title: 'PPT-க்கு பிறகு → 8 Labs Try',
        subtitle: 'CyberSec Arena dashboard hands-on practice',
        labs: [
          { icon: '🕵️', name: 'Recon Lab', path: '/recon', desc: 'Nmap port scanning simulation' },
          { icon: '🎣', name: 'Phishing Detector', path: '/phishing', desc: 'Fake emails & scams spot' },
          { icon: '🔐', name: 'Password Security', path: '/password', desc: 'Strength testing & MFA' },
          { icon: '🌐', name: 'Network Analysis', path: '/network', desc: 'Wireshark packet analysis' },
          { icon: '🛡️', name: 'Web Security / OWASP', path: '/owasp', desc: 'SQLi & XSS simulations' },
          { icon: '📊', name: 'SOC / Log Analysis', path: '/soc', desc: 'Log anomalies detect' },
          { icon: '🚨', name: 'Incident Response', path: '/ir', desc: 'IR lifecycle steps' },
          { icon: '🏆', name: 'Mini CTF', path: '/ctf', desc: 'Capture the flag challenges' },
        ],
      },
    },
  },
  {
    id: 'quiz',
    type: 'quiz',
    visual: 'shield',
    content: {
      en: {
        tag: 'MODULE 08 · QUIZ',
        title: 'Quick Knowledge Check',
        subtitle: 'Test yourself — click an answer to see if you are correct',
        questions: [
          {
            q: 'Which is a sign of a phishing message?',
            options: ['HTTPS padlock in browser', 'Urgent request to share OTP immediately', 'Email from a known contact'],
            correct: 1,
            explain: 'Banks and UPI apps NEVER ask for OTP over phone or SMS links. Urgency is a classic phishing tactic.',
          },
          {
            q: 'Is it safe to do net banking on public café WiFi without VPN?',
            options: ['Yes, always safe', 'No, traffic can be intercepted', 'Only on weekends'],
            correct: 1,
            explain: 'Public WiFi is unencrypted. Attackers on the same network can capture your login credentials.',
          },
          {
            q: 'Which is the strongest password?',
            options: ['password123', '12345678', 'Tr@in#2026!Lab'],
            correct: 2,
            explain: 'Strong passwords mix upper/lowercase, numbers, symbols, and are 12+ characters long.',
          },
        ],
      },
      ta: {
        tag: 'தொகுதி 08 · QUIZ',
        title: 'Quick Knowledge Check',
        subtitle: 'Test yourself — answer click correct-ஆ check',
        questions: [
          {
            q: 'Phishing message sign எது?',
            options: ['Browser HTTPS padlock', 'OTP immediately share urgent request', 'Known contact email'],
            correct: 1,
            explain: 'Banks, UPI apps phone/SMS OTP NEVER ask. Urgency classic phishing tactic.',
          },
          {
            q: 'Public café WiFi VPN இல்லாமல் net banking safe?',
            options: ['Yes, always safe', 'No, traffic intercept possible', 'Weekends only'],
            correct: 1,
            explain: 'Public WiFi unencrypted. Same network attackers credentials capture.',
          },
          {
            q: 'Strongest password எது?',
            options: ['password123', '12345678', 'Tr@in#2026!Lab'],
            correct: 2,
            explain: 'Strong passwords upper/lowercase, numbers, symbols mix, 12+ chars.',
          },
        ],
      },
    },
  },
]
