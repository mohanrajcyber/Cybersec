import { useState, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'
import { EMAIL_SAMPLES, EMAIL_WHY } from '../data/phishingData'

const LEVELS = ['safe', 'easy', 'medium', 'hard']
const STEPS = ['Select Email', 'Analyze', 'Verdict', 'Learn Why']

function EmailView({ sample }) {
  return (
    <div className="email-mockup">
      <div className="email-header-bar">Inbox — {sample.level} sample</div>
      <div className="email-body">
        <div className="email-subject">{sample.subject}</div>
        <div className="email-meta">
          <strong>From:</strong> {sample.from}<br />
          <strong>To:</strong> {sample.to}<br />
          <strong>Date:</strong> {sample.date}
        </div>
        <div className="email-content">
          {sample.body.map((p, i) => (
            <p key={i}>{p.includes('→') || p.includes('Click') ? <span className="email-link">{p}</span> : p}</p>
          ))}
          {sample.url && <p className="email-url">{sample.url}</p>}
          {sample.banner && <div className="email-warning-banner">{sample.banner}</div>}
        </div>
      </div>
    </div>
  )
}

export default function PhishingDetector() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [level, setLevel] = useState('easy')
  const [compareMode, setCompareMode] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [phase, setPhaseRaw] = useState('idle')

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('phishing', p)
  }, [narratePhase])

  const sample = EMAIL_SAMPLES[level]
  const safeSample = EMAIL_SAMPLES.safe
  const currentStep = showWhy ? 3 : analyzed ? 2 : scanning ? 1 : 0

  const handleAnalyze = () => {
    setScanning(true)
    markModuleVisited('phishing')
    setPhase('analyze')
    setTimeout(() => setPhase('headers'), 500)
    setTimeout(() => setPhase('urls'), 1000)
    setTimeout(() => {
      setScanning(false)
      setAnalyzed(true)
      setPhase('verdict')
      if (level !== 'safe') completeLab('phishing')
    }, 1800)
  }

  const changeLevel = (l) => {
    setLevel(l)
    setAnalyzed(false)
    setShowWhy(false)
    setScanning(false)
    setPhaseRaw('idle')
  }

  return (
    <PageShell
      labId="phishing"
      icon="🎣"
      title="Phishing Detector"
      description="Analyze training emails with live animation + voice narration. Compare safe vs phishing messages."
      detailsSections={getModuleDetails('phishing')}
      steps={STEPS}
      currentStep={currentStep}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo
            labId="phishing"
            phase={phase}
            meta={{ riskScore: sample.riskScore, verdict: sample.verdict }}
          />

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Select Sample</div>
              <label className="compare-toggle">
                <input type="checkbox" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)} />
                Compare Safe vs Phishing
              </label>
            </div>
            <div className="level-tabs">
              {LEVELS.map((l) => (
                <button key={l} type="button" className={`vuln-tab ${level === l ? 'active' : ''}`} onClick={() => changeLevel(l)}>
                  {EMAIL_SAMPLES[l].level}
                </button>
              ))}
            </div>
          </div>

          {compareMode ? (
            <div className="compare-email-grid">
              <div>
                <p className="compare-label safe-label">✅ Safe Email</p>
                <EmailView sample={safeSample} />
              </div>
              <div>
                <p className="compare-label phish-label">⚠ Phishing Sample ({sample.level})</p>
                <EmailView sample={sample} />
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-title">Email — {sample.level}</div>
              <EmailView sample={sample} />
            </div>
          )}

          {!analyzed && (
            <div className="panel-actions">
              <button type="button" className="btn btn-primary" onClick={handleAnalyze} disabled={scanning}>
                {scanning ? '⏳ Analyzing…' : '▶ Analyze Email'}
              </button>
            </div>
          )}

          {scanning && (
            <div className="panel panel--scanning">
              <div className="terminal terminal-pro">
                <div className="terminal-body">
                  <div className="terminal-line terminal-line--cmd"><span className="prompt">$</span> phish_scanner.py --email {sample.id}.eml</div>
                  <div className="terminal-line terminal-line--info">[*] Parsing headers… → Sender check</div>
                  <div className="terminal-line terminal-line--probe">[*] Checking sender reputation…</div>
                  <div className="terminal-line terminal-line--probe">[*] Analyzing URLs & urgency words…</div>
                  <div className="terminal-line terminal-line--hint">→ Fake domain, suspicious links thedura step</div>
                </div>
              </div>
            </div>
          )}

          {analyzed && (
            <>
              <div className="panel animate-in">
                <div className="panel-header">
                  <div className="panel-title">Threat Analysis</div>
                  <span className={`status-pill ${sample.verdict === 'safe' ? 'status-open' : 'status-danger'}`}>
                    {sample.verdict === 'safe' ? 'Low Risk' : 'High Risk'}
                  </span>
                </div>
                {sample.threats.length > 0 ? (
                  <ul className="threat-list">
                    {sample.threats.map((t) => (
                      <li key={t.label} className="threat-item">
                        <span className="threat-icon">⚠</span>
                        <div><div className="threat-label">{t.label}</div><div className="threat-detail">{t.detail}</div></div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="field-hint">No phishing indicators. Official domain, no urgency, no suspicious links.</p>
                )}
                <div className="risk-meter">
                  <div className="risk-bar-bg">
                    <div className={`risk-bar-fill ${sample.verdict === 'safe' ? '' : 'high'}`} style={{ width: `${sample.riskScore}%`, background: sample.verdict === 'safe' ? 'var(--green)' : undefined }} />
                  </div>
                  <div className="risk-score"><span>Risk Score</span><strong className={sample.verdict === 'safe' ? 'text-success' : 'text-danger'}>{sample.riskScore} / 100</strong></div>
                </div>
                <div className={`verdict ${sample.verdict}`}>{sample.verdictText}</div>
              </div>
              {sample.threats.length > 0 && (
                <>
                  <div className="panel-actions">
                    <button type="button" className="btn btn-outline" onClick={() => { setShowWhy(!showWhy); if (!showWhy) setPhase('done') }}>
                      {showWhy ? 'Hide Explanation' : 'Why? — Explain Each Indicator'}
                    </button>
                  </div>
                  {showWhy && (
                    <div className="panel animate-in">
                      {sample.threats.map((t) => (
                        <div key={t.label} className="why-item">
                          <h4>{t.label}</h4>
                          <p>{EMAIL_WHY[t.label] || t.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  )
}
