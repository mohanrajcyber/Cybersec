import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import PageShell from '../components/PageShell'
import { logBurpEvent, getBurpLogs, buildHttpRaw } from '../utils/burpSuiteLog'

const FAKE_RESULTS = [
  { title: 'ICT Academy — Cyber Security Training', url: 'https://www.ictacademy.in', snippet: 'Official ICT Academy portal for cybersecurity and emerging technology programs across Tamil Nadu.' },
  { title: 'Auxilium College Pudukkottai', url: 'https://www.auxiliumcollege.ac.in', snippet: 'NAAC A Grade women\'s college — Bharathidasan University affiliated institution.' },
  { title: 'OWASP Top 10 Web Security Risks', url: 'https://owasp.org/www-project-top-ten/', snippet: 'Learn about injection, broken authentication, XSS and other critical web vulnerabilities.' },
  { title: 'Burp Suite — Web Security Testing', url: 'https://portswigger.net/burp', snippet: 'Industry-standard toolkit for intercepting HTTP traffic between browser and web server.' },
]

const LANG_LINKS = ['हिन्दी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ']
const AI_CHIPS = [
  { id: 'create-images', label: 'Create images', icon: '✋' },
  { id: 'ask-files', label: 'Ask about files', icon: '📄' },
  { id: 'brainstorm', label: 'Brainstorm', icon: '💡' },
  { id: 'lucky', label: 'I am feeling lucky', icon: null },
]

function GoogleLogo({ size = 'large' }) {
  return (
    <div className={`burp-g-logo ${size}`} aria-hidden>
      <span className="b">G</span><span className="r">o</span><span className="y">o</span><span className="b2">g</span><span className="g">l</span><span className="r2">e</span>
    </div>
  )
}

function AppsGridIcon() {
  return (
    <svg className="burp-g-apps-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle key={`${row}-${col}`} cx={6 + col * 6} cy={6 + row * 6} r="2" fill="currentColor" />
        ))
      )}
    </svg>
  )
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <path fill="#4285f4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path fill="#34a853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  )
}

function LensIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#ea4335" strokeWidth="1.5" />
      <path fill="#fbbc04" d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" opacity="0.5" />
      <path fill="#4285f4" d="M12 8v8M8 12h8" stroke="#4285f4" strokeWidth="0" />
    </svg>
  )
}

