import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import PageShell from '../components/PageShell'
import { logBurpEvent, getBurpLogs, buildHttpRaw } from '../utils/burpSuiteLog'

const HOME_URL = 'https://www.google.com/'
const LOAD_MS = 520

const BASE_RESULTS = [
  { title: 'ICT Academy — Cyber Security Training', url: 'https://www.ictacademy.in', snippet: 'Official ICT Academy portal for cybersecurity and emerging technology programs across Tamil Nadu.' },
  { title: 'Auxilium College Pudukkottai', url: 'https://www.auxiliumcollege.ac.in', snippet: 'NAAC A Grade women\'s college — Bharathidasan University affiliated institution.' },
  { title: 'OWASP Top 10 Web Security Risks', url: 'https://owasp.org/www-project-top-ten/', snippet: 'Learn about injection, broken authentication, XSS and other critical web vulnerabilities.' },
  { title: 'Burp Suite — Web Security Testing', url: 'https://portswigger.net/burp', snippet: 'Industry-standard toolkit for intercepting HTTP traffic between browser and web server.' },
]

const SITE_PAGES = {
  'www.ictacademy.in': {
    title: 'ICT Academy',
    heading: 'Empowering Youth for Future Tech Careers',
    body: 'ICT Academy is a not-for-profit initiative focusing on cybersecurity, AI, and emerging technologies for students across India.',
  },
  'www.auxiliumcollege.ac.in': {
    title: 'Auxilium College',
    heading: 'Auxilium College — Pudukkottai',
    body: 'Welcome to Auxilium College. NAAC accredited institution affiliated to Bharathidasan University.',
  },
  'owasp.org': {
    title: 'OWASP Foundation',
    heading: 'OWASP Top 10 Web Application Security Risks',
    body: 'The OWASP Top 10 is a standard awareness document for developers and web application security.',
  },
  'portswigger.net': {
    title: 'PortSwigger — Burp Suite',
    heading: 'Burp Suite Professional',
    body: 'Burp Suite is the leading toolkit for web security testing. Proxy, Scanner, Intruder, and Repeater modules.',
  },
  'mail.google.com': {
    title: 'Gmail',
    heading: 'Sign in — Google Accounts',
    body: 'Email or phone · Forgot email? · Create account · ICT Academy simulation — no real login.',
  },
}

const LANG_LINKS = ['हिन्दी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ']
const AI_CHIPS = [
  { id: 'create-images', label: 'Create images', icon: '✋' },
  { id: 'ask-files', label: 'Ask about files', icon: '📄' },
  { id: 'brainstorm', label: 'Brainstorm', icon: '💡' },
  { id: 'lucky', label: 'I am feeling lucky', icon: null },
]

function homePage() {
  return { type: 'home', url: HOME_URL, title: 'Google', query: '', host: 'www.google.com' }
}

function searchPage(query) {
  const q = query.trim()
  return {
    type: 'search',
    url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    title: `${q} - Google Search`,
    query: q,
    host: 'www.google.com',
  }
}

function sitePage(title, url) {
  let host = 'www.example.com'
  try {
    host = new URL(url).host
  } catch { /* keep default */ }
  return {
    type: 'site',
    url,
    title: title || host,
    siteTitle: title,
    siteHost: host,
    host,
    query: '',
  }
}

function parseAddressInput(raw) {
  const input = raw.trim()
  if (!input) return homePage()

  const lower = input.toLowerCase()
  if (lower === 'google.com' || lower === 'www.google.com' || lower === HOME_URL || lower === 'https://google.com/') {
    return homePage()
  }

  if (lower.includes('mail.google.com') || lower === 'gmail.com' || lower === 'gmail') {
    return { type: 'gmail', url: 'https://mail.google.com/', title: 'Gmail', host: 'mail.google.com', query: '' }
  }

  if (lower.includes('/search?q=') || lower.startsWith('search?q=')) {
    try {
      const u = input.startsWith('http') ? new URL(input) : new URL(`https://www.google.com/${input.replace(/^\//, '')}`)
      const q = u.searchParams.get('q') || ''
      if (q) return searchPage(q)
    } catch { /* fall through */ }
  }

  if (/^https?:\/\//i.test(input) || /^[\w-]+\.(com|in|org|net|edu)(\/|$)/i.test(input)) {
    const full = input.startsWith('http') ? input : `https://${input}`
    try {
      const u = new URL(full)
      if (u.host.includes('google.com') && u.pathname === '/search') {
        const q = u.searchParams.get('q') || ''
        if (q) return searchPage(q)
      }
      return sitePage(u.host, full)
    } catch { /* fall through */ }
  }

  return searchPage(input)
}

