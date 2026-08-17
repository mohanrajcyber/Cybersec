import { useState, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { vulnerabilities } from '../data/owaspData'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'

export default function OwaspLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [activeVuln, setActiveVuln] = useState(vulnerabilities[0])
  const [phase, setPhaseRaw] = useState('idle')

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('owasp', p)
  }, [narratePhase])

  const handleSelect = (vuln) => {
    setActiveVuln(vuln)
    markModuleVisited('owasp')
    completeLab('owasp')
    setPhase('select')
    setTimeout(() => setPhase('attack'), 600)
    setTimeout(() => setPhase('prevent'), 1400)
  }

  return (
    <PageShell
      labId="owasp"
      icon="🛡️"
      title="Web Security / OWASP Lab"
      description="Explore SQLi, XSS & Broken Auth with animated attack flow + voice narration."
      detailsSections={getModuleDetails('owasp')}
      steps={['Select', 'Attack Demo', 'Prevent']}
      currentStep={phase === 'prevent' ? 2 : phase === 'attack' || phase === 'select' ? 1 : 0}
    >
      <div className="lab-grid owasp-grid">
        <div className="login-sim">
          <h3>SecureBank Login</h3>
          <div className="login-field">
            <label>Username</label>
            <input type="text" placeholder="Enter username" readOnly />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input type="password" placeholder="Enter password" readOnly />
          </div>
          <button className="login-btn-sim" disabled>Sign In</button>
          <p className="login-note">Simulated login page for training purposes</p>
        </div>

        <div className="lab-main">
          <LabVisualDemo labId="owasp" phase={phase} meta={{ vulnName: activeVuln.name }} />

          <div className="panel animate-in">
            <div className="panel-header">
              <div className="panel-title">Select Vulnerability</div>
            </div>
            <div className="vuln-tabs">
              {vulnerabilities.map((v) => (
                <button
                  key={v.id}
                  className={`vuln-tab ${activeVuln.id === v.id ? 'active' : ''}`}
                  onClick={() => handleSelect(v)}
                >
                  {v.name}
                </button>
              ))}
            </div>

            <div className="terminal terminal-pro">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">vuln_education — {activeVuln.id}</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-line terminal-line--info highlight">[*] Loading: {activeVuln.name}</div>
                <div className="terminal-line terminal-line--cmd">{activeVuln.example}</div>
                {phase === 'attack' && <div className="terminal-line terminal-line--probe">[!] Attack payload simulated — training only</div>}
                {phase === 'prevent' && <div className="terminal-line terminal-line--hint">→ Fix: {activeVuln.prevent.slice(0, 80)}…</div>}
              </div>
            </div>

            <div className="edu-grid">
              <div className="edu-card concept">
                <h4>Attack Concept</h4>
                <p>{activeVuln.concept}</p>
              </div>
              <div className="edu-card why">
                <h4>Why It Happens</h4>
                <p>{activeVuln.why}</p>
              </div>
              <div className="edu-card prevent">
                <h4>How to Prevent</h4>
                <p>{activeVuln.prevent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
