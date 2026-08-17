import { useState, useEffect, useRef } from 'react'
import { analyzeUrl, URL_SCANNER_SAMPLES } from '../utils/urlScanner'
import { getPasswordStrength } from '../utils/passwordStrength'

export function UrlScannerView({ config, setPhase, onComplete }) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [scanned, setScanned] = useState(0)
  const [seen, setSeen] = useState(() => new Set())
  const completedRef = useRef(false)
  const need = config.minScans || 3

  const scan = (value) => {
    const v = value ?? url
    if (!v.trim()) return
    setUrl(v)
    setPhase('analyze')
    const r = analyzeUrl(v)
    setResult(r)
    setSeen((prev) => {
      if (prev.has(r.host)) return prev
      const next = new Set(prev)
      next.add(r.host)
      setScanned(next.size)
      if (next.size >= need && !completedRef.current) {
        completedRef.current = true
        onComplete()
      }
      return next
    })
  }

  const cls = result?.verdict === 'real' ? 'real' : result?.verdict === 'fake' ? 'fake' : result ? 'warn' : ''

  return (
    <>
      <div className="panel">
        <div className="panel-title">Paste any link — Real / Fake / Suspicious check</div>
        <div className="sim-input-row">
          <input
            className="field-input field-mono"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com or g00gle.com/login"
            onKeyDown={(e) => e.key === 'Enter' && scan()}
          />
          <button type="button" className="btn btn-primary" onClick={() => scan()}>Scan URL →</button>
        </div>
        <p className="field-hint">Scan {need} different URLs to complete lab ({scanned}/{need})</p>
        <div className="sim-chip-row">
          {(config.samples || URL_SCANNER_SAMPLES).map((s) => (
            <button key={s.url} type="button" className="info-example-chip" onClick={() => scan(s.url)}>
              {s.note}
            </button>
          ))}
        </div>
      </div>
      {result && (
        <div className={`panel info-ip-verdict ${cls}`}>
          <div className="info-ip-verdict-head">
            <strong className="info-ip-address">{result.host}</strong>
            <span className={`info-ip-badge ${cls}`}>{result.label}</span>
          </div>
          <ul className="info-highlights-list">
            {result.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <div className="info-security-list" style={{ marginTop: '0.75rem' }}>
            {result.checks.map((c) => (
              <div key={c.label} className={`info-security-item ${c.ok ? 'ok' : 'warn'}`}>
                <strong>{c.label}</strong>
                <span>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function FootprintView({ config, setPhase, onComplete }) {
  const [username, setUsername] = useState('')
  const [results, setResults] = useState(null)

  const search = () => {
    if (!username.trim()) return
    setPhase('analyze')
    const h = hashStr(username.toLowerCase())
    const platforms = [
      { name: 'Instagram', icon: '📸', found: h % 3 !== 0, data: `Profile @${username} — ${h % 5 === 0 ? 'Public photos, bio email visible' : 'Private account, profile pic visible'}` },
      { name: 'Google Search', icon: '🔍', found: true, data: `${(h % 40) + 3} results — college events, social posts, forum comments` },
      { name: 'Email Pattern', icon: '📧', found: h % 2 === 0, data: h % 2 === 0 ? `${username}@gmail.com likely exists (simulated breach list match)` : 'No direct email match' },
      { name: 'Phone / UPI ID', icon: '📱', found: h % 4 === 0, data: h % 4 === 0 ? `UPI ID ${username}@paytm found in paste site (SIMULATED)` : 'Not found in simulated databases' },
      { name: 'LinkedIn', icon: '💼', found: h % 3 === 1, data: h % 3 === 1 ? `Name, college, city visible on public profile` : 'No public profile' },
      { name: 'Have I Been Pwned', icon: '🔓', found: h % 5 < 2, data: h % 5 < 2 ? 'Email appeared in 1 simulated breach (2023 app leak)' : 'No breach records in simulation' },
    ]
    setResults(platforms)
    onComplete()
  }

  return (
    <>
      <div className="panel">
        <div className="panel-title">OSINT Digital Footprint — enter a username</div>
        <div className="sim-input-row">
          <input className="field-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. priya_2005" onKeyDown={(e) => e.key === 'Enter' && search()} />
          <button type="button" className="btn btn-primary" onClick={search}>Search Footprint →</button>
        </div>
        <p className="field-hint">Simulated OSINT — shows what attackers can find from public info. Never stalk real people.</p>
      </div>
      {results && (
        <div className="panel">
          <div className="panel-title">Results for @{username}</div>
          <div className="footprint-grid">
            {results.map((r) => (
              <div key={r.name} className={`footprint-card ${r.found ? 'found' : 'clear'}`}>
                <span className="footprint-icon">{r.icon}</span>
                <strong>{r.name}</strong>
                <span className={`footprint-status ${r.found ? 'warn' : 'ok'}`}>{r.found ? '⚠ Exposed' : '✓ Clear'}</span>
                <p>{r.data}</p>
              </div>
            ))}
          </div>
          <div className="feedback warn" style={{ marginTop: '1rem' }}>
            {config.tip || 'Tip: Use unique usernames, enable privacy settings, never reuse passwords across sites.'}
          </div>
        </div>
      )}
    </>
  )
}

const CRACK_TABLE = [
  { maxScore: 0, time: 'Instantly', bars: 4, color: 'fake' },
  { maxScore: 1, time: '2 seconds', bars: 3, color: 'fake' },
  { maxScore: 2, time: '3 hours', bars: 2, color: 'warn' },
  { maxScore: 3, time: '400 years', bars: 1, color: 'real' },
  { maxScore: 4, time: 'Centuries+', bars: 0, color: 'real' },
]

export function BreachView({ config, setPhase, onComplete }) {
  const [password, setPassword] = useState('')
  const [animating, setAnimating] = useState(false)
  const [result, setResult] = useState(null)
  const [tested, setTested] = useState(0)
  const completedRef = useRef(false)
  const timerRef = useRef(null)

  const run = (pw) => {
    const val = pw ?? password
    if (!val) return
    setPassword(val)
    setAnimating(true)
    setPhase('analyze')
    setResult(null)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const strength = getPasswordStrength(val)
      const crack = CRACK_TABLE.find((r) => strength.score <= r.maxScore) || CRACK_TABLE[0]
      setResult({ strength, crack, password: val })
      setAnimating(false)
      setTested((n) => n + 1)
      if (!completedRef.current && (strength.score >= 3 || val === '123456' || val === 'password123')) {
        completedRef.current = true
        onComplete()
      }
    }, 1800)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <>
      <div className="panel">
        <div className="panel-title">Password Breach Simulator — crack time</div>
        <div className="sim-input-row">
          <input
            className="field-input field-mono"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Try: 123456 then Tr@in#2026!Lab"
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <button type="button" className="btn btn-primary" onClick={() => run()} disabled={animating}>
            {animating ? 'Cracking…' : 'Simulate Attack →'}
          </button>
        </div>
        <div className="sim-chip-row">
          {['123456', 'password123', 'auxilium2026', 'Tr@in#2026!Lab'].map((p) => (
            <button key={p} type="button" className="info-example-chip" onClick={() => run(p)}>{p}</button>
          ))}
        </div>
      </div>
      {animating && (
        <div className="panel breach-anim">
          <div className="breach-anim-bar" />
          <p>⚡ Brute-force / dictionary attack running…</p>
        </div>
      )}
      {result && !animating && (
        <div className={`panel info-ip-verdict ${result.crack.color}`}>
          <div className="info-ip-verdict-head">
            <code>{result.password.replace(/./g, (c, i) => i > 2 && i < result.password.length - 1 ? '•' : c)}</code>
            <span className={`info-ip-badge ${result.crack.color}`}>
              {result.crack.color === 'fake' ? '❌ CRACKED FAST' : result.crack.color === 'warn' ? '⚠ WEAK' : '✅ STRONG'}
            </span>
          </div>
          <p className="breach-time">Estimated crack time: <strong>{result.crack.time}</strong></p>
          <p className="field-hint">Strength: {result.strength.text} — {result.strength.feedback?.warning || 'Good password hygiene'}</p>
        </div>
      )}
    </>
  )
}

export function ScamView({ config, setPhase, onComplete }) {
  const scenarios = config.scenarios || []
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scenario = scenarios[idx]

  const pick = (option) => {
    if (selected) return
    setSelected(option.id)
    setPhase('analyze')
    if (option.correct) setScore((s) => s + 1)
    setTimeout(() => {
      const newScore = score + (option.correct ? 1 : 0)
      if (idx >= scenarios.length - 1) {
        setDone(true)
        if (newScore >= Math.ceil(scenarios.length * 0.6)) onComplete()
      } else {
        setIdx((i) => i + 1)
        setSelected(null)
      }
    }, 2500)
  }

  if (!scenario) return null

  return (
    <div className="panel scam-panel">
      <div className="scam-header">
        <span className="scam-type">{scenario.type}</span>
        <span className="field-hint">Scenario {idx + 1}/{scenarios.length}</span>
      </div>
      <div className="scam-message">{scenario.message}</div>
      <p className="challenge-question">{scenario.question}</p>
      <div className="challenge-options">
        {scenario.options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`challenge-option ${selected ? (o.correct ? 'correct' : selected === o.id ? 'incorrect' : '') : ''}`}
            onClick={() => pick(o)}
            disabled={!!selected}
          >
            {o.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className={`feedback ${scenario.options.find((o) => o.id === selected)?.correct ? 'success' : 'error'}`}>
          {scenario.explain}
        </div>
      )}
      {done && (
        <div className="feedback success">Completed! Score: {score}/{scenarios.length} — Stay alert on WhatsApp & UPI scams.</div>
      )}
    </div>
  )
}

export function WifiView({ config, setPhase, onComplete }) {
  const [mode, setMode] = useState('public')
  const [inspected, setInspected] = useState(false)

  const packets = mode === 'public' ? config.publicPackets : config.securePackets

  const toggle = (m) => {
    setMode(m)
    setPhase('analyze')
    setInspected(true)
    if (m === 'secure') onComplete()
  }

  return (
    <>
      <div className="panel">
        <div className="panel-title">College WiFi vs Public WiFi — packet view</div>
        <div className="wifi-toggle">
          <button type="button" className={`wifi-btn ${mode === 'public' ? 'active danger' : ''}`} onClick={() => toggle('public')}>☕ Public Café WiFi</button>
          <button type="button" className={`wifi-btn ${mode === 'secure' ? 'active safe' : ''}`} onClick={() => toggle('secure')}>🏫 College WiFi (WPA2)</button>
        </div>
        <p className="field-hint">{mode === 'public' ? '⚠ Unencrypted — attacker on same network can read traffic' : '✓ Encrypted wireless — much harder to intercept'}</p>
      </div>
      <div className="panel">
        <div className="panel-title">Simulated packet capture</div>
        <div className="table-wrap">
          <table className="scan-table">
            <thead><tr><th>Time</th><th>Protocol</th><th>Data visible to attacker</th><th>Risk</th></tr></thead>
            <tbody>
              {packets.map((p) => (
                <tr key={p.time} className={p.risk === 'HIGH' ? 'highlight-row' : ''}>
                  <td>{p.time}</td>
                  <td>{p.proto}</td>
                  <td><code>{p.data}</code></td>
                  <td><span className={`status-pill ${p.risk === 'HIGH' ? 'status-danger' : 'status-success'}`}>{p.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inspected && mode === 'public' && (
          <div className="feedback error" style={{ marginTop: '1rem' }}>{config.publicWarning}</div>
        )}
      </div>
    </>
  )
}
