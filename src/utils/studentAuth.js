import { safeGetItem, safeSetItem } from './storage'

const AUTH_KEY = 'cybersec-student-auth'

export function displayNameFromUsername(name) {
  const first = name.trim().split(/\s+/)[0]
  if (!first) return name
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export function normalizeUsername(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '_')
}

export function loadStudentAuth() {
  try {
    const raw = safeGetItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAuth(auth) {
  return safeSetItem(AUTH_KEY, JSON.stringify(auth))
}

export function getAllStudentAccounts() {
  return Object.entries(loadStudentAuth()).map(([username, data]) => ({
    username,
    password: data.password,
    displayName: data.displayName,
  }))
}

export function getStudentAccount(username) {
  const user = normalizeUsername(username)
  const data = loadStudentAuth()[user]
  if (!data) return null
  return { username: user, password: data.password, displayName: data.displayName }
}

/** Trainer creates / updates student login */
export function saveStudentAccount(username, password, displayName) {
  const user = normalizeUsername(username)
  const pass = password.trim()

  if (!user || !/^[a-z0-9_]{2,32}$/.test(user)) {
    return { ok: false, error: 'Username: 2–32 chars, letters, numbers, underscore only.' }
  }
  if (!pass || pass.length < 4) {
    return { ok: false, error: 'Password must be at least 4 characters.' }
  }

  const auth = loadStudentAuth()
  auth[user] = {
    password: pass,
    displayName: displayName?.trim() || displayNameFromUsername(username),
  }
  const saved = saveAuth(auth)
  if (!saved.ok) return saved
  return { ok: true, username: user, displayName: auth[user].displayName }
}

/** Bulk import: one student per line — username,password,name */
export function bulkSaveStudentAccounts(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (!lines.length) {
    return { ok: false, error: 'Paste at least one line: username,password,name' }
  }

  const auth = loadStudentAuth()
  let added = 0
  let updated = 0
  const errors = []

  lines.forEach((line, index) => {
    const parts = line.split(/[,;\t]/).map((p) => p.trim())
    const [username, password, displayName] = parts
    if (!username || !password) {
      errors.push(`Line ${index + 1}: need username and password`)
      return
    }

    const user = normalizeUsername(username)
    const pass = password.trim()
    if (!/^[a-z0-9_]{2,32}$/.test(user)) {
      errors.push(`Line ${index + 1}: invalid username "${username}"`)
      return
    }
    if (pass.length < 4) {
      errors.push(`Line ${index + 1}: password too short for @${user}`)
      return
    }

    const exists = Boolean(auth[user])
    auth[user] = {
      password: pass,
      displayName: displayName?.trim() || displayNameFromUsername(username),
    }
    if (exists) updated += 1
    else added += 1
  })

  if (added + updated === 0) {
    return { ok: false, error: errors[0] || 'No valid rows found.' }
  }

  const saved = saveAuth(auth)
  if (!saved.ok) return saved

  return {
    ok: true,
    added,
    updated,
    total: added + updated,
    errors: errors.slice(0, 5),
  }
}

export function validateStudentCredentials(username, password) {
  const user = normalizeUsername(username)
  const pass = password.trim()

  if (!user) {
    return { ok: false, error: 'Username is required.' }
  }

  if (!/^[a-z0-9_]{2,32}$/.test(user)) {
    return {
      ok: false,
      error: 'Username: 2–32 characters, letters, numbers, underscore only.',
    }
  }

  if (!pass || pass.length < 4) {
    return { ok: false, error: 'Password must be at least 4 characters.' }
  }

  const auth = loadStudentAuth()
  const displayName = displayNameFromUsername(username)

  if (!auth[user]) {
    auth[user] = { password: pass, displayName }
    const saved = saveAuth(auth)
    if (!saved.ok) return saved
    return { ok: true, studentId: user, displayName, username: user, isNew: true }
  }

  if (auth[user].password !== pass) {
    return { ok: false, error: 'Incorrect password. Try again or ask your trainer.' }
  }

  return { ok: true, studentId: user, displayName: auth[user].displayName || displayName, username: user }
}
