import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import ModuleCard from '../components/ModuleCard'
import { modules, MODULE_CATEGORIES, CLASS_PATH } from '../data/modules'
import { ICT_SESSION } from '../data/sessionPlan'
import { useAuth } from '../context/AuthContext'
import { CertificateButton } from './Leaderboard'

export default function Dashboard() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const [category, setCategory] = useState('all')
  const { getOverallProgress, visitedModules, completedLabs, getScore, getBadges, studentName } = useAuth()
  const progress = getOverallProgress()
  const score = getScore()
  const earnedBadges = getBadges()

  const filtered = useMemo(() => {
    let list = [...modules].sort((a, b) => a.order - b.order)
    if (category !== 'all') list = list.filter((m) => m.category === category)
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.learn?.toLowerCase().includes(q) ||
          m.keywords?.includes(q) ||
          m.id.includes(q)
      )
    }
    return list
  }, [q, category])

  const completedCount = completedLabs.length
  const nextLab = modules.find((m) => m.id !== 'progress' && !completedLabs.includes(m.id))

  const stats = [
    { label: 'Total Labs', value: modules.length - 1, icon: '📚' },
    { label: 'Completed', value: completedCount, icon: '✅' },
    { label: 'Your Score', value: `${score}%`, icon: '🎯' },
    { label: 'Badges', value: earnedBadges.length, icon: '🏅' },
  ]

  return (
    <>
      <section className="dashboard-hero">
        <div className="dashboard-hero-text">
          <p className="dashboard-eyebrow">ICT Academy · IBM Adult Learner 2026-27 · Batch {ICT_SESSION.batchId}</p>
          <h1 className="dashboard-title">Welcome, {studentName?.split(' ')[0] || 'Student'}!</h1>
          <p className="dashboard-desc">
            <strong>{ICT_SESSION.venue}</strong> — follow the official 3-day ICT session plan.
            Hands-on labs mapped to each sub-topic. Trainer: <strong>Mohan Raj</strong>
          </p>
          <div className="dashboard-actions">
            <button type="button" className="btn btn-primary" onClick={() => navigate('/bootcamp')}>
              🎓 ICT Session Plan (19–21 Aug)
            </button>
            {nextLab && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(nextLab.path)}>
                ▶ Continue: {nextLab.name}
              </button>
            )}
            <CertificateButton />
            <button type="button" className="btn btn-outline" onClick={() => navigate('/cheatsheet')}>
              📟 Command Cheat Sheet
            </button>
          </div>
        </div>
        <div className="dashboard-hero-card">
          <div className="hero-card-label">Your Score</div>
          <div className="hero-card-value">{score}%</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${score}%` }} />
          </div>
          <p className="hero-card-note">{completedCount} labs done · Bootcamp {progress}%</p>
        </div>
      </section>

      <div className="class-path-banner">
        <div className="class-path-title">
          <span>📋</span>
          <div>
            <strong>ICT Session Learning Path</strong>
            <p>Official plan order — Day 1 → Day 2 → Day 3 hands-on labs</p>
          </div>
        </div>
        <div className="class-path-steps">
          {CLASS_PATH.map((s) => {
            const done = completedLabs.includes(modules.find((m) => m.path === s.path)?.id)
            return (
              <button
                key={s.step}
                type="button"
                className={`class-step ${done ? 'done' : ''}`}
                onClick={() => navigate(s.path)}
                title={s.label}
              >
                <span className="class-step-num">{done ? '✓' : s.step}</span>
                <span className="class-step-icon">{s.icon}</span>
                <span className="class-step-label">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      {earnedBadges.length > 0 && (
        <div className="badges-section">
          <h2 className="section-heading">Your Badges</h2>
          <div className="badges-row">
            {earnedBadges.map((b) => (
              <div key={b.id} className="badge-chip earned"><span>{b.icon}</span> {b.name}</div>
            ))}
          </div>
        </div>
      )}

      <div className="modules-section">
        <div className="section-header modules-section-header">
          <div>
            <h2 className="section-heading">{q ? `Search: "${q}"` : 'Training Modules'}</h2>
            <p className="section-sub">
              {filtered.length} lab{filtered.length !== 1 ? 's' : ''} · Click <strong>Start Lab</strong> to begin
            </p>
          </div>
          <div className="status-legend">
            <span><i className="dot dot-new" /> New</span>
            <span><i className="dot dot-progress" /> Started</span>
            <span><i className="dot dot-done" /> Done</span>
          </div>
        </div>

        <div className="category-tabs">
          {MODULE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-tab ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="module-grid">
          {filtered.map((mod) => <ModuleCard key={mod.id} module={mod} />)}
        </div>
        {filtered.length === 0 && (
          <p className="field-hint">No modules found. Try another category or search "phishing", "nmap".</p>
        )}
      </div>
    </>
  )
}
