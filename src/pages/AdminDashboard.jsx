import { useMemo, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { modules } from '../data/modules'
import { BADGES } from '../data/badges'
import { getAllStudentAccounts, saveStudentAccount, bulkSaveStudentAccounts, deleteStudentAccount } from '../utils/studentAuth'
import { getPasswordStrength } from '../utils/passwordStrength'
import { getLabCompletionStats, exportProgressJson, deleteStudentProgress } from '../utils/classProgress'
import { getBurpStats, clearBurpLogs, deleteBurpLogsForStudent } from '../utils/burpSuiteLog'
import { getChallengeStats, deleteChallengeProgressForStudent } from '../utils/burpChallengeProgress'
import {
  isCloudSyncEnabled,
  subscribeBurpLogs,
  subscribeChallengeProgress,
  computeBurpStatsFromLogs,
  computeChallengeStatsFromStudents,
  clearCloudBurpLogs,
  deleteStudentCloudData,
} from '../utils/burpCloudSync'
import { generateReportCard } from '../utils/reportCard'
import { buildStudentLoginUrl, generateQrDataUrl } from '../utils/qrLogin'
import { ICT_SESSION } from '../data/sessionPlan'
import PasswordStrengthBox from '../components/PasswordStrengthBox'
import StudentTableControls, { applyStudentFilters } from '../components/StudentTableControls'

function mergeStudentRows(accounts, students) {
  const progressMap = new Map(students.map((s) => [s.username, s]))
  const accountUsernames = new Set(accounts.map((a) => a.username))
  const merged = accounts.map((acc) => {
    const progress = progressMap.get(acc.username) || {}
    return {
      ...acc,
      ...progress,
      username: acc.username,
      strength: getPasswordStrength(acc.password),
    }
  })

  students.forEach((s) => {
    if (!accountUsernames.has(s.username)) {
      merged.push({
        ...s,
        password: '—',
        displayName: s.name,
        strength: getPasswordStrength('—'),
      })
    }
  })

  return merged.sort((a, b) =>
    (a.displayName || a.name || a.username).localeCompare(b.displayName || b.name || b.username, undefined, { sensitivity: 'base' })
  )
}

function StrengthCell({ strength }) {
  if (!strength || strength.cls === 'none') return <span className="pw-strength-empty">—</span>
  return (
    <span className={`pw-strength-inline pw-strength-inline--${strength.cls}`}>
      <span className="pw-strength-bars">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pw-strength-bar ${i < strength.bars ? `on s${strength.score}` : ''}`} />
        ))}
      </span>
      <span className={`pw-strength-label strength-${strength.cls}`}>{strength.text}</span>
    </span>
  )
}

function QrModal({ student, onClose }) {
  const [qrUrl, setQrUrl] = useState('')
  const loginUrl = student?.password && student.password !== '—'
    ? buildStudentLoginUrl(student.username, student.password)
    : ''

  useEffect(() => {
    if (!loginUrl) return
    generateQrDataUrl(loginUrl).then(setQrUrl)
  }, [loginUrl])

  if (!student) return null

  return (
    <div className="admin-qr-overlay" onClick={onClose} role="presentation">
      <div className="admin-qr-modal panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-title">📱 QR Login — @{student.username}</div>
        <p className="field-hint">{student.displayName || student.name || student.username}</p>
        {qrUrl ? (
          <>
            <img src={qrUrl} alt={`QR login for ${student.username}`} className="admin-qr-img" />
            <p className="field-hint">Student scans with phone camera → auto login</p>
            <code className="admin-qr-url">{loginUrl}</code>
          </>
        ) : (
          <p className="feedback error">No password on file — cannot generate QR</p>
        )}
        <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { getAllStudents, trainer, logout } = useAuth()
  const [form, setForm] = useState({ username: '', password: '', displayName: '' })
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [strengthFilter, setStrengthFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refresh, setRefresh] = useState(0)
  const [labStats, setLabStats] = useState(() => getLabCompletionStats())
  const [burpStats, setBurpStats] = useState(() => getBurpStats())
  const [challengeStats, setChallengeStats] = useState(() => getChallengeStats())
  const [qrStudent, setQrStudent] = useState(null)
  const [cloudLive, setCloudLive] = useState(isCloudSyncEnabled())
  const [cloudError, setCloudError] = useState('')
  const cloudEnabled = isCloudSyncEnabled()

  const students = useMemo(() => getAllStudents(), [refresh])
  const accounts = useMemo(() => getAllStudentAccounts(), [refresh])

  const refreshAll = useCallback(() => {
    setRefresh((n) => n + 1)
    setLabStats(getLabCompletionStats())
    if (!cloudEnabled) {
      setBurpStats(getBurpStats())
      setChallengeStats(getChallengeStats())
    }
  }, [cloudEnabled])

  useEffect(() => {
    if (!cloudEnabled) {
      const id = setInterval(() => {
        setLabStats(getLabCompletionStats())
        setBurpStats(getBurpStats())
        setChallengeStats(getChallengeStats())
      }, 4000)
      return () => clearInterval(id)
    }

    setCloudLive(true)
    setCloudError('')

    const unsubLogs = subscribeBurpLogs((logs, error) => {
      if (error) {
        setCloudError(error === 'not_configured' ? '' : String(error))
        setBurpStats(getBurpStats())
        return
      }
      setBurpStats(computeBurpStatsFromLogs(logs))
    })

    const unsubChallenge = subscribeChallengeProgress((rows, error) => {
      if (error) {
        if (error !== 'not_configured') setCloudError(String(error))
        setChallengeStats(getChallengeStats())
        return
      }
      setChallengeStats(computeChallengeStatsFromStudents(rows))
    })

    const labId = setInterval(() => setLabStats(getLabCompletionStats()), 4000)

    return () => {
      unsubLogs()
      unsubChallenge()
      clearInterval(labId)
    }
  }, [cloudEnabled])

  const merged = useMemo(() => mergeStudentRows(accounts, students), [accounts, students])

  const filtered = useMemo(
    () => applyStudentFilters(merged, { search, sortBy, strengthFilter, statusFilter }),
    [merged, search, sortBy, strengthFilter, statusFilter]
  )

  const bootcampComplete = useMemo(
    () =>
      students.filter((s) => {
        const all = Object.values(s.bootcamp || {}).flatMap((d) => Object.values(d))
        return all.length && all.every(Boolean)
      }).length,
    [students]
  )

  const handleAdd = (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    const res = saveStudentAccount(form.username, form.password, form.displayName)
    if (!res.ok) {
      setErr(res.error)
      return
    }
    setMsg(`Student @${res.username} saved successfully!`)
    setForm({ username: '', password: '', displayName: '' })
    refreshAll()
  }

  const handleBulk = (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    const res = bulkSaveStudentAccounts(bulkText)
    if (!res.ok) {
      setErr(res.error)
      return
    }
    let text = `Imported ${res.total} student${res.total === 1 ? '' : 's'} (${res.added} new, ${res.updated} updated).`
    if (res.errors?.length) text += ` ${res.errors.length} line(s) skipped.`
    setMsg(text)
    setBulkText('')
    setShowBulk(false)
    refreshAll()
  }

  const handleSearch = (value) => {
    setSearch(value)
  }

  const handleDeleteStudent = async (student) => {
    const label = student.displayName || student.name || student.username
    const confirmed = window.confirm(
      `Remove @${student.username} (${label})?\n\nThis deletes login, progress, and Burp activity for this student.`,
    )
    if (!confirmed) return

    setErr('')
    setMsg('')

    deleteStudentAccount(student.username)
    deleteStudentProgress(student.username)
    deleteBurpLogsForStudent(student.username)
    deleteChallengeProgressForStudent(student.username)

    if (cloudEnabled) {
      const cloudRes = await deleteStudentCloudData(student.username)
      if (!cloudRes.ok) {
        setErr(`Student removed locally, but cloud cleanup failed: ${cloudRes.error}`)
        refreshAll()
        return
      }
    }

    setMsg(`Removed @${student.username} — login, progress, and logs deleted.`)
    refreshAll()
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Trainer Dashboard</h1>
          <p>Welcome, {trainer.name} — {ICT_SESSION.program} · Batch {ICT_SESSION.batchId}</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={logout}>Logout</button>
      </div>

      <div className="panel admin-create-panel">
        <div className="panel-title">➕ Create Student Login</div>
        <p className="field-hint">
          Single student or bulk import — unlimited students, all shown in list.
        </p>
        <form className="admin-create-form" onSubmit={handleAdd}>
          <div className="admin-form-field">
            <label>Username</label>
            <input
              className="field-input"
              placeholder="e.g. arun"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="admin-form-field admin-form-field--password">
            <label>Password</label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. 1234 or cyber2026"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {form.password && (
              <div className="admin-pw-preview">
                <PasswordStrengthBox password={form.password} />
              </div>
            )}
          </div>
          <div className="admin-form-field">
            <label>Display Name (optional)</label>
            <input
              className="field-input"
              placeholder="e.g. Arun Kumar"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Student Login</button>
        </form>

        <div className="admin-bulk-section">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowBulk((v) => !v)}
          >
            {showBulk ? 'Hide bulk import' : 'Bulk import (1000+ students)'}
          </button>
          {showBulk && (
            <form className="admin-bulk-form" onSubmit={handleBulk}>
              <label className="field-hint">
                One student per line: <code>username,password,name</code>
              </label>
              <textarea
                className="field-input admin-bulk-textarea"
                rows={8}
                placeholder={'student001,pass1234,Student One\nstudent002,pass1234,Student Two\nstudent003,pass1234,Student Three'}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Import all lines</button>
            </form>
          )}
        </div>

        {msg && <div className="feedback success" style={{ marginTop: '1rem' }}>{msg}</div>}
        {err && <div className="feedback error" style={{ marginTop: '1rem' }}>{err}</div>}
        <p className="login-hint" style={{ marginTop: '1rem' }}>
          Student login: <code>/login</code>
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon">👥</span><div><div className="stat-value">{accounts.length}</div><div className="stat-label">Student Logins</div></div></div>
        <div className="stat-card"><span className="stat-icon">📚</span><div><div className="stat-value">{modules.length - 1}</div><div className="stat-label">Training Modules</div></div></div>
        <div className="stat-card"><span className="stat-icon">🏅</span><div><div className="stat-value">{BADGES.length}</div><div className="stat-label">Badge Types</div></div></div>
        <div className="stat-card"><span className="stat-icon">🎓</span><div><div className="stat-value">{bootcampComplete}</div><div className="stat-label">Bootcamp Complete</div></div></div>
      </div>

      <div className="panel admin-live-panel">
        <div className="panel-header-row">
          <div className="panel-title">📊 Live Lab Progress</div>
          <div className="admin-live-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={refreshAll}>↻ Refresh</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => generateReportCard(merged)}>📄 Report Card PDF</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={exportProgressJson}>⬇ Export JSON</button>
          </div>
        </div>
        <p className="field-hint">Auto-updates every 4 seconds — who completed each lab in this browser</p>
        <div className="admin-lab-stats-grid">
          {labStats.map((lab) => (
            <div key={lab.id} className="admin-lab-stat-card">
              <strong>{lab.label}</strong>
              <span className="admin-lab-stat-count">{lab.completed}/{lab.total}</span>
              <div className="vm-progress-bar"><div style={{ width: `${lab.pct}%` }} /></div>
              <span className="field-hint">{lab.pct}% complete</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel admin-burp-panel">
        <div className="panel-header-row">
          <div className="panel-title">🔶 Burp Suite — Student Activity Log</div>
          <div className="admin-live-actions">
            {cloudEnabled && cloudLive && (
              <span className="admin-cloud-live">☁️ Live — all student devices</span>
            )}
            <button type="button" className="btn btn-outline btn-sm" onClick={refreshAll}>↻ Refresh</button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={async () => {
                clearBurpLogs()
                if (cloudEnabled) await clearCloudBurpLogs()
                refreshAll()
              }}
            >
              Clear logs
            </button>
          </div>
        </div>
        {!cloudEnabled && (
          <div className="admin-cloud-setup">
            <strong>⚠️ Cloud sync not configured — trainer sees only this browser&apos;s logs</strong>
            <ol className="admin-cloud-steps">
              <li>Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">Firebase Console</a> → Create project (free)</li>
              <li>Build → Firestore Database → Create → Start in <strong>test mode</strong></li>
              <li>Project settings → Your apps → Web (&lt;/&gt;) → copy config values</li>
              <li>GitHub repo → Settings → Secrets → Actions → add each <code>VITE_FIREBASE_*</code> key from <code>.env.example</code></li>
              <li>Firestore → Rules → paste rules from <code>firebase/firestore.rules</code> in this repo → Publish</li>
              <li>Push to main or re-run Deploy workflow — Admin will show <strong>☁️ Live — all student devices</strong></li>
            </ol>
          </div>
        )}
        {cloudError && (
          <p className="feedback error admin-cloud-error">Cloud sync error: {cloudError}</p>
        )}
        <p className="field-hint">
          {cloudEnabled
            ? 'Real-time log from every student phone/laptop — searches, clicks, challenge submits.'
            : 'Local browser only until Firebase is configured (see above).'}
        </p>
        <div className="stats-row admin-burp-stats">
          <div className="stat-card"><span className="stat-icon">👥</span><div><div className="stat-value">{burpStats.uniqueStudents}</div><div className="stat-label">Students (events)</div></div></div>
          <div className="stat-card"><span className="stat-icon">🌐</span><div><div className="stat-value">{burpStats.uniqueOpeners}</div><div className="stat-label">Opened Lab</div></div></div>
          <div className="stat-card"><span className="stat-icon">🔍</span><div><div className="stat-value">{burpStats.searchCount}</div><div className="stat-label">Searches</div></div></div>
          <div className="stat-card"><span className="stat-icon">📡</span><div><div className="stat-value">{burpStats.totalEvents}</div><div className="stat-label">Total Requests</div></div></div>
          <div className="stat-card"><span className="stat-icon">🏁</span><div><div className="stat-value">{challengeStats.fullyComplete}</div><div className="stat-label">Challenge Done (3/3)</div></div></div>
        </div>
        {challengeStats.students.length > 0 && (
          <div className="admin-burp-top-queries">
            <strong>Challenge progress:</strong>
            <div className="admin-burp-query-chips">
              {challengeStats.students.slice(0, 12).map((s) => (
                <span key={s.username} className="admin-burp-chip">
                  {s.studentName}{' '}
                  <small>
                    ({[s.task1, s.task2, s.task3].filter(Boolean).length}/3
                    {s.completedAt ? ' ✓' : ''})
                  </small>
                </span>
              ))}
            </div>
          </div>
        )}
        {burpStats.topQueries.length > 0 && (
          <div className="admin-burp-top-queries">
            <strong>Top search queries:</strong>
            <div className="admin-burp-query-chips">
              {burpStats.topQueries.map((q) => (
                <span key={q.query} className="admin-burp-chip">{q.query} <small>({q.count})</small></span>
              ))}
            </div>
          </div>
        )}
        <div className="table-wrap admin-table-scroll admin-burp-log-table">
          <table className="scan-table admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Student</th>
                <th>Action</th>
                <th>Query / Target</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {burpStats.recentLogs.length === 0 ? (
                <tr><td colSpan={5} className="field-hint">No Burp lab activity yet — ask students to open Burp Suite from sidebar</td></tr>
              ) : (
                burpStats.recentLogs.map((l) => (
                  <tr key={l.id}>
                    <td><code>{l.time}</code></td>
                    <td>{l.studentName} <code>@{l.studentUsername}</code></td>
                    <td><span className={`burp-action-tag ${l.action}`}>{l.action}</span></td>
                    <td>{l.query || l.target || '—'}</td>
                    <td><code>{l.url}</code></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {qrStudent && <QrModal student={qrStudent} onClose={() => setQrStudent(null)} />}

      <div className="panel">
        <div className="panel-title">All Students — Username & Password</div>
        {merged.length === 0 ? (
          <p className="field-hint">No students yet — use the form above to create logins.</p>
        ) : (
          <>
            <StudentTableControls
              total={merged.length}
              filtered={filtered.length}
              search={search}
              onSearch={handleSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              strengthFilter={strengthFilter}
              onStrengthFilterChange={setStrengthFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
            <div className="table-wrap admin-table-scroll">
              <table className="scan-table admin-table admin-student-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Strength</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Labs</th>
                    <th>Badges</th>
                    <th>Last Login</th>
                    <th>QR</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.username} className="admin-student-row">
                      <td className="admin-row-num">{i + 1}</td>
                      <td><code>@{s.username}</code></td>
                      <td>
                        {s.password && s.password !== '—'
                          ? <code className="pw-cell">{s.password}</code>
                          : <span className="pw-strength-empty">—</span>}
                      </td>
                      <td><StrengthCell strength={s.strength} /></td>
                      <td>{s.displayName || s.name || '—'}</td>
                      <td><strong>{s.score ?? 0}%</strong></td>
                      <td>{s.completedLabs?.length || 0}</td>
                      <td>{s.badges?.length || 0}</td>
                      <td>{s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-IN') : 'Not yet'}</td>
                      <td>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setQrStudent(s)} title="Show QR login">QR</button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm admin-delete-btn"
                          onClick={() => handleDeleteStudent(s)}
                          title={`Remove @${s.username}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (search || strengthFilter !== 'all' || statusFilter !== 'all') && (
              <p className="field-hint" style={{ marginTop: '1rem' }}>No students match the current search or filters.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
