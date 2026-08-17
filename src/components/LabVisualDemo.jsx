import { getLabPhaseInfo, LAB_VIZ_CONFIG } from '../data/labVizConfig'

function progressWidth(labId, phase, meta = {}) {
  const maps = {
    recon: { dns: 15, connect: 30, scanning: 30 + ((meta.visibleCount || 0) / Math.max(meta.ports?.length || 1, 1)) * 65, done: 100 },
    phishing: { analyze: 20, headers: 45, urls: 70, verdict: 90, done: 100 },
    network: { capture: 25, analyze: 55, suspicious: 85, done: 100 },
    password: { typing: 25, analyze: 55, strong: 100, weak: 70 },
    owasp: { select: 30, attack: 65, prevent: 100 },
    soc: { ingest: 20, parse: 50, alert: 80, done: 100 },
    ir: { scenario: 25, order: 60, verify: 85, done: 100 },
    ctf: { challenge: 30, hint: 55, flag: 80, done: 100 },
  }
  return maps[labId]?.[phase] ?? (phase === 'idle' ? 0 : 40)
}

function ScanStage({ phase, meta }) {
  const { host = 'target.local', ports = [], activePortIndex = -1, visibleCount = 0 } = meta
  const scanning = phase === 'scanning' || phase === 'done'
  const connected = ['connect', 'scanning', 'done'].includes(phase)

  return (
    <>
      <div className="recon-viz-stage">
        <div className="recon-node recon-node--student">
          <div className="recon-node-icon">💻</div>
          <div className="recon-node-label">Your PC</div>
          <div className="recon-node-sub">student@ict-lab</div>
        </div>
        <div className="recon-path">
          {phase === 'dns' && <div className="recon-packet recon-packet--dns animate-packet-dns"><span>DNS?</span></div>}
          {connected && (
            <>
              <div className="recon-link recon-link--live" />
              {scanning && activePortIndex >= 0 && (
                <div className="recon-packet recon-packet--syn animate-packet-scan">
                  <span>SYN → :{ports[activePortIndex]?.port}</span>
                </div>
              )}
              {phase === 'connect' && <div className="recon-packet recon-packet--ping animate-packet-ping"><span>PING</span></div>}
            </>
          )}
        </div>
        <div className={`recon-node recon-node--target ${connected ? 'recon-node--online' : ''}`}>
          <div className="recon-node-icon">🖥️</div>
          <div className="recon-node-label">{host}</div>
          <div className="recon-node-sub">{connected ? '● Online' : '○ Waiting…'}</div>
        </div>
      </div>
      {ports.length > 0 && (
        <div className="recon-ports-row">
          {ports.map((p, i) => (
            <div key={p.port} className={`recon-port-chip ${visibleCount > i ? 'open' : ''} ${scanning && activePortIndex === i ? 'probing' : ''}`}>
              <span className="recon-port-num">{p.port}</span>
              <span className="recon-port-svc">{p.service}</span>
              {visibleCount > i && <span className="recon-port-state">OPEN</span>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function EmailStage({ phase, meta }) {
  const { riskScore = 0, verdict = 'unknown' } = meta
  const active = phase !== 'idle'
  return (
    <div className="viz-email-stage">
      <div className={`viz-node ${active ? 'active' : ''}`}>
        <span>📥</span><strong>Inbox</strong><small>Email received</small>
      </div>
      <div className="viz-flow-arrow">{phase === 'analyze' && <span className="viz-flow-packet">📄</span>}</div>
      <div className={`viz-node ${['headers', 'urls', 'verdict', 'done'].includes(phase) ? 'active' : ''}`}>
        <span>🔍</span><strong>Scanner</strong><small>Headers & links</small>
      </div>
      <div className="viz-flow-arrow">{['urls', 'verdict', 'done'].includes(phase) && <span className="viz-flow-packet warn">⚠</span>}</div>
      <div className={`viz-node ${['verdict', 'done'].includes(phase) ? (verdict === 'safe' ? 'safe' : 'danger') : ''}`}>
        <span>{verdict === 'safe' ? '✅' : '🚨'}</span>
        <strong>Verdict</strong>
        <small>{['verdict', 'done'].includes(phase) ? `Risk ${riskScore}%` : 'Waiting…'}</small>
      </div>
    </div>
  )
}

function PacketStage({ phase, meta }) {
  const { highlightId } = meta
  return (
    <div className="viz-packet-stage">
      <div className={`viz-node ${phase !== 'idle' ? 'active' : ''}`}>
        <span>📡</span><strong>Capture</strong><small>847 packets</small>
      </div>
      <div className="viz-flow-arrow">{['capture', 'analyze', 'suspicious', 'done'].includes(phase) && <span className="viz-flow-packet">📦</span>}</div>
      <div className={`viz-node ${['analyze', 'suspicious', 'done'].includes(phase) ? 'active' : ''}`}>
        <span>🦈</span><strong>Wireshark Sim</strong><small>Inspect traffic</small>
      </div>
      <div className="viz-flow-arrow">{['suspicious', 'done'].includes(phase) && <span className="viz-flow-packet warn">!</span>}</div>
      <div className={`viz-node ${['suspicious', 'done'].includes(phase) ? 'danger' : ''}`}>
        <span>🚨</span><strong>Alert</strong>
        <small>{highlightId ? `Packet #${highlightId}` : 'Find suspicious'}</small>
      </div>
    </div>
  )
}

function PasswordStage({ phase, meta }) {
  const { strength = 0, label = '—' } = meta
  return (
    <div className="viz-password-stage">
      <div className={`viz-node ${['typing', 'analyze', 'strong', 'weak'].includes(phase) ? 'active' : ''}`}>
        <span>⌨️</span><strong>Type</strong><small>Enter password</small>
      </div>
      <div className="viz-flow-arrow">{phase !== 'idle' && <span className="viz-flow-packet">🔤</span>}</div>
      <div className={`viz-node ${['analyze', 'strong', 'weak'].includes(phase) ? 'active' : ''}`}>
        <span>🧮</span><strong>Analyze</strong><small>zxcvbn engine</small>
      </div>
      <div className="viz-flow-arrow">{['strong', 'weak'].includes(phase) && <span className="viz-flow-packet">{phase === 'strong' ? '✓' : '!'}</span>}</div>
      <div className={`viz-meter ${phase === 'strong' ? 'strong' : phase === 'weak' ? 'weak' : ''}`}>
        <div className="viz-meter-bars">
          {[0, 1, 2, 3].map((i) => <div key={i} className={`viz-meter-bar ${i <= strength ? 'on' : ''}`} />)}
        </div>
        <strong>{label}</strong>
      </div>
    </div>
  )
}

function WebStage({ phase, meta }) {
  const { vulnName = 'Vulnerability' } = meta
  return (
    <div className="viz-web-stage">
      <div className={`viz-node ${phase !== 'idle' ? 'active' : ''}`}>
        <span>🌐</span><strong>Browser</strong><small>User input</small>
      </div>
      <div className="viz-flow-arrow">{['attack', 'prevent'].includes(phase) && <span className="viz-flow-packet warn">💉</span>}</div>
      <div className={`viz-node ${['select', 'attack', 'prevent'].includes(phase) ? 'danger' : ''}`}>
        <span>🖥️</span><strong>Web Server</strong><small>{vulnName}</small>
      </div>
      <div className="viz-flow-arrow">{phase === 'prevent' && <span className="viz-flow-packet">🛡️</span>}</div>
      <div className={`viz-node ${phase === 'prevent' ? 'safe' : ''}`}>
        <span>🔒</span><strong>Fix</strong><small>Secure coding</small>
      </div>
    </div>
  )
}

function SocStage({ phase }) {
  return (
    <div className="viz-soc-stage">
      <div className={`viz-node ${phase !== 'idle' ? 'active' : ''}`}>
        <span>📋</span><strong>Logs</strong><small>auth.log</small>
      </div>
      <div className="viz-flow-arrow">{['ingest', 'parse', 'alert', 'done'].includes(phase) && <span className="viz-flow-packet">📊</span>}</div>
      <div className={`viz-node ${['parse', 'alert', 'done'].includes(phase) ? 'active' : ''}`}>
        <span>🔎</span><strong>SIEM</strong><small>Parse & correlate</small>
      </div>
      <div className="viz-flow-arrow">{['alert', 'done'].includes(phase) && <span className="viz-flow-packet warn">!</span>}</div>
      <div className={`viz-node ${['alert', 'done'].includes(phase) ? 'danger' : ''}`}>
        <span>🚨</span><strong>3 Alerts</strong><small>High severity</small>
      </div>
    </div>
  )
}

function IrStage({ phase, meta }) {
  const steps = meta.irSteps || ['Detect', 'Contain', 'Eradicate', 'Recover']
  return (
    <div className="viz-ir-stage">
      {steps.map((s, i) => (
        <div key={s} className={`viz-ir-step ${['order', 'verify', 'done'].includes(phase) && i <= (meta.orderProgress ?? 3) ? 'done' : phase === 'scenario' && i === 0 ? 'active' : ''}`}>
          <span>{i + 1}</span>
          <strong>{s}</strong>
        </div>
      ))}
    </div>
  )
}

function CtfStage({ phase, meta }) {
  const { solved = 0, total = 3 } = meta
  return (
    <div className="viz-ctf-stage">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`viz-ctf-flag ${i < solved ? 'captured' : phase === 'challenge' && i === solved ? 'active' : ''}`}>
          <span>{i < solved ? '🚩' : '🏁'}</span>
          <small>Flag {i + 1}</small>
        </div>
      ))}
    </div>
  )
}

const STAGE_RENDER = {
  scan: ScanStage,
  email: EmailStage,
  packets: PacketStage,
  password: PasswordStage,
  web: WebStage,
  soc: SocStage,
  ir: IrStage,
  ctf: CtfStage,
}

export default function LabVisualDemo({ labId, phase = 'idle', meta = {} }) {
  const cfg = LAB_VIZ_CONFIG[labId]
  const info = getLabPhaseInfo(labId, phase)
  const stage = cfg?.stage || 'password'
  const Stage = STAGE_RENDER[stage] || STAGE_RENDER.password
  const pct = progressWidth(labId, phase, meta)

  return (
    <div className="recon-viz lab-viz">
      <div className="recon-viz-header">
        <span className="recon-viz-badge">🎬 Live Visual Demo</span>
        <span className={`recon-viz-phase ${phase !== 'idle' ? 'active' : ''}`}>{info.title}</span>
      </div>

      {Stage && <Stage phase={phase} meta={meta} />}

      <div className="recon-viz-caption">
        <p className="recon-caption-main">{info.caption}</p>
        <p className="recon-caption-tamil">🇮🇳 {info.tamil}</p>
      </div>

      {phase !== 'idle' && (
        <div className="recon-progress-track">
          <div className="recon-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}
