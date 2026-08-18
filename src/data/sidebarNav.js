/** Sidebar navigation — grouped by ICT session flow + real lab routes */

export const SIDEBAR_NAV = [
  {
    section: 'Main',
    items: [
      { path: '/', label: 'Dashboard', icon: '🏠' },
      { path: '/bootcamp', label: 'ICT Bootcamp', icon: '🎓' },
      { path: '/progress', label: 'My Progress', icon: '📈' },
    ],
  },
  {
    section: 'Hands-On Labs',
    items: [
      { path: '/phishing', label: 'Phishing Detector', icon: '🎣' },
      { path: '/recon', label: 'Recon / Nmap', icon: '🕵️' },
      { path: '/lab/url-scanner', label: 'URL Scanner', icon: '🔗' },
      { path: '/owasp', label: 'OWASP Web Security', icon: '🛡️' },
      { path: '/password', label: 'Password Security', icon: '🔐' },
      { path: '/network', label: 'Network Analysis', icon: '🌐' },
      { path: '/burp-suite', label: 'Burp Suite', icon: '🔶' },
      { path: '/soc', label: 'SOC Log Analysis', icon: '📊' },
      { path: '/ir', label: 'Incident Response', icon: '🚨' },
      { path: '/ctf', label: 'Mini CTF', icon: '🏁' },
    ],
  },
  {
    section: 'Simulators',
    items: [
      { path: '/lab/scam-sim', label: 'UPI / Scam Sim', icon: '📱' },
      { path: '/lab/breach', label: 'Password Breach', icon: '💥' },
      { path: '/lab/footprint', label: 'Digital Footprint', icon: '👣' },
      { path: '/lab/wifi-demo', label: 'WiFi Security', icon: '📶' },
      { path: '/lab/linux', label: 'Linux Commands', icon: '🐧' },
      { path: '/lab/hash', label: 'Hash & Encryption', icon: '#️⃣' },
      { path: '/lab/forensics', label: 'Digital Forensics', icon: '🔬' },
      { path: '/lab/firewall', label: 'Firewall Rules', icon: '🧱' },
    ],
  },
  {
    section: 'Class & Resources',
    items: [
      { path: '/checklist', label: 'VM Setup', icon: '🖥️' },
      { path: '/cheatsheet', label: 'Command Cheat Sheet', icon: '📟' },
      { path: '/war-room', label: 'Attack vs Defense', icon: '⚔️' },
      { path: '/ppt', label: 'Cyber PPT', icon: '📊' },
      { path: '/info', label: 'Info / OSINT', icon: '🔍' },
      { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
      { path: '/contact', label: 'Contact', icon: '📧' },
    ],
  },
]

export const TRAINER_NAV = {
  section: 'Trainer',
  items: [{ path: '/admin', label: 'Admin Panel', icon: '⚙️' }],
}

export function isNavActive(pathname, itemPath) {
  if (itemPath === '/') return pathname === '/'
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}

/** Bottom nav — primary routes for phone users */
export const MOBILE_BOTTOM_NAV = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/war-room', label: 'War Room', icon: '⚔️' },
  { path: '/bootcamp', label: 'Bootcamp', icon: '🎓' },
  { path: '/ctf', label: 'CTF', icon: '🏁' },
  { path: '/phishing', label: 'Phishing', icon: '🎣' },
]
