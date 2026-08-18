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

function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i += 1) h = ((h << 5) - h) + id.charCodeAt(i)
  return Math.abs(h)
}

function responseMeta(action, query = '', host = 'www.google.com') {
  if (action === 'search') {
    const len = 38000 + (query.length * 890)
    return { status: 200, length: len, mime: 'HTML', title: `${query} - Google Search` }
  }
  if (action === 'lab_open') return { status: 200, length: 85975, mime: 'HTML', title: 'Google' }
  if (host.includes('mail.google.com')) return { status: 302, length: 0, mime: 'HTML', title: 'Redirect — Gmail' }
  if (action === 'click' && host !== 'www.google.com') return { status: 200, length: 12400, mime: 'HTML', title: host }
  return { status: 200, length: 4200 + (hashId(action) % 8000), mime: 'HTML', title: 'Google' }
}

export function getEntryPath(entry) {
  if (entry.action === 'search' && entry.query) {
    return `/search?q=${encodeURIComponent(entry.query)}`
  }
  if (entry.host && entry.host !== 'www.google.com') {
    return `${entry.host}${entry.url || '/'}`
  }
  return entry.url || '/'
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
  const meta = responseMeta(action, query, host)
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
    status: meta.status,
    length: meta.length,
    mime: meta.mime,
    pageTitle: meta.title,
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

export function removeBurpLog(id) {
  const logs = loadLogs().filter((l) => l.id !== id)
  saveLogs(logs)
  window.dispatchEvent(new CustomEvent('burp-log-update'))
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
    `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    `Accept-Language: en-IN,en;q=0.9`,
    `Accept-Encoding: gzip, deflate, br`,
    `Connection: keep-alive`,
    `Referer: https://www.google.com/`,
    `Cookie: NID=511=${hashId(entry.id)}; 1P_JAR=2026-08-18-08`,
    `X-ICT-Student: ${entry.studentName} (@${entry.studentUsername})`,
    `X-Forwarded-For: 10.42.${Math.floor(hashId(entry.id) % 200)}.${Math.floor(hashId(entry.id + 'x') % 200)} (simulated)`,
    '',
  ]
  if (entry.method === 'POST' && entry.details) {
    lines.push(entry.details)
  }
  return lines.join('\n')
}

export function buildHttpResponse(entry) {
  const status = entry.status || 200
  const statusText = status === 302 ? 'Found' : status === 304 ? 'Not Modified' : 'OK'
  const len = entry.length || 0
  const host = entry.host || 'www.google.com'
  const title = entry.pageTitle || entry.target || host

  const bodySnippet = entry.action === 'search' && entry.query
    ? `<!doctype html><html><head><title>${entry.query} - Google Search</title></head><body>Results for "${entry.query}"...</body></html>`
    : entry.action === 'lab_open'
      ? '<!doctype html><html><head><title>Google</title></head><body><!-- Google homepage --></body></html>'
      : `<!doctype html><html><head><title>${title}</title></head><body>HTTP response from ${host}</body></html>`

  const lines = [
    `HTTP/1.1 ${status} ${statusText}`,
    `Date: ${new Date(entry.ts || Date.now()).toUTCString()}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Length: ${len || bodySnippet.length}`,
    `Cache-Control: private, max-age=0`,
    `Set-Cookie: AEC=AVh_${hashId(entry.id)}; expires=Thu, 18-Feb-2027 08:00:00 GMT; path=/; domain=.google.com; Secure; HttpOnly`,
    `X-Frame-Options: SAMEORIGIN`,
    `X-XSS-Protection: 0`,
    `Server: gws`,
    `Alt-Svc: h3=":443"; ma=2592000`,
    '',
    bodySnippet.slice(0, 280) + (bodySnippet.length > 280 ? '…' : ''),
  ]

  if (status === 302) {
    lines.splice(4, 0, `Location: https://${host}/`)
  }

  return lines.join('\n')
}

export function parseRequestParams(entry) {
  const params = []
  if (entry.query) {
    params.push({ name: 'q', value: entry.query })
    params.push({ name: 'hl', value: 'en-IN' })
    params.push({ name: 'source', value: 'hp' })
    if (entry.details?.includes('btnI=1')) params.push({ name: 'btnI', value: '1' })
    else params.push({ name: 'btnK', value: 'Google Search' })
  }
  if (entry.details && entry.details.includes('=')) {
    entry.details.split('&').forEach((pair) => {
      const [name, value] = pair.split('=')
      if (name && !params.some((p) => p.name === name)) {
        params.push({ name, value: decodeURIComponent(value || '') })
      }
    })
  }
  return params
}

export function parseRequestHeaders(entry) {
  return buildHttpRaw(entry)
    .split('\n')
    .filter((line) => line.includes(':') && !line.startsWith('GET') && !line.startsWith('POST'))
    .map((line) => {
      const i = line.indexOf(':')
      return { name: line.slice(0, i).trim(), value: line.slice(i + 1).trim() }
    })
}

/** Backfill older log entries missing status/length */
export function enrichLogEntry(entry) {
  if (entry.status && entry.length) return entry
  const meta = responseMeta(entry.action, entry.query, entry.host)
  return { ...entry, ...meta }
}
