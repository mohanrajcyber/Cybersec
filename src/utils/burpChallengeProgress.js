import { safeGetItem, safeSetItem } from './storage'
import { logBurpEvent } from './burpSuiteLog'

export const BURP_CHALLENGE_KEY = 'cybersec-burp-challenge'

function loadAll() {
  try {
    const raw = safeGetItem(BURP_CHALLENGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveAll(data) {
  safeSetItem(BURP_CHALLENGE_KEY, JSON.stringify(data))
}

export function getChallengeProgress(username) {
  const all = loadAll()
  const row = all[username] || {}
  return {
    task1: Boolean(row.task1),
    task2: Boolean(row.task2),
    task3: Boolean(row.task3),
    completedAt: row.completedAt || null,
  }
}

export function isChallengeComplete(username) {
  const p = getChallengeProgress(username)
  return p.task1 && p.task2 && p.task3
}

export function markTaskComplete(username, studentName, taskId) {
  const all = loadAll()
  const row = all[username] || { studentName, task1: false, task2: false, task3: false }
  row[taskId] = true
  row.studentName = studentName || row.studentName
  row.updatedAt = new Date().toISOString()

  if (row.task1 && row.task2 && row.task3 && !row.completedAt) {
    row.completedAt = new Date().toISOString()
  }

  all[username] = row
  saveAll(all)

  logBurpEvent({
    studentUsername: username,
    studentName: studentName || row.studentName || 'Student',
    action: 'challenge_submit',
    method: 'GET',
    url: `/challenge/${taskId}`,
    target: `Challenge ${taskId} completed`,
    host: 'www.google.com',
    details: `Burp Challenge Mode — ${taskId} submitted successfully`,
  })

  window.dispatchEvent(new CustomEvent('burp-challenge-update', { detail: { username, taskId } }))
  return row
}

export function getChallengeStats() {
  const all = loadAll()
  const entries = Object.entries(all).map(([username, row]) => ({
    username,
    studentName: row.studentName || username,
    task1: Boolean(row.task1),
    task2: Boolean(row.task2),
    task3: Boolean(row.task3),
    completedAt: row.completedAt || null,
    updatedAt: row.updatedAt || null,
  }))

  const fullyComplete = entries.filter((e) => e.task1 && e.task2 && e.task3)

  return {
    totalStarted: entries.filter((e) => e.task1 || e.task2 || e.task3).length,
    fullyComplete: fullyComplete.length,
    task1Done: entries.filter((e) => e.task1).length,
    task2Done: entries.filter((e) => e.task2).length,
    task3Done: entries.filter((e) => e.task3).length,
    students: entries.sort((a, b) => {
      const scoreA = (a.task1 ? 1 : 0) + (a.task2 ? 1 : 0) + (a.task3 ? 1 : 0)
      const scoreB = (b.task1 ? 1 : 0) + (b.task2 ? 1 : 0) + (b.task3 ? 1 : 0)
      return scoreB - scoreA
    }),
  }
}
