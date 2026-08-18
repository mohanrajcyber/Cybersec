import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import PageShell from '../components/PageShell'
import BurpProxyPanel from '../components/BurpProxyPanel'
import { logBurpEvent, getBurpLogs, clearBurpLogs, removeBurpLog } from '../utils/burpSuiteLog'
import { buildGoogleSearchResponse, buildSitePageContent } from '../utils/burpGoogleSearch'

const HOME_URL = 'https://www.google.com/'
const LOAD_MS = 520
const REAL_GOOGLE_HOME = `${import.meta.env.BASE_URL || '/'}google-real-home.html`

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

function sitePage(title, url, sourceQuery = '') {
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
    sourceQuery,
    query: sourceQuery,
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

function SnippetText({ text }) {
  const parts = String(text).split(/(⟨[^⟩]+⟩)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('⟨') && part.endsWith('⟩')) {
          return <mark key={i} className="burp-g-hl">{part.slice(1, -1)}</mark>
        }
        return part
      })}
    </>
  )
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
  canBack, canForward, loading, pageTitle, onViewSource, onOpenRealGoogle, useRealHtml,
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
        <button type="button" className="burp-nav-btn burp-nav-btn-text" onClick={onViewSource} title="View page source" aria-label="View source">&lt;/&gt;</button>
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
      <div className="burp-chrome-actions">
        {useRealHtml && (
          <span className="burp-real-badge" title="Using captured google.com HTML">Real HTML</span>
        )}
        <button type="button" className="burp-open-real-btn" onClick={onOpenRealGoogle} title="Open on live Google.com">
          Open Live ↗
        </button>
      </div>
      {pageTitle && <div className="burp-tab-title" title={pageTitle}>{pageTitle}</div>}
    </div>
  )
}

