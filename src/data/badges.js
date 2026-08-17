export const BADGES = [
  { id: 'recon', icon: '🕵️', name: 'Recon Master', lab: 'recon' },
  { id: 'network', icon: '🌐', name: 'Packet Analyst', lab: 'network' },
  { id: 'owasp', icon: '🛡️', name: 'OWASP Expert', lab: 'owasp' },
  { id: 'phishing', icon: '🎣', name: 'Phish Hunter', lab: 'phishing' },
  { id: 'password', icon: '🔐', name: 'Password Pro', lab: 'password' },
  { id: 'soc', icon: '📊', name: 'SOC Analyst', lab: 'soc' },
  { id: 'ir', icon: '🚨', name: 'Incident Responder', lab: 'ir' },
  { id: 'ctf', icon: '🏆', name: 'CTF Champion', lab: 'ctf', minFlags: 3 },
  { id: 'bootcamp', icon: '🎓', name: 'Bootcamp Graduate', requiresBootcamp: 100 },
  { id: 'linux', icon: '🐧', name: 'Linux Starter', lab: 'linux' },
  { id: 'hash', icon: '🔢', name: 'Crypto Basics', lab: 'hash' },
  { id: 'firewall', icon: '🧱', name: 'Firewall Admin', lab: 'firewall' },
  { id: 'enumeration', icon: '🔎', name: 'Enum Expert', lab: 'enumeration' },
  { id: 'explorer', icon: '🌟', name: 'Lab Explorer', minLabs: 15 },
  { id: 'master', icon: '👑', name: 'Cyber Master', minLabs: 30 },
]

export function computeScore(data) {
  const boot = Object.values(data.bootcamp || {}).flatMap((d) => Object.values(d))
  const bootPct = boot.length ? Math.round((boot.filter(Boolean).length / boot.length) * 100) : 0
  const labs = (data.completedLabs || []).length
  const ctf = data.ctfFlags?.length || 0
  return Math.min(100, Math.round(bootPct * 0.25 + Math.min(labs * 2.5, 65) + ctf * 5))
}

export function getEarnedBadges(data) {
  const completed = data.completedLabs || []
  const bootPct = (() => {
    const all = Object.values(data.bootcamp || {}).flatMap((d) => Object.values(d))
    if (!all.length) return 0
    return Math.round((all.filter(Boolean).length / all.length) * 100)
  })()

  return BADGES.filter((b) => {
    if (b.requiresBootcamp) return bootPct >= b.requiresBootcamp
    if (b.minFlags) return (data.ctfFlags?.length || 0) >= b.minFlags
    if (b.minLabs) return completed.length >= b.minLabs
    return completed.includes(b.lab)
  })
}