function GoogleHome({ searchInput, setSearchInput, onSearch, onNavClick, onChipClick, profileInitial }) {
  return (
    <div className="burp-google-home-v2">
      <header className="burp-g-topbar">
        <div className="burp-g-topbar-left">
          <button type="button" onClick={() => onNavClick('About')}>About</button>
          <button type="button" onClick={() => onNavClick('Store')}>Store</button>
        </div>
        <div className="burp-g-topbar-right">
          <button type="button" onClick={() => onNavClick('Gmail')}>Gmail</button>
          <button type="button" onClick={() => onNavClick('Images')}>Images</button>
          <button type="button" className="burp-g-icon-btn" onClick={() => onNavClick('Google Apps')} aria-label="Google apps">
            <AppsGridIcon />
          </button>
          <button type="button" className="burp-g-profile" onClick={() => onNavClick('Google Account')} aria-label="Google Account">
            {profileInitial}
          </button>
        </div>
      </header>

      <main className="burp-g-main">
        <GoogleLogo size="large" />
        <form className="burp-g-search-form-v2" onSubmit={(e) => onSearch(e, false)}>
          <div className="burp-g-search-box-v2">
            <button type="button" className="burp-g-search-plus" onClick={() => onNavClick('Search plus')} aria-label="Add">+</button>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
              aria-label="Search"
            />
            <div className="burp-g-search-tools">
              <button type="button" className="burp-g-tool-btn" onClick={() => onNavClick('Voice search')} aria-label="Voice search"><MicIcon /></button>
              <button type="button" className="burp-g-tool-btn" onClick={() => onNavClick('Google Lens')} aria-label="Google Lens"><LensIcon /></button>
              <button type="button" className="burp-g-ai-mode" onClick={() => onNavClick('AI Mode')}>
                <span className="burp-g-ai-sparkle">✦</span> AI Mode
              </button>
            </div>
          </div>
          <div className="burp-g-ai-chips">
            {AI_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type={chip.id === 'lucky' ? 'button' : 'button'}
                className="burp-g-chip"
                onClick={() => (chip.id === 'lucky' ? onSearch(null, true) : onChipClick(chip.label))}
              >
                {chip.icon && <span className="burp-g-chip-icon">{chip.icon}</span>}
                {chip.label}
              </button>
            ))}
          </div>
        </form>
        <p className="burp-g-langs">
          Google offered in:{' '}
          {LANG_LINKS.map((lang) => (
            <button key={lang} type="button" onClick={() => onNavClick(`Language: ${lang}`)}>{lang}</button>
          ))}
        </p>
      </main>

      <footer className="burp-g-site-footer">
        <div className="burp-g-footer-row burp-g-footer-loc">
          <span>India</span>
        </div>
        <div className="burp-g-footer-row burp-g-footer-links">
          <div className="burp-g-footer-left">
            {['Advertising', 'Business', 'How Search works'].map((l) => (
              <button key={l} type="button" onClick={() => onNavClick(l)}>{l}</button>
            ))}
          </div>
          <div className="burp-g-footer-right">
            {['Privacy', 'Terms', 'Settings'].map((l) => (
              <button key={l} type="button" onClick={() => onNavClick(l)}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function GoogleResults({ query, searchInput, setSearchInput, onSearch, onNavClick, onResultClick, onBackHome, profileInitial }) {
  return (
    <div className="burp-google-results-v2">
      <header className="burp-g-results-header">
        <GoogleLogo size="small" />
        <form className="burp-g-search-form-v2 inline" onSubmit={(e) => onSearch(e, false)}>
          <div className="burp-g-search-box-v2 small">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button type="submit" className="burp-g-tool-btn" aria-label="Search">🔍</button>
          </div>
        </form>
        <div className="burp-g-results-header-right">
          <button type="button" className="burp-g-icon-btn" onClick={() => onNavClick('Google Apps')}><AppsGridIcon /></button>
          <button type="button" className="burp-g-profile" onClick={() => onNavClick('Google Account')}>{profileInitial}</button>
        </div>
      </header>
      <nav className="burp-g-result-tabs">
        {['All', 'Images', 'News', 'Videos', 'Maps', 'More'].map((t, i) => (
          <button key={t} type="button" className={i === 0 ? 'active' : ''} onClick={() => onNavClick(t)}>{t}</button>
        ))}
      </nav>
      <div className="burp-g-results-body">
        <p className="burp-g-result-meta">About {Math.floor(Math.random() * 900 + 100)} results (0.{Math.floor(Math.random() * 40 + 10)} seconds)</p>
        <div className="burp-g-results-list">
          {FAKE_RESULTS.map((r) => (
            <button key={r.url} type="button" className="burp-g-result-item" onClick={() => onResultClick(r.title, r.url)}>
              <div className="burp-g-result-favicon">🌐</div>
              <div>
                <cite>{r.url.replace('https://', '')}</cite>
                <strong>{r.title}</strong>
                <p>{r.snippet}</p>
              </div>
            </button>
          ))}
        </div>
        <button type="button" className="burp-g-back" onClick={onBackHome}>← Back to Google Home</button>
      </div>
    </div>
  )
}

export default function BurpSuiteLab() {
  const { studentName, session, markModuleVisited, completeLab } = useAuth()
  const username = session?.username || 'guest'
  const displayName = studentName || session?.name || 'Student'
  const profileInitial = (displayName.trim()[0] || 'S').toUpperCase()

  const [view, setView] = useState('home')
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [logs, setLogs] = useState(() => getBurpLogs())
  const [selectedLog, setSelectedLog] = useState(null)
  const [proxyOn, setProxyOn] = useState(true)
  const loggedOpen = useRef(false)

  const refreshLogs = useCallback(() => {
    const all = getBurpLogs()
    setLogs(all)
    if (all.length) setSelectedLog((prev) => prev || all[all.length - 1])
  }, [])

  useEffect(() => {
    markModuleVisited('burp-suite')
    if (!loggedOpen.current) {
      loggedOpen.current = true
      logBurpEvent({
        studentUsername: username,
        studentName: displayName,
        action: 'lab_open',
        url: '/burp-suite',
        details: 'Student opened Burp Suite Proxy Lab',
      })
      refreshLogs()
    }
  }, [username, displayName, markModuleVisited, refreshLogs])

  useEffect(() => {
    const handler = () => refreshLogs()
    window.addEventListener('burp-log-update', handler)
    return () => window.removeEventListener('burp-log-update', handler)
  }, [refreshLogs])

  const capture = useCallback((payload) => {
    if (!proxyOn) return null
    const entry = logBurpEvent({
      studentUsername: username,
      studentName: displayName,
      ...payload,
    })
    refreshLogs()
    setSelectedLog(entry)
    return entry
  }, [username, displayName, proxyOn, refreshLogs])

  const handleSearch = (e, lucky = false) => {
    e?.preventDefault()
    const q = searchInput.trim()
    if (!q) return
    setQuery(q)
    setView('results')
    capture({
      action: 'search',
      method: 'GET',
      url: '/search',
      query: q,
      target: lucky ? 'I am feeling lucky' : 'Google Search',
      details: lucky ? `btnI=1&q=${encodeURIComponent(q)}` : `q=${encodeURIComponent(q)}&btnK=Google+Search`,
    })
    completeLab('burp-suite')
  }

  const handleNavClick = (target) => {
    capture({
      action: 'click',
      method: 'GET',
      url: `/${target.toLowerCase().replace(/\s+/g, '-')}`,
      target,
      details: `Navigation: ${target}`,
    })
  }

  const handleChipClick = (label) => {
    capture({
      action: 'click',
      method: 'GET',
      url: '/ai-mode',
      target: label,
      details: `AI chip clicked: ${label}`,
    })
  }

  const handleResultClick = (title, url) => {
    capture({
      action: 'click',
      method: 'GET',
      url: new URL(url).pathname,
      target: title,
      query,
      details: `Result click → ${url}`,
    })
  }

  const myLogs = logs.filter((l) => l.studentUsername === username)
  const sessionStats = {
    requests: myLogs.length,
    searches: myLogs.filter((l) => l.action === 'search').length,
  }

  return (
    <PageShell
      icon="🔶"
      title="Burp Suite Proxy Lab"
      description="Realistic Google page — every click & search intercepted like Burp Proxy. ICT Academy simulation only."
      badge="HTTP Intercept · Lab Safe"
      badgeVariant="safe"
      detailsSections={[
        { title: 'What is Burp Suite?', content: 'Burp Suite sits between your browser and website, capturing every HTTP request — URLs, headers, cookies, POST data.' },
        { title: 'What gets logged?', content: 'Page open, search queries, link clicks, and navigation — with student username, timestamp, and full HTTP raw request.' },
        { title: 'Trainer view', content: 'Admin Panel → Burp Suite Activity shows all students, search terms, and live intercept log.' },
      ]}
    >
      <div className="burp-lab-toolbar">
        <div className="burp-proxy-toggle">
          <span className={`burp-proxy-dot ${proxyOn ? 'on' : ''}`} />
          <strong>Proxy: {proxyOn ? 'INTERCEPT ON' : 'OFF'}</strong>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setProxyOn((v) => !v)}>
            {proxyOn ? 'Pause' : 'Resume'}
          </button>
        </div>
        <div className="burp-session-stats">
          <span>Your session: <strong>{sessionStats.requests}</strong> requests</span>
          <span>Searches: <strong>{sessionStats.searches}</strong></span>
        </div>
      </div>

      <div className="burp-lab-stage">
        <div className="burp-browser-wrap burp-browser-wrap--google">
          <div className="burp-browser-chrome">
            <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            <div className="burp-url-bar">
              <span className="burp-lock">🔒</span>
              <span>{view === 'home' ? 'https://www.google.com/' : `https://www.google.com/search?q=${encodeURIComponent(query)}`}</span>
            </div>
          </div>

          <div className="burp-google-page">
            {view === 'home' ? (
              <GoogleHome
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearch}
                onNavClick={handleNavClick}
                onChipClick={handleChipClick}
                profileInitial={profileInitial}
              />
            ) : (
              <GoogleResults
                query={query}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearch}
                onNavClick={handleNavClick}
                onResultClick={handleResultClick}
                onBackHome={() => { setView('home'); handleNavClick('Back to Home') }}
                profileInitial={profileInitial}
              />
            )}
          </div>
        </div>

        <div className="burp-proxy-panel">
          <div className="burp-proxy-head">
            <span>🔶 Burp Suite — Proxy / HTTP History</span>
            <span className="burp-proxy-count">{logs.length} total · {myLogs.length} yours</span>
          </div>
          <div className="burp-proxy-split">
            <div className="burp-history-list">
              {logs.length === 0 && <p className="burp-empty">No traffic yet — search on Google to intercept requests</p>}
              {[...logs].reverse().slice(0, 40).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`burp-history-item ${selectedLog?.id === entry.id ? 'active' : ''} action-${entry.action}`}
                  onClick={() => setSelectedLog(entry)}
                >
                  <span className="burp-h-time">{entry.time}</span>
                  <span className="burp-h-method">{entry.method}</span>
                  <span className="burp-h-path">
                    {entry.action === 'search' ? `/search?q=${entry.query}` : entry.url}
                  </span>
                  <span className="burp-h-user">@{entry.studentUsername}</span>
                </button>
              ))}
            </div>
            <div className="burp-request-view">
              {selectedLog ? (
                <>
                  <div className="burp-req-meta">
                    <span className={`burp-action-tag ${selectedLog.action}`}>{selectedLog.action}</span>
                    <strong>{selectedLog.studentName}</strong> · @{selectedLog.studentUsername}
                  </div>
                  <pre className="burp-raw-http">{buildHttpRaw(selectedLog)}</pre>
                  {selectedLog.query && (
                    <div className="burp-highlight">
                      🔍 Search query captured: <code>{selectedLog.query}</code>
                    </div>
                  )}
                  {selectedLog.target && (
                    <div className="burp-highlight dim">Target: {selectedLog.target}</div>
                  )}
                </>
              ) : (
                <p className="burp-empty">Select a request to view raw HTTP</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
