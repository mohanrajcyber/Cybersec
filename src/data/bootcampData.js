import { ICT_SESSION } from './sessionPlan'

/** Topics match ICT Academy portal sub-topics — labs map to hands-on practice */
export const bootcampDays = [
  {
    id: 'day1',
    label: 'DAY 01 — CYBERSECURITY FUNDAMENTALS',
    date: 'Wed, 19 Aug 2026',
    ictTopic: 'Cybersecurity Fundamentals',
    methodology: 'Hands-on session · Mentor-led sessions',
    hours: 5,
    icon: '📖',
    topics: [
      { key: 'introCybersecurity', name: 'Introduction to Cybersecurity', link: '/ppt' },
      { key: 'attackMethods', name: 'Attack Methods and Techniques', link: '/owasp' },
      { key: 'threatLandscape', name: 'Cyber Threat Landscape', link: '/phishing' },
      { key: 'cyberIntelligence', name: 'Cybersecurity Intelligence and Assessment', link: '/info' },
      { key: 'cyberStrategy', name: 'Cybersecurity Strategy & Impact', link: null },
    ],
  },
  {
    id: 'day2',
    label: 'DAY 02 — THREAT INTELLIGENCE & HUNTING',
    date: 'Thu, 20 Aug 2026',
    ictTopic: 'Cybersecurity Fundamentals · Getting Started with Threat Intelligence and Hunting',
    methodology: 'Hands-on learning with project · Mentor-led sessions',
    hours: 5,
    icon: '🔧',
    topics: [
      { key: 'targetedIndustries', name: 'Analyze the most targeted industries and current security trends', link: '/lab/scam-sim' },
      { key: 'coreSecurityIntelligence', name: 'Core Security Concepts & Intelligence', link: '/soc' },
      { key: 'protectOrganization', name: 'Identify the steps you can take to protect your organization', link: '/lab/breach' },
      { key: 'enterpriseSecurity', name: 'Leverage high-end enterprise security solutions in demand', link: '/lab/firewall' },
      { key: 'attackTaxonomy', name: 'Understand the taxonomy of cybersecurity attacks', link: '/recon' },
    ],
  },
  {
    id: 'day3',
    label: 'DAY 03 — HANDS-ON PROJECT & ASSESSMENT',
    date: 'Fri, 21 Aug 2026',
    ictTopic: 'Threat Intelligence Hunting · Project Completion · Session Assessment',
    methodology: 'Hands-on project · Mentor-led review',
    hours: 5,
    icon: '🛡️',
    topics: [
      { key: 'urlPhishingDefense', name: 'Phishing URL Analysis & Link Defense', link: '/lab/url-scanner' },
      { key: 'digitalFootprint', name: 'OSINT & Digital Footprint Assessment', link: '/lab/footprint' },
      { key: 'networkDefense', name: 'Network Security & WiFi Awareness', link: '/lab/wifi-demo' },
      { key: 'handsOnProject', name: 'Hands-on Project — Mini CTF Challenge', link: '/ctf' },
      { key: 'sessionComplete', name: 'Session Review · Certificate & Progress', link: '/progress' },
    ],
  },
]

export { ICT_SESSION }

export const ciaTriadContent = {
  title: 'Core Security Concepts — CIA Triad',
  sections: [
    {
      heading: 'Confidentiality',
      text: 'Ensures that sensitive information is accessible only to authorized individuals. Encryption, access controls, and data classification protect confidentiality.',
    },
    {
      heading: 'Integrity',
      text: 'Guarantees that data has not been altered or tampered with. Hash functions, digital signatures, and version control maintain data integrity.',
    },
    {
      heading: 'Availability',
      text: 'Ensures systems and data are accessible when needed. Redundancy, backups, DDoS protection, and disaster recovery plans support availability.',
    },
  ],
}

export const threatsContent = {
  title: 'Cyber Threat Landscape',
  sections: [
    { heading: 'Malware', text: 'Viruses, ransomware, trojans, and spyware designed to damage or gain unauthorized access to systems.' },
    { heading: 'Phishing', text: 'Social engineering attacks via email, SMS, or fake websites to steal credentials or deploy malware.' },
    { heading: 'DDoS', text: 'Distributed Denial of Service floods targets with traffic, making services unavailable to legitimate users.' },
    { heading: 'Insider Threats', text: 'Malicious or negligent actions by employees, contractors, or partners with legitimate access.' },
    { heading: 'Zero-Day Exploits', text: 'Attacks targeting previously unknown vulnerabilities before patches are available.' },
  ],
}

/** Class learning path — follows 3-day session order */
export const SESSION_CLASS_PATH = [
  { step: 1, day: 1, label: 'PPT Intro', path: '/ppt', icon: '📽️' },
  { step: 2, day: 1, label: 'Phishing', path: '/phishing', icon: '🎣' },
  { step: 3, day: 1, label: 'URL Scanner', path: '/lab/url-scanner', icon: '🔗' },
  { step: 4, day: 1, label: 'Burp Suite', path: '/burp-suite', icon: '🔶' },
  { step: 5, day: 1, label: 'OSINT Info', path: '/info', icon: '🔍' },
  { step: 6, day: 2, label: 'UPI Scam Sim', path: '/lab/scam-sim', icon: '📱' },
  { step: 7, day: 2, label: 'SOC Logs', path: '/soc', icon: '📊' },
  { step: 8, day: 2, label: 'Breach Sim', path: '/lab/breach', icon: '💥' },
  { step: 9, day: 2, label: 'Recon Lab', path: '/recon', icon: '🕵️' },
  { step: 10, day: 3, label: 'Footprint', path: '/lab/footprint', icon: '👣' },
  { step: 11, day: 3, label: 'Mini CTF', path: '/ctf', icon: '🏆' },
]
