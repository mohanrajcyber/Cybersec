import { safeGetItem, safeSetItem } from './storage'

export const BURP_LOG_KEY = 'cybersec-burp-logs'
const MAX_LOGS = 800

function loadLogs() {
  try {
    const raw = safeGetItem(BURP_LOG_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLogs(logs) {
  safeSetItem(BURP_LOG_KEY, JSON.stringify(logs.slice(-MAX_LOGS)))
}

export function logBurpEvent({
  studentUsername = 'guest',
  studentName = 'Student',
  action,
  method = 'GET',
  url = '/',
  query = '',
  target = '',
  details = '',
  host = 'www.google.com',
  userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Lab Browser',
}) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: new Date().toISOString(),
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    studentUsername,
    studentName,
    action,
    method,
    url,
    query,
    target,
    details,
    host,
    userAgent: userAgent.slice(0, 120),
  }

  const logs = loadLogs()
  logs.push(entry)
  saveLogs(logs)

  window.dispatchEvent(new CustomEvent('burp-log-update', { detail: entry }))
  return entry
}

export function getBurpLogs() {
  return loadLogs()
}

export function getBurpStats() {
  const logs = loadLogs()
  const students = new Set()
  const searches = []
  const clicks = []

  logs.forEach((l) => {
    if (l.studentUsername) students.add(l.studentUsername)
    if (l.action === 'search' && l.query) searches.push({ ...l })
    if (l.action === 'click') clicks.push({ ...l })
  })

  const searchCounts = {}
  searches.forEach((s) => {
    const q = s.query.toLowerCase()
    searchCounts[q] = (searchCounts[q] || 0) + 1
  })

  const topQueries = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }))

  const openedLab = logs.filter((l) => l.action === 'lab_open').length
  const uniqueOpeners = new Set(logs.filter((l) => l.action === 'lab_open').map((l) => l.studentUsername)).size

  return {
    totalEvents: logs.length,
    uniqueStudents: students.size,
    openedLab,
    uniqueOpeners,
    searchCount: searches.length,
    clickCount: clicks.length,
    topQueries,
    recentLogs: [...logs].reverse().slice(0, 50),
    allSearches: searches.reverse(),
  }
}

export function clearBurpLogs() {
  safeSetItem(BURP_LOG_KEY, '[]')
  window.dispatchEvent(new CustomEvent('burp-log-update'))
}

export function buildHttpRaw(entry) {
  const host = entry.host || 'www.google.com'
  const path = entry.query && host.includes('google')
    ? `/search?q=${encodeURIComponent(entry.query)}&hl=en&source=hp`
    : entry.url || '/'
  const lines = [
    `${entry.method} ${path} HTTP/1.1`,
    `Host: ${host}`,
    `User-Agent: ${entry.userAgent || 'Mozilla/5.0 (Lab Simulation)'}`,
    `Accept: text/html,application/xhtml+xml`,
    `Accept-Language: en-IN,en;q=0.9`,
    `Referer: https://www.google.com/`,
    `X-ICT-Student: ${entry.studentName} (@${entry.studentUsername})`,
    `X-Forwarded-For: 10.42.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)} (simulated)`,
    '',
  ]
  if (entry.method === 'POST' && entry.details) {
    lines.push(entry.details)
  }
  return lines.join('\n')
}
