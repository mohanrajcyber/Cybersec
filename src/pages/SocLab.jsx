import { useState, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'

const LOGS = [
  { type: 'info', text: '[*] Parsing 12,847 log entries...' },
  { type: 'alert', text: '[!] ANOMALY: 47 failed SSH login attempts from 203.0.113.55' },
  { type: 'alert', text: '[!] ANOMALY: Privilege escalation — sudo su root by user "guest"' },
  { type: 'alert', text: '[!] ANOMALY: Data exfiltration — 2.3GB outbound to unknown IP' },
  { type: 'success', text: '[*] Incident ticket: INC-2026-0814-001 | Severity: HIGH' },
]

export default function SocLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [phase, setPhaseRaw] = useState('idle')
  const [running, setRunning] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(0)
  const [reviewed, setReviewed] = useState(false)

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('soc', p)
  }, [narratePhase])

  const runSiem = () => {
    setRunning(true)
    setVisibleLogs(0)
    markModuleVisited('soc')
    setPhase('ingest')
    setTimeout(() => setPhase('parse'), 800)
    LOGS.forEach((_, i) => {
      setTimeout(() => setVisibleLogs(i + 1), 1200 + i * 700)
    })
    setTimeout(() => setPhase('alert'), 1200 + LOGS.length * 700)
  }

  const handleReview = () => {
    setReviewed(true)
    setPhase('done')
    completeLab('soc')
  }

  return (
    <PageShell
      labId="soc"
      icon="📊"
      title="SOC / Log Analysis"
      description="Run SIEM simulation with animated log flow + voice narration. Detect anomalies like a SOC analyst."
      detailsSections={getModuleDetails('soc')}
      steps={['Ingest', 'Parse', 'Alert', 'Respond']}
      currentStep={reviewed ? 3 : phase === 'alert' || phase === 'done' ? 2 : running ? 1 : 0}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo labId="soc" phase={phase} />

          {!running && (
            <div className="panel-actions">
              <button type="button" className="btn btn-primary" onClick={runSiem}>▶ Run SIEM Analysis</button>
            </div>
          )}

          <div className={`panel ${running ? 'panel--scanning' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">SIEM Alert Output</div>
              <span className="status-pill status-danger">{visibleLogs >= 4 ? '3 Anomalies' : running ? 'Running…' : 'Ready'}</span>
            </div>
            <div className="terminal terminal-pro">
              <div className="terminal-body">
                <div className="terminal-line terminal-line--cmd"><span className="prompt">$</span> siem_analyzer --logs auth.log --timerange 1h</div>
                {LOGS.slice(0, visibleLogs).map((l, i) => (
                  <div key={i} className={`terminal-line terminal-line--${l.type === 'alert' ? 'probe' : l.type === 'success' ? 'success' : 'info'} terminal-line--appear`}>
                    {l.text}
                  </div>
                ))}
                {running && visibleLogs < LOGS.length && <div className="terminal-cursor-line"><span className="terminal-cursor" /></div>}
              </div>
            </div>
            {phase === 'alert' && !reviewed && (
              <div className="panel-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="button" className="btn btn-primary" onClick={handleReview}>Mark as Reviewed & Respond</button>
              </div>
            )}
          </div>

          {(phase === 'alert' || reviewed) && (
            <div className="panel animate-in">
              <div className="panel-title">Key Insights</div>
              {[
                { h: 'Brute Force', p: '47 failed SSH attempts in 1 hour — automated credential stuffing.' },
                { h: 'Privilege Escalation', p: 'Guest account attempting sudo su — critical compromise indicator.' },
                { h: 'Recommended Response', p: 'Block IP · Isolate host · Rotate credentials · Escalate to IR team.' },
              ].map((i) => (
                <div key={i.h} className="why-item"><h4>{i.h}</h4><p>{i.p}</p></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
