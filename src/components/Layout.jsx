import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { ICT_SESSION } from '../data/sessionPlan'
import { SIDEBAR_NAV, TRAINER_NAV, MOBILE_BOTTOM_NAV, isNavActive } from '../data/sidebarNav'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { getOverallProgress, getScore, studentName, logout, theme, toggleTheme, isTrainer } = useAuth()
  const { classMode, toggleClassMode, toggleFullscreen } = useLabSettings()
  const progress = getOverallProgress()
  const score = getScore()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const navSections = isTrainer ? [...SIDEBAR_NAV, TRAINER_NAV] : SIDEBAR_NAV

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen)
    return () => document.body.classList.remove('mobile-menu-open')
  }, [menuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`)
    else navigate('/')
  }

  const sidebarContent = (
    <>
      <Link to="/" className="sidebar-brand" onClick={() => setMenuOpen(false)}>
        <div className="logo-icon">CS</div>
        <div className="logo-text">
          <div className="logo-title">CyberSec Arena</div>
          <div className="logo-tagline">ICT Academy · Mohan Raj</div>
        </div>
      </Link>

      <div className="sidebar-scroll">
        {navSections.map((group) => (
          <div key={group.section} className="sidebar-section">
            <div className="sidebar-section-label">{group.section}</div>
            <nav className="sidebar-nav" aria-label={group.section}>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isNavActive(location.pathname, item.path) ? 'active' : ''}`}
                  title={item.label}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="sidebar-link-icon" aria-hidden>{item.icon}</span>
                  <span className="sidebar-link-text">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-batch">Batch {ICT_SESSION.batchId}</div>
        <div className="sidebar-footer-venue">Auxilium College · Pudukkottai</div>
        <div className="sidebar-footer-dates">{ICT_SESSION.displayDates}</div>
      </div>
    </>
  )

  return (
    <div className={`app-layout ${classMode ? 'app-layout--class' : ''}`}>
      <aside className="app-sidebar app-sidebar--desktop" aria-label="Main navigation">
        {sidebarContent}
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`app-sidebar app-sidebar--drawer ${menuOpen ? 'open' : ''}`} aria-label="Mobile menu">
        <div className="mobile-drawer-head">
          <strong>Menu</strong>
          <button type="button" className="mobile-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close">✕</button>
        </div>
        {sidebarContent}
      </aside>

      <div className="app-shell">
        <header className="app-topbar">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <Link to="/" className="mobile-topbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="logo-icon sm">CS</div>
            <span>CyberSec Arena</span>
          </Link>

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search labs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search labs"
            />
          </form>

          <div className="header-actions">
            {isTrainer && (
              <>
                <button
                  type="button"
                  className={`class-mode-btn ${classMode ? 'active' : ''}`}
                  onClick={toggleClassMode}
                  title="Class Mode"
                >
                  <span className="btn-icon">📽</span>
                  <span className="btn-label">{classMode ? 'Class ON' : 'Class'}</span>
                </button>
                <button type="button" className="class-mode-btn" onClick={toggleFullscreen} title="Fullscreen">
                  ⛶
                </button>
              </>
            )}
            <button
              type="button"
              className="btn-hackmode"
              onClick={() => navigate('/war-room')}
              title="Cyber War Room"
            >
              <span className="btn-icon">⚔</span>
              <span className="btn-label">War Room</span>
            </button>
            <button type="button" className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="header-progress">
              <span className="header-progress-label">{score}%</span>
              <div className="header-progress-bar">
                <div className="header-progress-fill" style={{ width: `${score}%` }} />
              </div>
            </div>
            <button type="button" className="btn-logout" onClick={logout}>Logout</button>
          </div>
        </header>

        {studentName && (
          <div className="welcome-bar">
            <span>Welcome, <strong>{studentName}</strong></span>
            <span className="welcome-bar-stats">Bootcamp: {progress}% · Score: {score}%</span>
          </div>
        )}

        <main className="app-main">{children}</main>

        <footer className="app-footer">
          <div className="footer-inner">
            <span>CyberSec Arena · Trainer: Mohan Raj</span>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </footer>

        <nav className="mobile-bottom-nav" aria-label="Quick navigation">
          {MOBILE_BOTTOM_NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-bottom-link ${isNavActive(location.pathname, item.path) ? 'active' : ''}`}
            >
              <span className="mobile-bottom-icon" aria-hidden>{item.icon}</span>
              <span className="mobile-bottom-label">{item.label}</span>
            </Link>
          ))}
          <button
            type="button"
            className={`mobile-bottom-link ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(true)}
          >
            <span className="mobile-bottom-icon" aria-hidden>☰</span>
            <span className="mobile-bottom-label">More</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
