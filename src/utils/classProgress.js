import { safeGetItem } from './storage'

const STUDENTS_KEY = 'cybersec-students'

export const TRACKED_LABS = [
  { id: 'phishing', label: 'Phishing Detector', path: '/phishing' },
  { id: 'url-scanner', label: 'URL Scanner', path: '/lab/url-scanner' },
  { id: 'password', label: 'Password Security', path: '/password' },
  { id: 'breach', label: 'Breach Simulator', path: '/lab/breach' },
  { id: 'scam-sim', label: 'UPI Scam Sim', path: '/lab/scam-sim' },
  { id: 'footprint', label: 'Digital Footprint', path: '/lab/footprint' },
  { id: 'recon', label: 'Recon Lab', path: '/recon' },
  { id: 'network', label: 'Network Analysis', path: '/network' },
]

export function loadAllStudentProgress() {
  try {
    const raw = safeGetItem(STUDENTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getLabCompletionStats() {
  const students = loadAllStudentProgress()
  const total = Object.keys(students).length

  return TRACKED_LABS.map((lab) => {
    const completed = Object.values(students).filter(
      (s) => s.completedLabs?.includes(lab.id)
    ).length
    return { ...lab, completed, total, pct: total ? Math.round((completed / total) * 100) : 0 }
  })
}

export function exportProgressJson() {
  const data = loadAllStudentProgress()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cybersec-progress-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
