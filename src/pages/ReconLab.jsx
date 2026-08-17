import { useState, useEffect, useRef, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'

const TARGETS = [
  {
    id: 'web',
    host: 'training-lab.local',
    label: 'Web server lab',
    ports: [
      { port: 22, service: 'SSH', explain: 'Remote login — admin access check pannalam' },
      { port: 80, service: 'HTTP', explain: 'Web page — attack surface romba perusu, first check idhu' },
      { port: 443, service: 'HTTPS', explain: 'Secure web — encrypted traffic' },
      { port: 3306, service: 'MySQL', explain: 'Database — sensitive data store' },
    ],
    firstId: 'http',
    options: [
      { id: 'ssh', label: 'Port 22 — SSH', correct: false },
      { id: 'http', label: 'Port 80 — HTTP', correct: true },
      { id: 'https', label: 'Port 443 — HTTPS', correct: false },
      { id: 'mysql', label: 'Port 3306 — MySQL', correct: false },
    ],
  },
  {
    id: 'mail',
    host: 'mail-lab.local',
    label: 'Mail server lab',
    ports: [
      { port: 25, service: 'SMTP', explain: 'Send email — mail relay attacks check' },
      { port: 110, service: 'POP3', explain: 'Download mail — older protocol' },
      { port: 143, service: 'IMAP', explain: 'Sync mail — mailbox access' },
      { port: 587, service: 'Submission', explain: 'Authenticated mail send' },
    ],
    firstId: 'smtp',
    options: [
      { id: 'smtp', label: 'Port 25 — SMTP', correct: true },
      { id: 'pop3', label: 'Port 110 — POP3', correct: false },
      { id: 'imap', label: 'Port 143 — IMAP', correct: false },
      { id: 'sub', label: 'Port 587 — Submission', correct: false },
    ],
  },
  {
    id: 'db',
    host: 'db-lab.local',
    label: 'Database lab',
    ports: [
      { port: 22, service: 'SSH', explain: 'Secure shell — server admin' },
      { port: 1433, service: 'MSSQL', explain: 'Microsoft SQL database' },
      { port: 3306, service: 'MySQL', explain: 'MySQL database — data breach risk' },
      { port: 5432, service: 'PostgreSQL', explain: 'PostgreSQL database' },
    ],
    firstId: 'mysql',
    options: [
      { id: 'ssh', label: 'Port 22 — SSH', correct: false },
      { id: 'mssql', label: 'Port 1433 — MSSQL', correct: false },
      { id: 'mysql', label: 'Port 3306 — MySQL', correct: true },
      { id: 'pg', label: 'Port 5432 — PostgreSQL', correct: false },
    ],
  },
]

const STEPS = ['Configure', 'Scan', 'Results', 'Challenge']

function buildInitialLines(host) {
  return [
    { type: 'cmd', text: `nmap -sV ${host}` },
    { type: 'info', text: '[*] Training mode — safe simulation only (real network scan illa)' },
    { type: 'hint', text: '→ Start Scan click pannunga. Terminal + animation sync-a work aagum.' },
  ]
}

export default function ReconLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [targetId, setTargetId] = useState('web')
  const [customHost, setCustomHost] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [visiblePorts, setVisiblePorts] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [animPhase, setAnimPhase] = useState('idle')
  const [activePortIndex, setActivePortIndex] = useState(-1)
  const [terminalLines, setTerminalLines] = useState([])
  const terminalRef = useRef(null)
  const scanTimers = useRef([])

  const setPhase = useCallback((p) => {
    setAnimPhase(p)
    narratePhase('recon', p)
  }, [narratePhase])

  const profile = TARGETS.find((t) => t.id === targetId) || TARGETS[0]
  const host = (customHost.trim() || profile.host).replace(/\s+/g, '-')
  const { ports, options } = profile

  const currentStep = answered ? 3 : visiblePorts >= ports.length && scanned ? 2 : scanned || scanning ? 1 : 0

  const clearTimers = useCallback(() => {
    scanTimers.current.forEach(clearTimeout)
    scanTimers.current = []
  }, [])

  const addLine = useCallback((line) => {
    setTerminalLines((prev) => [...prev, line])
  }, [])

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    scanTimers.current.push(id)
    return id
  }, [])

  useEffect(() => {
    setTerminalLines(buildInitialLines(host))
  }, [host, targetId])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  useEffect(() => () => clearTimers(), [clearTimers])

  const resetScan = () => {
    clearTimers()
    setScanning(false)
    setScanned(false)
    setVisiblePorts(0)
    setSelected(null)
    setAnswered(false)
    setAnimPhase('idle')
    setActivePortIndex(-1)
    setTerminalLines(buildInitialLines(host))
  }

  const handleTargetChange = (id) => {
    setTargetId(id)
    setCustomHost('')
    clearTimers()
    setScanning(false)
    setScanned(false)
    setVisiblePorts(0)
    setSelected(null)
    setAnswered(false)
    setAnimPhase('idle')
    setActivePortIndex(-1)
  }

  const handleScan = () => {
    clearTimers()
    setScanning(true)
    setScanned(false)
    setVisiblePorts(0)
    setSelected(null)
    setAnswered(false)
    setPhase('dns')
    setActivePortIndex(-1)
    markModuleVisited('recon')

    setTerminalLines([
      { type: 'cmd', text: `nmap -sV ${host}` },
      { type: 'info', text: 'Starting Nmap 7.94 ( https://nmap.org ) at ICT Lab' },
    ])

    schedule(() => {
      addLine({ type: 'info', text: `[*] Resolving ${host} via DNS…` })
      setPhase('dns')
    }, 400)

    schedule(() => {
      addLine({ type: 'success', text: `[+] Resolved ${host} → 192.168.10.42 (training IP)` })
      addLine({ type: 'hint', text: '→ DNS = hostname-a number address-ku maathurathu' })
      setPhase('connect')
    }, 1200)

    schedule(() => {
      addLine({ type: 'info', text: '[*] Host is up — target responding (0.0034s latency)' })
      addLine({ type: 'hint', text: '→ Server online! Ippo ports check panna start aagum' })
      setPhase('scanning')
    }, 2200)

    schedule(() => {
      addLine({ type: 'info', text: '[*] Scanning ports — SYN probe simulation…' })
      addLine({ type: 'table-head', text: 'PORT     STATE  SERVICE' })
    }, 2800)

    ports.forEach((p, i) => {
      const base = 3200 + i * 900
      schedule(() => {
        setActivePortIndex(i)
        addLine({ type: 'probe', text: `[>] Probing port ${p.port}/tcp (${p.service})…` })
      }, base)

      schedule(() => {
        addLine({
          type: 'port-open',
          text: `${String(p.port).padStart(5)}/tcp  open   ${p.service.toLowerCase()}`,
        })
        addLine({ type: 'hint', text: `→ ${p.explain}` })
        setVisiblePorts(i + 1)
      }, base + 500)
    })

    const finishAt = 3200 + ports.length * 900 + 600
    schedule(() => {
      setActivePortIndex(-1)
      setPhase('done')
      addLine({ type: 'success', text: `[+] Scan complete — ${ports.length} open ports found on ${host}` })
      addLine({ type: 'hint', text: '→ Table-la results paathu, challenge-la best service pick pannunga!' })
      setScanning(false)
      setScanned(true)
    }, finishAt)
  }

  const handleAnswer = (option) => {
    if (answered) return
    setSelected(option.id)
    setAnswered(true)
    if (option.id === profile.firstId) completeLab('recon')
  }

  return (
    <PageShell
      labId="recon"
      icon="🕵️"
      title="Recon Lab"
      description="Run a simulated port scan on pre-loaded training targets. Watch the animation + terminal together — recon epdi work aagudhu nu easy-aa puriyum."
      detailsSections={getModuleDetails('recon')}
      steps={STEPS}
      currentStep={currentStep}
    >
      <div className="lab-grid">
        <aside className="lab-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Target Setup</h3>

            <label className="field-label" htmlFor="reconTarget">Training target</label>
            <select
              id="reconTarget"
              className="field-input"
              value={targetId}
              disabled={scanning}
              onChange={(e) => handleTargetChange(e.target.value)}
            >
              {TARGETS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} — {t.host}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor="reconHost">Display hostname</label>
            <input
              id="reconHost"
              className="field-input field-mono"
              type="text"
              maxLength={64}
              disabled={scanning || scanned}
              placeholder={profile.host}
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
            />
            <p className="field-hint">
              Lab label only — internet / real network scan illa. Safe simulation.
            </p>

            {!scanned ? (
              <button
                className="btn btn-primary btn-block"
                onClick={handleScan}
                disabled={scanning}
              >
                {scanning ? '⏳ Scanning…' : '▶ Start Scan'}
              </button>
            ) : (
              <button className="btn btn-outline btn-block" type="button" onClick={resetScan}>
                ↺ Scan Again
              </button>
            )}
          </div>

          <div className="sidebar-info">
            <div className="info-row"><span>Mode</span><strong>Training</strong></div>
            <div className="info-row"><span>Tool</span><strong>Nmap Sim</strong></div>
            <div className="info-row"><span>Target</span><strong>{host}</strong></div>
            <div className="info-row"><span>Phase</span><strong>{animPhase}</strong></div>
          </div>
        </aside>

        <div className="lab-main">
          <LabVisualDemo
            labId="recon"
            phase={animPhase}
            meta={{ host, ports, activePortIndex, visibleCount: visiblePorts }}
          />

          <div className={`panel ${scanning ? 'panel--scanning' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">Terminal Output</div>
              <span className="panel-meta">
                {scanning ? '● live' : scanned ? '✓ done' : 'ready'} · nmap_sim
              </span>
            </div>
            <div className="terminal terminal-pro">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">student@ict-lab ~ recon</span>
              </div>
              <div className="terminal-body terminal-body--scroll" ref={terminalRef}>
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className={`terminal-line terminal-line--${line.type} terminal-line--appear`}
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
                  >
                    {line.type === 'cmd' ? (
                      <>
                        <span className="prompt">$</span> {line.text}
                      </>
                    ) : (
                      line.text
                    )}
                  </div>
                ))}
                {scanning && (
                  <div className="terminal-cursor-line">
                    <span className="terminal-cursor" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {scanned && visiblePorts > 0 && (
            <div className="panel animate-in">
              <div className="panel-header">
                <div className="panel-title">Scan Results</div>
                <span className="status-pill status-open">{visiblePorts} open</span>
              </div>
              <div className="table-wrap">
                <table className="scan-table">
                  <thead>
                    <tr>
                      <th>Port</th>
                      <th>Service</th>
                      <th>State</th>
                      <th>Student Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ports.slice(0, visiblePorts).map((p, i) => (
                      <tr key={p.port} className="scan-row--appear" style={{ animationDelay: `${i * 0.08}s` }}>
                        <td><code>{p.port}</code></td>
                        <td>{p.service}</td>
                        <td><span className="status-pill status-open">open</span></td>
                        <td className="scan-note">{p.explain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {visiblePorts >= ports.length && scanned && (
            <div className="challenge-box animate-in">
              <div className="challenge-header">
                <span className="challenge-icon">🎯</span>
                <div>
                  <div className="challenge-question">Which service would you investigate first?</div>
                  <p className="challenge-sub">Recon results use panni best entry point pick pannunga.</p>
                </div>
              </div>
              <div className="challenge-options">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    className={`challenge-option ${
                      answered
                        ? opt.correct ? 'correct' : selected === opt.id ? 'incorrect' : ''
                        : ''
                    }`}
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {answered && (
                <div className={`feedback ${selected === profile.firstId ? 'success' : 'error'}`}>
                  {selected === profile.firstId ? (
                    <>
                      <strong>Correct!</strong> {profile.label}-ku idhu best first check point.
                      Real scan illa — training data mattum.
                    </>
                  ) : (
                    <>
                      <strong>Try again logic:</strong> Web/ mail / DB — which service exposes
                      the most attack surface during initial recon?
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