function getSearchResults(query) {
  const q = query.trim().toLowerCase()
  const scored = BASE_RESULTS.map((r) => {
    const hay = `${r.title} ${r.snippet} ${r.url}`.toLowerCase()
    let score = 0
    q.split(/\s+/).forEach((word) => {
      if (word && hay.includes(word)) score += 2
    })
    return { ...r, score }
  }).sort((a, b) => b.score - a.score)

  const top = scored.filter((r) => r.score > 0)
  const list = top.length ? top : BASE_RESULTS
  return [
    {
      title: `"${query}" — Top web results (simulated)`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet: `Google found pages related to "${query}". ICT Academy lab simulation only.`,
    },
    ...list.slice(0, 5),
  ]
}

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
    </svg>
  )
}

function BrowserChrome({
  urlInput, onUrlInputChange, onUrlSubmit, onBack, onForward, onRefresh,
  canBack, canForward, loading, pageTitle,
}) {
  return (
    <div className="burp-browser-chrome burp-browser-chrome-v2">
      <div className="burp-window-dots">
        <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
      </div>
      <div className="burp-nav-btns">
        <button type="button" className="burp-nav-btn" onClick={onBack} disabled={!canBack || loading} title="Back" aria-label="Back">←</button>
        <button type="button" className="burp-nav-btn" onClick={onForward} disabled={!canForward || loading} title="Forward" aria-label="Forward">→</button>
        <button type="button" className="burp-nav-btn" onClick={onRefresh} disabled={loading} title="Reload" aria-label="Reload">↻</button>
      </div>
      <form className="burp-url-bar burp-url-bar-editable" onSubmit={onUrlSubmit}>
        <span className="burp-lock" title="Secure">🔒</span>
        <input
          type="text"
          className="burp-url-input"
          value={urlInput}
          onChange={(e) => onUrlInputChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          aria-label="Address bar"
          spellCheck={false}
        />
        {loading && <span className="burp-url-spinner" aria-hidden />}
      </form>
      {pageTitle && <div className="burp-tab-title" title={pageTitle}>{pageTitle}</div>}
    </div>
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
          <button type="button" onClick={() => onNavClick('Gmail', 'https://mail.google.com/')}>Gmail</button>
          <button type="button" onClick={() => onNavClick('Images', '/images')}>Images</button>
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
                type="button"
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
        <div className="burp-g-footer-row burp-g-footer-loc"><span>India</span></div>
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

function GoogleResults({ query, searchInput, setSearchInput, resultsMeta, onSearch, onNavClick, onResultClick, profileInitial }) {
  const results = useMemo(() => getSearchResults(query), [query])

  return (
    <div className="burp-google-results-v2">
      <header className="burp-g-results-header">
        <GoogleLogo size="small" />
        <form className="burp-g-search-form-v2 inline" onSubmit={(e) => onSearch(e, false)}>
          <div className="burp-g-search-box-v2 small">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} aria-label="Search" />
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
        <p className="burp-g-result-meta">About {resultsMeta.count} results ({resultsMeta.seconds} seconds)</p>
        <div className="burp-g-results-list">
          {results.map((r) => (
            <button key={`${r.url}-${r.title}`} type="button" className="burp-g-result-item" onClick={() => onResultClick(r.title, r.url)}>
              <div className="burp-g-result-favicon">🌐</div>
              <div>
                <cite>{r.url.replace(/^https?:\/\//, '')}</cite>
                <strong>{r.title}</strong>
                <p>{r.snippet}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockSitePage({ page }) {
  const host = page.siteHost || page.host
  const preset = SITE_PAGES[host] || SITE_PAGES[host.replace(/^www\./, '')]
  const heading = preset?.heading || page.siteTitle || host
  const body = preset?.body || `Simulated page for ${page.url}. In a real browser this would load live content from the server.`

  return (
    <div className="burp-site-page">
      <div className="burp-site-toolbar">
        <span className="burp-site-favicon">🌐</span>
        <span className="burp-site-host">{host}</span>
      </div>
      <article className="burp-site-content">
        <h1>{heading}</h1>
        <p>{body}</p>
        <div className="burp-site-card">
          <p><strong>URL:</strong> <code>{page.url}</code></p>
          <p className="burp-site-note">ICT Academy lab — simulated HTTP response. Burp Suite captured the GET request in the proxy panel.</p>
        </div>
      </article>
    </div>
  )
}

function MockGmailPage({ profileInitial }) {
  return (
    <div className="burp-gmail-page">
      <div className="burp-gmail-card">
        <GoogleLogo size="small" />
        <h2>Sign in</h2>
        <p>to continue to Gmail</p>
        <div className="burp-gmail-field">
          <label>Email or phone</label>
          <input type="text" placeholder="Enter your email" readOnly />
        </div>
        <button type="button" className="burp-gmail-next">Next</button>
        <p className="burp-gmail-hint">Simulation only — profile: {profileInitial}</p>
      </div>
    </div>
  )
}

export default function BurpSuiteLab() {
  const { studentName, session, markModuleVisited, completeLab } = useAuth()
  const username = session?.username || 'guest'
  const displayName = studentName || session?.name || 'Student'
  const profileInitial = (displayName.trim()[0] || 'S').toUpperCase()

  const [history, setHistory] = useState([homePage()])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [urlInput, setUrlInput] = useState(HOME_URL)
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState(() => getBurpLogs())
  const [selectedLog, setSelectedLog] = useState(null)
  const [proxyOn, setProxyOn] = useState(true)
  const loggedOpen = useRef(false)
  const loadTimer = useRef(null)
  const historyIndexRef = useRef(0)
  const resultsMeta = useMemo(() => ({
    count: Math.floor(Math.random() * 900 + 100),
    seconds: `0.${Math.floor(Math.random() * 40 + 10)}`,
  }), [historyIndex])

  const currentPage = history[historyIndex] || homePage()
  const canBack = historyIndex > 0
  const canForward = historyIndex < history.length - 1

  useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])

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
        url: '/',
        host: 'www.google.com',
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

  useEffect(() => () => {
    if (loadTimer.current) clearTimeout(loadTimer.current)
  }, [])

  useEffect(() => {
    setUrlInput(currentPage.url)
    if (currentPage.query) setSearchInput(currentPage.query)
  }, [currentPage.url, currentPage.query])

  const capture = useCallback((payload) => {
    if (!proxyOn) return null
    const entry = logBurpEvent({
      studentUsername: username,
      studentName: displayName,
      host: payload.host || 'www.google.com',
      ...payload,
    })
    refreshLogs()
    setSelectedLog(entry)
    return entry
  }, [username, displayName, proxyOn, refreshLogs])

  const logForPage = useCallback((page, extra = {}) => {
    if (page.type === 'home') {
      return capture({ action: 'click', method: 'GET', url: '/', target: 'Google Home', host: 'www.google.com', details: 'GET / HTTP/1.1', ...extra })
    }
    if (page.type === 'search') {
      return capture({
        action: 'search',
        method: 'GET',
        url: '/search',
        query: page.query,
        target: extra.lucky ? 'I am feeling lucky' : 'Google Search',
        host: 'www.google.com',
        details: extra.lucky ? `btnI=1&q=${encodeURIComponent(page.query)}` : `q=${encodeURIComponent(page.query)}&btnK=Google+Search`,
        ...extra,
      })
    }
    if (page.type === 'gmail') {
      return capture({ action: 'click', method: 'GET', url: '/', target: 'Gmail', host: 'mail.google.com', details: 'GET /mail/ HTTP/1.1', ...extra })
    }
    return capture({
      action: extra.action || 'click',
      method: 'GET',
      url: new URL(page.url).pathname || '/',
      target: page.siteTitle || page.title,
      query: page.query || '',
      host: page.host,
      details: `GET ${new URL(page.url).pathname || '/'} HTTP/1.1 — Host: ${page.host}`,
      ...extra,
    })
  }, [capture])

  const navigateTo = useCallback((page, logExtra = {}, { replace = false } = {}) => {
    if (loadTimer.current) clearTimeout(loadTimer.current)
    setLoading(true)

    loadTimer.current = setTimeout(() => {
      const idx = historyIndexRef.current
      setHistory((prev) => {
        const trimmed = prev.slice(0, idx + 1)
        if (replace && trimmed.length) {
          const next = [...trimmed]
          next[next.length - 1] = page
          return next
        }
        return [...trimmed, page]
      })
      setHistoryIndex(replace ? idx : idx + 1)
      setUrlInput(page.url)
      if (page.query) setSearchInput(page.query)
      logForPage(page, logExtra)
      setLoading(false)
      if (page.type === 'search') completeLab('burp-suite')
    }, LOAD_MS)
  }, [logForPage, completeLab])

  const goBack = () => {
    if (!canBack || loading) return
    setHistoryIndex((i) => i - 1)
    capture({ action: 'click', method: 'GET', url: '/history', target: 'Browser Back', host: 'www.google.com', details: 'History.back()' })
  }

  const goForward = () => {
    if (!canForward || loading) return
    setHistoryIndex((i) => i + 1)
    capture({ action: 'click', method: 'GET', url: '/history', target: 'Browser Forward', host: 'www.google.com', details: 'History.forward()' })
  }

  const reloadPage = () => {
    if (loading) return
    setLoading(true)
    loadTimer.current = setTimeout(() => {
      logForPage(currentPage, { action: 'click', details: `Reload — ${currentPage.url}` })
      setLoading(false)
    }, LOAD_MS * 0.7)
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    const page = parseAddressInput(urlInput)
    navigateTo(page)
  }

  const handleSearch = (e, lucky = false) => {
    e?.preventDefault()
    const q = searchInput.trim()
    if (!q) return
    navigateTo(searchPage(q), { lucky })
  }

  const handleNavClick = (target, destUrl) => {
    if (target === 'Gmail' || destUrl?.includes('mail.google.com')) {
      navigateTo({ type: 'gmail', url: 'https://mail.google.com/', title: 'Gmail', host: 'mail.google.com', query: '' })
      return
    }
    if (destUrl?.startsWith('http')) {
      navigateTo(sitePage(target, destUrl))
      return
    }
    capture({
      action: 'click',
      method: 'GET',
      url: `/${target.toLowerCase().replace(/\s+/g, '-')}`,
      target,
      host: 'www.google.com',
      details: `Navigation: ${target}`,
    })
  }

  const handleChipClick = (label) => {
    capture({
      action: 'click',
      method: 'GET',
      url: '/ai-mode',
      target: label,
      host: 'www.google.com',
      details: `AI chip clicked: ${label}`,
    })
  }

  const handleResultClick = (title, url) => {
    if (url.includes('google.com/search')) {
      handleSearch(null, false)
      return
    }
    navigateTo(sitePage(title, url))
  }

  const myLogs = logs.filter((l) => l.studentUsername === username)
  const sessionStats = {
    requests: myLogs.length,
    searches: myLogs.filter((l) => l.action === 'search').length,
  }

  const renderPage = () => {
    if (loading) {
      return (
        <div className="burp-browser-loading">
          <div className="burp-load-spinner" />
          <p>Loading…</p>
        </div>
      )
    }

    switch (currentPage.type) {
      case 'search':
        return (
          <GoogleResults
            query={currentPage.query}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            resultsMeta={resultsMeta}
            onSearch={handleSearch}
            onNavClick={handleNavClick}
            onResultClick={handleResultClick}
            profileInitial={profileInitial}
          />
        )
      case 'site':
        return <MockSitePage page={currentPage} />
      case 'gmail':
        return <MockGmailPage profileInitial={profileInitial} />
      default:
        return (
          <GoogleHome
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSearch={handleSearch}
            onNavClick={handleNavClick}
            onChipClick={handleChipClick}
            profileInitial={profileInitial}
          />
        )
    }
  }

  return (
    <PageShell
      icon="🔶"
      title="Burp Suite Proxy Lab"
      description="Realistic browser simulation — back, forward, URL bar, search & site navigation. Every request intercepted like Burp Proxy."
      badge="HTTP Intercept · Lab Safe"
      badgeVariant="safe"
      detailsSections={[
        { title: 'What is Burp Suite?', content: 'Burp Suite sits between your browser and website, capturing every HTTP request — URLs, headers, cookies, POST data.' },
        { title: 'Real browser feel', content: 'Use ← → ↻ buttons, type URLs in the address bar, click search results to open sites — all traffic appears in HTTP History.' },
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
          <BrowserChrome
            urlInput={urlInput}
            onUrlInputChange={setUrlInput}
            onUrlSubmit={handleUrlSubmit}
            onBack={goBack}
            onForward={goForward}
            onRefresh={reloadPage}
            canBack={canBack}
            canForward={canForward}
            loading={loading}
            pageTitle={currentPage.title}
          />

          <div className="burp-browser-viewport">
            <div className="burp-google-page">
              {renderPage()}
            </div>
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
                    {entry.host && entry.host !== 'www.google.com' ? `${entry.host}${entry.url}` : (entry.action === 'search' ? `/search?q=${entry.query}` : entry.url)}
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
                    {selectedLog.host && <span className="burp-req-host"> · {selectedLog.host}</span>}
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