function ViewSourceModal({ source, onClose }) {
  if (!source) return null
  return (
    <div className="burp-source-backdrop" onClick={onClose} role="presentation">
      <div className="burp-source-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="View source">
        <div className="burp-source-head">
          <strong>view-source:{source.url}</strong>
          <label className="burp-source-wrap-label">
            <input type="checkbox" defaultChecked readOnly /> Line wrap
          </label>
          <button type="button" className="burp-source-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <pre className="burp-source-code">{source.text}</pre>
      </div>
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

function GoogleResults({ query, searchInput, setSearchInput, onSearch, onNavClick, onResultClick, onRelatedSearch, profileInitial }) {
  const searchData = useMemo(() => buildGoogleSearchResponse(query), [query])
  const { resultCount, seconds, knowledgePanel, results, peopleAlsoAsk, relatedSearches } = searchData

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
      <div className="burp-g-results-layout">
        <div className="burp-g-results-main">
          <p className="burp-g-result-meta">About {resultCount.toLocaleString('en-IN')} results ({seconds} seconds)</p>

          {peopleAlsoAsk?.length > 0 && (
            <div className="burp-g-paa">
              <h3>People also ask</h3>
              {peopleAlsoAsk.map((q) => (
                <button key={q} type="button" className="burp-g-paa-item" onClick={() => onRelatedSearch(q)}>
                  <span>{q}</span><span className="burp-g-paa-chevron">▾</span>
                </button>
              ))}
            </div>
          )}

          <div className="burp-g-results-list">
            {results.map((r) => (
              <button key={`${r.url}-${r.title}`} type="button" className="burp-g-result-item" onClick={() => onResultClick(r.title, r.url)}>
                <div className="burp-g-result-favicon">{r.favicon || '🌐'}</div>
                <div>
                  <cite>{r.url.replace(/^https?:\/\//, '')}</cite>
                  <strong>{r.title}</strong>
                  {r.date && <span className="burp-g-result-date">{r.date}</span>}
                  <p><SnippetText text={r.snippet} /></p>
                </div>
              </button>
            ))}
          </div>

          {relatedSearches?.length > 0 && (
            <div className="burp-g-related">
              <h3>Searches related to {query}</h3>
              <div className="burp-g-related-chips">
                {relatedSearches.map((term) => (
                  <button key={term} type="button" className="burp-g-related-chip" onClick={() => onRelatedSearch(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {knowledgePanel && (
          <aside className="burp-g-knowledge">
            <div className="burp-g-knowledge-head">
              <span className="burp-g-knowledge-emoji">{knowledgePanel.emoji}</span>
              <div>
                <h2>{knowledgePanel.title}</h2>
                <p>{knowledgePanel.subtitle}</p>
              </div>
            </div>
            <ul className="burp-g-knowledge-facts">
              {knowledgePanel.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <p className="burp-g-knowledge-src">Data from Google Knowledge Graph (simulated)</p>
          </aside>
        )}
      </div>
    </div>
  )
}

function MockSitePage({ page }) {
  const content = buildSitePageContent(page)

  return (
    <div className="burp-site-page">
      <div className="burp-site-toolbar">
        <span className="burp-site-favicon">{content.favicon}</span>
        <span className="burp-site-host">{content.host}</span>
      </div>
      <article className="burp-site-content">
        <h1>{content.heading}</h1>
        <p>{content.body}</p>
        {content.sections?.map((sec) => (
          <section key={sec.h} className="burp-site-section">
            <h2>{sec.h}</h2>
            <p>{sec.p}</p>
          </section>
        ))}
        <div className="burp-site-card">
          <p><strong>URL:</strong> <code>{page.url}</code></p>
          {page.sourceQuery && <p><strong>From search:</strong> <code>{page.sourceQuery}</code></p>}
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
  const [useRealHtml, setUseRealHtml] = useState(true)
  const [viewSource, setViewSource] = useState(null)
  const [interceptPending, setInterceptPending] = useState(null)
  const loggedOpen = useRef(false)
  const loadTimer = useRef(null)
  const historyIndexRef = useRef(0)
  const googleIframeRef = useRef(null)

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
    const handler = (e) => {
      refreshLogs()
      const entry = e.detail
      if (entry && proxyOn) {
        setInterceptPending(entry)
        setSelectedLog(entry)
      }
    }
    window.addEventListener('burp-log-update', handler)
    return () => window.removeEventListener('burp-log-update', handler)
  }, [refreshLogs, proxyOn])

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
      setUseRealHtml(page.type === 'home')
      logForPage(page, logExtra)
      setLoading(false)
      if (page.type === 'search') completeLab('burp-suite')
    }, LOAD_MS)
  }, [logForPage, completeLab])

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data
      if (!data || data.source !== 'cybersec-google') return

      if (data.type === 'page_load') {
        capture({ action: 'click', method: 'GET', url: '/', target: 'Google Home (real HTML)', host: 'www.google.com', details: 'Loaded google-real-home.html snapshot' })
        return
      }

      if (data.type === 'search' && data.query) {
        setSearchInput(data.query)
        setUseRealHtml(false)
        navigateTo(searchPage(data.query))
        return
      }

      if (data.type === 'click') {
        capture({
          action: 'click',
          method: 'GET',
          url: data.url || '/',
          target: data.target || 'click',
          host: 'www.google.com',
          details: `Real HTML click: ${data.target || ''} → ${data.url || ''}`,
        })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [capture, navigateTo])

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
    if (useRealHtml && currentPage.type === 'home' && googleIframeRef.current) {
      googleIframeRef.current.src = `${REAL_GOOGLE_HOME.split('?')[0]}?t=${Date.now()}`
      capture({ action: 'click', method: 'GET', url: '/', target: 'Reload', host: 'www.google.com', details: 'Reload google-real-home.html' })
      return
    }
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
    if (url.includes('google.com/search') && url.includes('tbm=isch')) {
      capture({ action: 'click', method: 'GET', url: '/search', query: currentPage.query || searchInput, target: 'Google Images', host: 'www.google.com', details: 'tbm=isch' })
      return
    }
    if (url.includes('google.com/search')) {
      handleSearch(null, false)
      return
    }
    navigateTo(sitePage(title, url, currentPage.query || searchInput))
  }

  const handleRelatedSearch = (term) => {
    setSearchInput(term)
    setUseRealHtml(false)
    navigateTo(searchPage(term))
  }

  const handleViewSource = async () => {
    const displayUrl = currentPage.url || HOME_URL
    try {
      const res = await fetch(REAL_GOOGLE_HOME)
      const text = await res.text()
      setViewSource({ url: displayUrl, text })
      capture({ action: 'click', method: 'GET', url: '/view-source', target: 'View Source', host: 'www.google.com', details: `view-source:${displayUrl}` })
    } catch {
      setViewSource({ url: displayUrl, text: '<!-- Unable to load google-real-home.html -->' })
    }
  }

  const handleOpenRealGoogle = () => {
    const q = (currentPage.query || searchInput).trim()
    const liveUrl = q ? `https://www.google.com/search?q=${encodeURIComponent(q)}` : HOME_URL
    window.open(liveUrl, '_blank', 'noopener,noreferrer')
    capture({ action: 'click', method: 'GET', url: '/open-external', query: q, target: 'Open Live Google', host: 'www.google.com', details: `window.open → ${liveUrl}` })
  }

  const handleForwardIntercept = () => setInterceptPending(null)

  const handleDropIntercept = () => {
    if (interceptPending) {
      removeBurpLog(interceptPending.id)
      setInterceptPending(null)
      refreshLogs()
      setSelectedLog(null)
    }
  }

  const handleClearBurpHistory = () => {
    clearBurpLogs()
    setInterceptPending(null)
    setSelectedLog(null)
    refreshLogs()
  }

  const myLogs = logs.filter((l) => l.studentUsername === username)
  const sessionStats = {
    requests: myLogs.length,
    searches: myLogs.filter((l) => l.action === 'search').length,
  }

  const renderPage = () => {
    if (useRealHtml && currentPage.type === 'home' && !loading) {
      return (
        <iframe
          ref={googleIframeRef}
          className="burp-real-google-frame"
          src={REAL_GOOGLE_HOME}
          title="Google — real homepage HTML"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )
    }

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
            onSearch={handleSearch}
            onNavClick={handleNavClick}
            onResultClick={handleResultClick}
            onRelatedSearch={handleRelatedSearch}
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
        <div className="burp-mode-toggle">
          <button
            type="button"
            className={`btn btn-sm ${useRealHtml ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setUseRealHtml(true)
              if (currentPage.type !== 'home') navigateTo(homePage())
            }}
          >
            Real Google HTML
          </button>
          <button
            type="button"
            className={`btn btn-sm ${!useRealHtml ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setUseRealHtml(false)}
          >
            Lab Simulation
          </button>
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
            onViewSource={handleViewSource}
            onOpenRealGoogle={handleOpenRealGoogle}
            useRealHtml={useRealHtml && currentPage.type === 'home'}
          />

          <div className={`burp-browser-viewport ${useRealHtml && currentPage.type === 'home' ? 'burp-browser-viewport--real' : ''}`}>
            <div className={useRealHtml && currentPage.type === 'home' ? 'burp-real-google-wrap' : 'burp-google-page'}>
              {renderPage()}
            </div>
          </div>
        </div>

        <ViewSourceModal source={viewSource} onClose={() => setViewSource(null)} />

        <BurpProxyPanel
          logs={logs}
          myLogs={myLogs}
          selectedLog={selectedLog}
          onSelectLog={setSelectedLog}
          interceptPending={interceptPending}
          proxyOn={proxyOn}
          onForward={handleForwardIntercept}
          onDrop={handleDropIntercept}
          onClearHistory={handleClearBurpHistory}
          username={username}
        />
      </div>
    </PageShell>
  )
}
