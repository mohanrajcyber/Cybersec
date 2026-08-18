import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase'

const LOGS_COL = 'burp_logs'
const CHALLENGE_COL = 'challenge_progress'

export function isCloudSyncEnabled() {
  return isFirebaseConfigured()
}

export async function pushBurpLogToCloud(entry) {
  const db = getFirestoreDb()
  if (!db || !entry?.id) return { ok: false }

  try {
    await setDoc(doc(db, LOGS_COL, entry.id), {
      ...entry,
      syncedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.warn('[Burp cloud sync]', err)
    return { ok: false, error: err.message }
  }
}

export async function pushChallengeProgressToCloud(username, row) {
  const db = getFirestoreDb()
  if (!db || !username) return { ok: false }

  try {
    await setDoc(doc(db, CHALLENGE_COL, username), {
      ...row,
      username,
      syncedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.warn('[Challenge cloud sync]', err)
    return { ok: false, error: err.message }
  }
}

export function subscribeBurpLogs(callback, max = 400) {
  const db = getFirestoreDb()
  if (!db) {
    callback(null, 'not_configured')
    return () => {}
  }

  const q = query(
    collection(db, LOGS_COL),
    orderBy('ts', 'desc'),
    limit(max),
  )

  return onSnapshot(
    q,
    (snap) => {
      const logs = snap.docs.map((d) => d.data())
      callback(logs, null)
    },
    (err) => callback(null, err.message),
  )
}

export function subscribeChallengeProgress(callback) {
  const db = getFirestoreDb()
  if (!db) {
    callback(null, 'not_configured')
    return () => {}
  }

  return onSnapshot(
    collection(db, CHALLENGE_COL),
    (snap) => {
      const students = snap.docs.map((d) => ({ username: d.id, ...d.data() }))
      callback(students, null)
    },
    (err) => callback(null, err.message),
  )
}

export function computeBurpStatsFromLogs(logs = []) {
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
    .map(([queryText, count]) => ({ query: queryText, count }))

  const openedLab = logs.filter((l) => l.action === 'lab_open').length
  const uniqueOpeners = new Set(
    logs.filter((l) => l.action === 'lab_open').map((l) => l.studentUsername),
  ).size

  return {
    totalEvents: logs.length,
    uniqueStudents: students.size,
    openedLab,
    uniqueOpeners,
    searchCount: searches.length,
    clickCount: clicks.length,
    topQueries,
    recentLogs: [...logs].slice(0, 50),
    allSearches: searches,
  }
}

export function computeChallengeStatsFromStudents(students = []) {
  const fullyComplete = students.filter((s) => s.task1 && s.task2 && s.task3)

  return {
    totalStarted: students.filter((s) => s.task1 || s.task2 || s.task3).length,
    fullyComplete: fullyComplete.length,
    task1Done: students.filter((s) => s.task1).length,
    task2Done: students.filter((s) => s.task2).length,
    task3Done: students.filter((s) => s.task3).length,
    students: [...students].sort((a, b) => {
      const scoreA = (a.task1 ? 1 : 0) + (a.task2 ? 1 : 0) + (a.task3 ? 1 : 0)
      const scoreB = (b.task1 ? 1 : 0) + (b.task2 ? 1 : 0) + (b.task3 ? 1 : 0)
      return scoreB - scoreA
    }),
  }
}

export async function clearCloudBurpLogs() {
  const db = getFirestoreDb()
  if (!db) return { ok: false, error: 'Cloud not configured' }

  try {
    const snap = await getDocs(collection(db, LOGS_COL))
    if (snap.empty) return { ok: true, deleted: 0 }

    let deleted = 0
    let batch = writeBatch(db)
    let count = 0

    for (const docSnap of snap.docs) {
      batch.delete(docSnap.ref)
      count += 1
      deleted += 1
      if (count >= 400) {
        await batch.commit()
        batch = writeBatch(db)
        count = 0
      }
    }
    if (count > 0) await batch.commit()
    return { ok: true, deleted }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export async function deleteStudentCloudData(username) {
  const user = String(username || '').trim().toLowerCase()
  const db = getFirestoreDb()
  if (!db || !user) return { ok: true, deletedLogs: 0 }

  try {
    let batch = writeBatch(db)
    let ops = 0
    let deletedLogs = 0

    batch.delete(doc(db, CHALLENGE_COL, user))
    ops += 1

    const snap = await getDocs(collection(db, LOGS_COL))
    for (const docSnap of snap.docs) {
      if (docSnap.data().studentUsername !== user) continue
      batch.delete(docSnap.ref)
      ops += 1
      deletedLogs += 1
      if (ops >= 400) {
        await batch.commit()
        batch = writeBatch(db)
        ops = 0
      }
    }

    if (ops > 0) await batch.commit()
    return { ok: true, deletedLogs }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}
