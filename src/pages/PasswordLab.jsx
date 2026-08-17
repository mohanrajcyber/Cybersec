import { useState, useMemo, useEffect, useRef } from 'react'
import zxcvbn from 'zxcvbn'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'

function entropyBits(result) {
  if (!result) return 0
  if (typeof result.guesses === 'number' && result.guesses > 0) {
    return Math.log2(result.guesses)
  }
  if (typeof result.guesses_log10 === 'number') {
    return result.guesses_log10 / Math.log10(2)
  }
  return 0
}

function crackLabel(score) {
  const labels = ['Instant', 'Minutes', 'Hours', 'Days', 'Centuries+']
  return labels[score] ?? 'Unknown'
}

function strengthLabel(score) {
  if (score <= 1) return { text: 'Weak', cls: 'weak' }
  if (score === 2) return { text: 'Fair', cls: 'fair' }
  if (score === 3) return { text: 'Strong', cls: 'strong' }
  return { text: 'Very Strong', cls: 'very-strong' }
}

function nextPhase(val) {
  if (!val) return 'idle'
  const score = zxcvbn(val).score
  if (val.length >= 12 && score >= 3) return 'strong'
  if (val.length >= 4 && score <= 1) return 'weak'
  if (val.length >= 1) return val.length >= 4 ? 'analyze' : 'typing'
  return 'idle'
}

export default function PasswordLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [password, setPassword] = useState('')
  const [phase, setPhase] = useState('idle')
  const visitedRef = useRef(false)
  const completedRef = useRef(false)

  const result = useMemo(() => {
    if (!password) return null
    try {
      return zxcvbn(password)
    } catch {
      return null
    }
  }, [password])
  const label = result ? strengthLabel(result.score) : null

  useEffect(() => {
    if (phase === 'idle' && !password) return
    narratePhase('password', phase)
  }, [phase, password, narratePhase])

  const handleChange = (val) => {
    setPassword(val)
    setPhase(nextPhase(val))

    if (!val) return

    if (!visitedRef.current) {
      visitedRef.current = true
      queueMicrotask(() => markModuleVisited('password'))
    }

    if (val.length >= 12 && zxcvbn(val).score >= 3 && !completedRef.current) {
      completedRef.current = true
      queueMicrotask(() => completeLab('password'))
    }
  }

  return (
    <PageShell
      labId="password"
      icon="🔐"
      title="Password Security"
      description="Type a password — watch live animation + narration explain strength, hashing & MFA."
      detailsSections={getModuleDetails('password')}
      steps={['Type', 'Analyze', 'Secure']}
      currentStep={phase === 'strong' ? 2 : password ? 1 : 0}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo
            labId="password"
            phase={phase}
            meta={{ strength: result?.score ?? 0, label: label?.text ?? '—' }}
          />

          <div className="panel">
            <div className="panel-title">Live Password Strength Meter</div>
            <label className="field-label">Enter a password to analyze</label>
            <input
              className="field-input field-mono"
              type="text"
              value={password}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Type a password..."
            />

            {result && label && (
              <>
                <div className={`strength-badge strength-${label.cls}`}>{label.text}</div>
                <div className="strength-bars">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`strength-bar ${i <= result.score ? `active s${result.score}` : ''}`} />
                  ))}
                </div>
                <div className="strength-meta">
                  <span>Entropy: <strong>{entropyBits(result).toFixed(1)} bits</strong></span>
                  <span>Crack time: <strong>{crackLabel(result.score)}</strong></span>
                </div>
                {result.feedback?.warning && (
                  <p className="strength-warning">⚠ {result.feedback.warning}</p>
                )}
                {(result.feedback?.suggestions?.length ?? 0) > 0 && (
                  <ul className="strength-suggestions">
                    {result.feedback.suggestions.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                )}
              </>
            )}
          </div>

          <div className="panel">
            <div className="panel-title">Compare Examples</div>
            <div className="compare-grid">
              {[
                { pw: 'P@ssw0rd123', note: 'Common pattern — dictionary word + substitutions' },
                { pw: 'Tr0ub4dor&3', note: 'Famous xkcd example — shorter complex password' },
                { pw: 'correct-horse-battery-staple', note: 'Passphrase — much stronger' },
              ].map((ex) => {
                const r = zxcvbn(ex.pw)
                const l = strengthLabel(r.score)
                return (
                  <div key={ex.pw} className="compare-item">
                    <code>{ex.pw}</code>
                    <span className={`strength-badge sm strength-${l.cls}`}>{l.text}</span>
                    <p>{ex.note}</p>
                    <span className="compare-crack">Crack: {crackLabel(r.score)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
