import { getSimLabModules } from './simLabs'
import { SESSION_CLASS_PATH } from './bootcampData'

export const MODULE_CATEGORIES = [
  { id: 'all', label: 'All Labs', icon: '📋' },
  { id: 'foundation', label: 'Foundation', icon: '📖' },
  { id: 'hands-on', label: 'Hands-On', icon: '🔧' },
  { id: 'blue-team', label: 'Blue Team', icon: '🛡️' },
  { id: 'red-team', label: 'Red Team', icon: '⚔️' },
  { id: 'web-app', label: 'Web & App', icon: '🌐' },
  { id: 'cloud', label: 'Cloud', icon: '☁️' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'challenge', label: 'Challenge', icon: '🏆' },
]

const CORE_MODULES = [
  {
    id: 'recon', order: 1, icon: '🕵️', name: 'Recon Lab',
    desc: 'Simulated port scanning & service discovery on training targets.',
    learn: 'Find open ports & services safely', path: '/recon', accent: '#2563eb',
    badge: 'Hands-On', category: 'hands-on', difficulty: 'Beginner', duration: '10 min',
    keywords: 'nmap scan port recon reconnaissance', startHere: true,
  },
  {
    id: 'phishing', order: 2, icon: '🎣', name: 'Phishing Detector',
    desc: 'Analyze suspicious emails and identify phishing indicators.',
    learn: 'Spot fake emails & social engineering', path: '/phishing', accent: '#dc2626',
    badge: 'Interactive', category: 'foundation', difficulty: 'Easy', duration: '12 min',
    keywords: 'phishing email social engineering', startHere: true,
  },
  {
    id: 'password', order: 3, icon: '🔐', name: 'Password Security',
    desc: 'Test password strength, learn hashing & MFA best practices.',
    learn: 'Build strong passwords & use MFA', path: '/password', accent: '#d97706',
    badge: 'Fundamentals', category: 'foundation', difficulty: 'Beginner', duration: '8 min',
    keywords: 'password hash mfa strength',
  },
  {
    id: 'network', order: 4, icon: '🌐', name: 'Network Analysis',
    desc: 'Analyze packet captures and identify suspicious traffic patterns.',
    learn: 'Read packets & find suspicious traffic', path: '/network', accent: '#7c3aed',
    badge: 'Analysis', category: 'hands-on', difficulty: 'Medium', duration: '15 min',
    keywords: 'wireshark packet network traffic',
  },
  {
    id: 'owasp', order: 5, icon: '🛡️', name: 'Web Security / OWASP',
    desc: 'Learn SQLi, XSS & broken auth through safe simulations.',
    learn: 'Understand SQLi, XSS & auth flaws', path: '/owasp', accent: '#0d9488',
    badge: 'OWASP Top 10', category: 'hands-on', difficulty: 'Medium', duration: '15 min',
    keywords: 'owasp sql injection xss web security',
  },
  {
    id: 'soc', order: 6, icon: '📊', name: 'SOC / Log Analysis',
    desc: 'Parse security logs and detect anomalies in real-time.',
    learn: 'Analyze logs like a SOC analyst', path: '/soc', accent: '#2563eb',
    badge: 'Blue Team', category: 'blue-team', difficulty: 'Medium', duration: '12 min',
    keywords: 'soc siem log splunk qradar',
  },
  {
    id: 'ir', order: 7, icon: '🚨', name: 'Incident Response',
    desc: 'Arrange IR lifecycle steps for a simulated breach scenario.',
    learn: 'Detect → Contain → Eradicate → Recover', path: '/ir', accent: '#dc2626',
    badge: 'Blue Team', category: 'blue-team', difficulty: 'Easy', duration: '10 min',
    keywords: 'incident response contain eradicate recover',
  },
  {
    id: 'ctf', order: 8, icon: '🏆', name: 'Mini CTF',
    desc: 'Capture the flag challenges to test your skills.',
    learn: 'Solve flags & test your skills', path: '/ctf', accent: '#7c3aed',
    badge: 'Challenge', category: 'challenge', difficulty: 'Medium', duration: '20 min',
    keywords: 'ctf flag capture challenge',
  },
]

const PROGRESS_MODULE = {
  id: 'progress', order: 999, icon: '📚', name: 'Learning Progress',
  desc: 'Track your bootcamp progress and module completion.',
  learn: 'See badges, score & certificate', path: '/progress', accent: '#059669',
  badge: 'Dashboard', category: 'foundation', difficulty: 'Beginner', duration: '2 min',
  keywords: 'progress badge certificate',
}

export const modules = [...CORE_MODULES, ...getSimLabModules(), PROGRESS_MODULE]

export const CLASS_PATH = SESSION_CLASS_PATH
