import { useState, useCallback, forwardRef, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { STUDENT_SCENARIOS, SCENARIO_TAGS, getScenarioUi } from '../data/warRoomStudentScenarios'
import WarRoomStudentSim from './WarRoomStudentSim'

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) || 'ST').toUpperCase()
}

function ThreatBadge({ level }) {
  const cls = level.toLowerCase()
  return <span className={`war-student-threat ${cls}`}>{level} Risk</span>
}

function DifficultyDots({ level }) {
  return (
    <span className="war-student-diff" title={`Difficulty ${level}/3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= level ? 'on' : ''} />
      ))}
    </span>
  )
}

const WarRoomStudentTryHub = forwardRef(function WarRoomStudentTryHub(_props, ref) {
  const { studentName, isStudent } = useAuth()
  const displayName = isStudent && studentName ? studentName : 'Student'
  const initials = getInitials(displayName)
  const [activeScenario, setActiveScenario] = useState(null)
  const [completed, setCompleted] = useState([])
  const [filterTag, setFilterTag] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    try {
      const key = `war-student-done-${displayName}`
      const saved = JSON.parse(localStorage.getItem(key) || '[]')
      if (Array.isArray(saved)) setCompleted(saved)
    } catch { /* ignore */ }
  }, [displayName])

  const handleComplete = useCallback((id, success) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]))
    if (success) {
      try {
        const key = `war-student-done-${displayName}`
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        if (!existing.includes(id)) {
          localStorage.setItem(key, JSON.stringify([...existing, id]))
        }
      } catch { /* ignore */ }
    }
  }, [displayName])

  const completedCount = completed.length
  const progressPct = Math.round((completedCount / 15) * 100)
  const allDone = completedCount >= 15

  const nextScenario = useMemo(
    () => STUDENT_SCENARIOS.find((s) => !completed.includes(s.id)),
    [completed],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return STUDENT_SCENARIOS.filter((s) => {
      if (filterTag !== 'All' && s.tag !== filterTag) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q)
        || s.tag.toLowerCase().includes(q)
        || s.lesson.toLowerCase().includes(q)
      )
    })
  }, [filterTag, search])

  const openScenario = (s) => {
    setActiveScenario(s)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  return (
    <section ref={ref} id="war-student-try" className="war-student-try-section">
      <div className="war-student-try-bg" aria-hidden />
      <div className="war-student-try-scanlines" aria-hidden />

      {/* Live lab status bar */}
      <div className="war-student-lab-bar">
        <span className="war-student-lab-live"><span className="dot" /> LIVE LAB</span>
        <span className="war-student-lab-sep">|</span>
        <span>ICT Academy · Auxilium College</span>
        <span className="war-student-lab-sep">|</span>
        <span className="war-student-lab-time">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      </div>

      <div className="war-student-try-header">
        <div className="war-student-try-header-main">
          <div className="war-student-profile">
            <div className="war-student-avatar">{initials}</div>
            <div>
              <h2>🎓 STUDENT TRY — 15 Cyber Attack Simulations</h2>
              <p>
                Hi <strong>{displayName}</strong>! Scenario click panni try pannunga — correct = safe, wrong = hacked.
              </p>
            </div>
          </div>
        </div>

        <div className="war-student-try-stats-block">
          <div className="war-student-stat-ring">
            <svg viewBox="0 0 36 36" className="war-student-progress-ring">
              <path
                className="war-student-ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="war-student-ring-fill"
                strokeDasharray={`${progressPct}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="war-student-stat-inner">
              <span>{completedCount}</span>
              <small>/ 15</small>
            </div>
          </div>
          <div className="war-student-stat-labels">
            <strong>{progressPct}% Complete</strong>
            <span>{allDone ? '🏆 All scenarios tried!' : `${15 - completedCount} remaining`}</span>
          </div>
        </div>
      </div>

      <div className="war-student-progress-bar">
        <div style={{ width: `${progressPct}%` }} />
        <span>{completedCount} / 15 scenarios completed</span>
      </div>

      {allDone && (
        <div className="war-student-achievement">
          <span>🏆</span>
          <div>
            <strong>Cyber Defender Badge Unlocked!</strong>
            <p>All 15 attack simulations completed — {displayName} is lab-ready.</p>
          </div>
        </div>
      )}

      {nextScenario && !allDone && (
        <button type="button" className="war-student-next-rec" onClick={() => openScenario(nextScenario)}>
          <span className="war-student-next-pulse" />
          <span>▶ Recommended next: <strong>#{nextScenario.num} {nextScenario.title}</strong></span>
          <span className="war-student-next-arrow">Launch →</span>
        </button>
      )}

      <div className="war-student-toolbar">
        <div className="war-student-search-wrap">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            placeholder="Search scenarios…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="war-student-filters">
          {SCENARIO_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`war-student-filter-chip ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="war-student-try-grid">
        {filtered.map((s, i) => {
          const ui = getScenarioUi(s.id)
          const isDone = completed.includes(s.id)
          const isNext = nextScenario?.id === s.id
          return (
            <button
              key={s.id}
              type="button"
              className={`war-student-card ${isDone ? 'done' : ''} ${isNext ? 'recommended' : ''}`}
              style={{ '--card-accent': s.accent, animationDelay: `${i * 0.04}s` }}
              onClick={() => openScenario(s)}
            >
              <div className="war-student-card-accent-bar" />
              {isDone && <span className="war-student-card-badge">✓ Done</span>}
              {isNext && !isDone && <span className="war-student-card-next">▶ Next</span>}

              <div className="war-student-card-top">
                <span className="war-student-card-icon">{s.icon}</span>
                <span className="war-student-card-num">#{s.num}</span>
              </div>

              <strong>{s.title}</strong>

              <div className="war-student-card-meta">
                <span className="war-student-card-tag">{s.tag}</span>
                <ThreatBadge level={ui.threat} />
                <span className="war-student-device">{ui.device === 'pc' ? '💻 PC' : '📱 Mobile'}</span>
              </div>

              <div className="war-student-card-preview">
                <span className="war-student-preview-label">Attack flow</span>
                <code>{ui.preview}</code>
              </div>

              <div className="war-student-card-footer">
                <DifficultyDots level={ui.difficulty} />
                <span className="war-student-card-time">~2 min</span>
                <span className="war-student-card-cta">Launch Sim →</span>
              </div>

              <div className="war-student-card-shine" aria-hidden />
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="war-student-no-results">No scenarios match your search. Try another filter.</p>
      )}

      <div className="war-student-try-cta-bar">
        <div className="war-student-try-cta-glow" aria-hidden />
        <p>⚔️ All 15 scenarios simulation only — ICT Academy · Trainer: Mohan Raj</p>
        <button
          type="button"
          className="war-student-try-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ Back to War Room Top
        </button>
      </div>

      {activeScenario && (
        <WarRoomStudentSim
          scenario={activeScenario}
          onClose={() => setActiveScenario(null)}
          onComplete={handleComplete}
        />
      )}
    </section>
  )
})

export default WarRoomStudentTryHub
