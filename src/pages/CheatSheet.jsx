import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import {
  CHEAT_CATEGORIES,
  CHEAT_COMMANDS,
  THREAT_FEED,
  QUICK_TOOLS,
} from '../data/cheatSheet'

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className="cheat-copy-btn" onClick={copy} title="Copy command">
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}

export default function CheatSheet() {
  const [tab, setTab] = useState('nmap')
  const commands = CHEAT_COMMANDS[tab] || []

  return (
    <PageShell
      icon="📟"
      title="Cyber Command Cheat Sheet"
      description="Real Nmap, Linux, Wireshark, OWASP & IR commands for ICT lab practice. Copy and use in your VM — authorized targets only."
      badge="Lab Reference"
      badgeVariant="safe"
      compactHeader
    >
      <div className="cheat-layout">
        <div className="cheat-main">
          <div className="cheat-tabs">
            {CHEAT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cheat-tab ${tab === cat.id ? 'active' : ''}`}
                onClick={() => setTab(cat.id)}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="panel cheat-panel">
            <div className="cheat-panel-head">
              <h2>{CHEAT_CATEGORIES.find((c) => c.id === tab)?.label} Reference</h2>
              <span className="field-hint">Training use only · Mohan Raj · ICT Academy</span>
            </div>
            <div className="cheat-cmd-list">
              {commands.map((item) => (
                <div key={item.cmd} className="cheat-cmd-row">
                  <div className="cheat-cmd-body">
                    <code className="cheat-cmd">{item.cmd}</code>
                    <p className="cheat-desc">{item.desc}</p>
                  </div>
                  <CopyBtn text={item.cmd} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel cheat-tools-panel">
            <div className="panel-title">Quick Tool Links</div>
            <div className="cheat-tools-grid">
              {QUICK_TOOLS.map((t) => (
                <Link key={t.name} to={t.link} className="cheat-tool-card">
                  <strong>{t.name}</strong>
                  <span>{t.use}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="cheat-sidebar">
          <div className="panel cheat-threat-panel">
            <div className="panel-title">Threat Intel Feed</div>
            <p className="field-hint cheat-threat-note">Real CVEs for class discussion — check NVD for patches</p>
            <ul className="cheat-threat-list">
              {THREAT_FEED.map((t) => (
                <li key={t.id} className={`cheat-threat-item severity-${t.severity.toLowerCase()}`}>
                  <div className="cheat-threat-top">
                    <code>{t.id}</code>
                    <span className="cheat-severity">{t.severity}</span>
                  </div>
                  <p>{t.title}</p>
                  <span className="cheat-threat-date">{t.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel cheat-ethics">
            <div className="panel-title">Ethics Reminder</div>
            <ul className="cheat-ethics-list">
              <li>✅ Use only in VMware/Kali lab VMs</li>
              <li>✅ ICT session scope & trainer approval</li>
              <li>❌ Never scan college WiFi without permission</li>
              <li>❌ Never attack auxiliumcollege.ac.in live systems</li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
