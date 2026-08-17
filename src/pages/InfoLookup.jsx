import { useState } from 'react'
import { Link } from 'react-router-dom'
import { runLookup } from '../utils/infoLookup'

const TABS = [
  { id: 'college', label: 'College', icon: '🏫', hint: 'e.g. Anna University, SRM Institute, VIT' },
  { id: 'product', label: 'Product', icon: '📦', hint: 'e.g. VMware, Kali Linux, iPhone, Windows 11' },
  { id: 'website', label: 'Website', icon: '🌐', hint: 'e.g. google.com, iict.ac.in, github.com' },
  { id: 'ip', label: 'IP Check', icon: '🔢', hint: 'e.g. 93.127.173.35 — Real or Fake?' },
]

const EXAMPLES = {
  college: ['Auxilium Arts and Science College for Women', 'Auxilium College Pudukkottai', 'Anna University'],
  product: ['VMware', 'Kali Linux', 'Wireshark'],
  website: ['auxiliumcollege.ac.in', 'google.com', 'ictacademy.in'],
  ip: ['93.127.173.35', '91.108.106.33', '8.8.8.8'],
}

function ProgramSection({ title, icon, items }) {
  if (!items?.length) return null
  return (
    <div className="info-program-section">
      <h3>{icon} {title}</h3>
      <ul className="info-program-list">
        {items.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </div>
  )
}

function IpVerdictBanner({ check }) {
  const v = check.verdict
  const cls = v.ok ? 'real' : v.code === 'fake-local' ? 'fake' : 'warn'
  return (
    <div className={`info-ip-verdict ${cls}`}>
      <div className="info-ip-verdict-head">
        <strong className="info-ip-address">{check.ip}</strong>
        <span className={`info-ip-badge ${cls}`}>{v.label}</span>
      </div>
      <p className="info-ip-verdict-detail">{v.detail}</p>
      <div className="info-ip-meta">
        <span>Browser: {check.browsable ? `✅ Opens (${check.browseProtocol})` : '❌ Cannot open directly'}</span>
        {check.ptr && <span>PTR: {check.ptr}</span>}
        {check.linkedDomain && <span>Domain: {check.linkedDomain}</span>}
      </div>
    </div>
  )
}

export default function InfoLookup() {
  const [tab, setTab] = useState('college')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async (e, overrideQuery) => {
    e?.preventDefault()
    const q = (overrideQuery ?? query).trim()
    if (!q) return
    setQuery(q)
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await runLookup(tab, q)
      if (!res.ok) setError(res.error)
      else setResult(res)
    } catch {
      setError('Lookup failed — check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div className="info-page">
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link><span className="breadcrumb-sep">/</span><span>Info Lookup</span>
      </nav>

      <div className="info-hero">
        <div className="info-hero-badge">🔍 Real Public Data</div>
        <h1 className="page-heading">Info Lookup</h1>
        <p className="page-sub">
          Enter a college, product, website, or IP address — get live details from Wikipedia, DNS, and browser checks.
          Learn why some IPs are <strong>Real</strong> but still cannot open directly in the browser.
        </p>
      </div>

      <div className="info-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`info-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => { setTab(t.id); setResult(null); setError('') }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <form className="info-search-panel panel" onSubmit={handleSearch}>
        <label className="info-search-label">
          {activeTab.icon} Search {activeTab.label}
        </label>
        <div className="info-search-row">
          <input
            className="field-input info-search-input"
            type="search"
            placeholder={activeTab.hint}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching…' : 'Get Details →'}
          </button>
        </div>
        <div className="info-examples">
          <span className="info-examples-label">Try:</span>
          {EXAMPLES[tab].map((ex) => (
            <button key={ex} type="button" className="info-example-chip" onClick={() => handleSearch(null, ex)}>
              {ex}
            </button>
          ))}
        </div>
      </form>

      {error && <div className="feedback error info-feedback">{error}</div>}

      {loading && (
        <div className="info-loading panel">
          <div className="info-loading-spinner" />
          <p>Fetching live public data…</p>
        </div>
      )}

      {result && !loading && (
        <div className="info-result panel">
          <div className="info-result-header">
            {result.thumbnail && (
              <img src={result.thumbnail} alt="" className="info-result-thumb" />
            )}
            <div className="info-result-head-text">
              <span className="info-result-type">{result.type.toUpperCase()}</span>
              <h2>{result.title}</h2>
              {result.subtitle && <p className="info-result-subtitle">{result.subtitle}</p>}
              {result.description && <p className="info-result-desc">{result.description}</p>}
              <span className="info-result-source">📡 {result.source}</span>
            </div>
          </div>

          <div className="info-result-summary">
            <h3>Overview</h3>
            <p>{result.summary}</p>
          </div>

          {result.type === 'ip' && result.verdictOk !== undefined && (
            <div className={`info-ip-hero ${result.verdictOk ? 'real' : 'warn'}`}>
              <span className="info-ip-hero-label">{result.description}</span>
              <p>Pasting IP in browser address bar often fails even for real websites — servers need the domain name (Host header).</p>
            </div>
          )}

          {result.ipChecks?.length > 0 && (
            <div className="info-ip-checks-section">
              <h3>🔢 IP Real vs Fake Check</h3>
              {result.ipChecks.map((check) => (
                <IpVerdictBanner key={check.ip} check={check} />
              ))}
            </div>
          )}

          {result.leadership?.length > 0 && (
            <div className="info-leadership-section">
              <h3>👩‍🏫 Leadership</h3>
              <div className="info-leadership-grid">
                {result.leadership.map((l) => (
                  <div key={l.role} className="info-leader-card">
                    <span className="info-leader-role">{l.role}</span>
                    <strong>{l.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(result.ugPrograms?.length || result.pgPrograms?.length || result.diplomaPrograms?.length) > 0 && (
            <div className="info-programs-block">
              <h3 className="info-section-heading">📚 Academic Programs</h3>
              <div className="info-programs-grid">
                <ProgramSection title="UG Programmes" icon="🎓" items={result.ugPrograms} />
                <ProgramSection title="PG Programmes" icon="📖" items={result.pgPrograms} />
                <ProgramSection title="Diploma & Certificate" icon="📝" items={result.diplomaPrograms} />
              </div>
            </div>
          )}

          {result.highlights?.length > 0 && (
            <div className="info-highlights-section">
              <h3>⭐ Campus Highlights</h3>
              <ul className="info-highlights-list">
                {result.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          )}

          {result.mous?.length > 0 && (
            <div className="info-mou-section">
              <h3>🤝 MoU Partners</h3>
              <div className="info-mou-chips">
                {result.mous.map((m) => <span key={m} className="info-mou-chip">{m}</span>)}
              </div>
            </div>
          )}

          {result.facts?.length > 0 && (
            <div className="info-facts-grid">
              {result.facts.map((f) => (
                <div key={f.label} className="info-fact-card">
                  <span className="info-fact-label">{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>
          )}

          {result.security?.length > 0 && (
            <div className="info-security-section">
              <h3>🛡️ Cyber Security Notes</h3>
              <div className="info-security-list">
                {result.security.map((s) => (
                  <div key={s.label} className={`info-security-item ${s.ok ? 'ok' : 'warn'}`}>
                    <strong>{s.label}</strong>
                    <span>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.url && (
            <a href={result.url} target="_blank" rel="noreferrer" className="btn btn-outline info-external-link">
              Open official / reference page ↗
            </a>
          )}
        </div>
      )}

      <div className="info-osint-note panel">
        <h3>💡 OSINT Learning Tip</h3>
        <p>
          Security analysts use open-source intelligence (OSINT) to research organizations, domains, and products
          before an engagement. This tool uses the same public sources — Wikipedia and DNS records — that professionals
          use for legitimate reconnaissance. Always stay ethical and only research with permission.
        </p>
      </div>
    </div>
  )
}
