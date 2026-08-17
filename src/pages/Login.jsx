import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TRAINER } from '../data/trainer'
import MatrixRain from '../components/MatrixRain'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginStudent, loginTrainer, session } = useAuth()
  const [tab, setTab] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [studentForm, setStudentForm] = useState({ username: '', password: '' })
  const [trainerForm, setTrainerForm] = useState({ username: '', password: '' })
  const [qrNotice, setQrNotice] = useState(false)
  const qrAttempted = useRef(false)

  useEffect(() => {
    if (session?.type === 'student') navigate('/')
    if (session?.type === 'trainer') navigate('/admin')
  }, [session, navigate])

  useEffect(() => {
    if (qrAttempted.current || session) return
    const u = searchParams.get('u')
    const p = searchParams.get('p')
    if (!u || !p) return
    qrAttempted.current = true
    setStudentForm({ username: u, password: p })
    setQrNotice(searchParams.get('qr') === '1')
    setTab('student')
    const res = loginStudent(u, p)
    if (res.ok) navigate('/')
    else setError(res.error || 'QR login failed — enter credentials manually.')
  }, [searchParams, session, loginStudent, navigate])

  const handleStudent = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const res = loginStudent(studentForm.username.trim(), studentForm.password)
      if (res.ok) navigate('/')
      else setError(res.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrainer = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const res = loginTrainer(trainerForm.username.trim(), trainerForm.password)
      if (res.ok) navigate('/admin')
      else setError(res.error || 'Invalid trainer credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <MatrixRain className="login-matrix" opacity={0.45} />
      <div className="login-card">
        <div className="login-brand">
          <div className="logo-icon lg">CS</div>
          <h1>CyberSec Arena</h1>
          <p>ICT Academy · Learn · Explore · Defend</p>
        </div>

        <div className="login-tabs">
          <button type="button" className={tab === 'student' ? 'active' : ''} onClick={() => { setTab('student'); setError('') }}>
            Student Login
          </button>
          <button type="button" className={tab === 'trainer' ? 'active' : ''} onClick={() => { setTab('trainer'); setError('') }}>
            Trainer Login
          </button>
        </div>

        {qrNotice && !error && (
          <div className="feedback success login-qr-notice">📱 QR login detected — signing you in…</div>
        )}

        {error && <div className="login-error">{error}</div>}

        {tab === 'student' ? (
          <form onSubmit={handleStudent} className="login-form">
            <label>Username</label>
            <input
              value={studentForm.username}
              onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
              placeholder="e.g. arun, priya_01"
              autoComplete="username"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={studentForm.password}
              onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              placeholder="Choose your password (min 4 chars)"
              autoComplete="current-password"
              required
            />
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in…' : 'Enter Lab →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTrainer} className="login-form">
            <label>Username</label>
            <input
              value={trainerForm.username}
              onChange={(e) => setTrainerForm({ ...trainerForm, username: e.target.value })}
              placeholder="Trainer username"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={trainerForm.password}
              onChange={(e) => setTrainerForm({ ...trainerForm, password: e.target.value })}
              placeholder="Password"
              required
            />
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in…' : 'Trainer Dashboard →'}
            </button>
            <p className="login-hint">Authorized trainers only · {TRAINER.name}</p>
          </form>
        )}

        <div className="login-trainer-info">
          <p><strong>{TRAINER.name}</strong></p>
          <p>{TRAINER.title}</p>
          <p>{TRAINER.email} · {TRAINER.phone} ({TRAINER.phoneNote})</p>
        </div>
      </div>
    </div>
  )
}
