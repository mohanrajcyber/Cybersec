import PageShell from '../components/PageShell'
import { useAuth } from '../context/AuthContext'
import { getModuleDetails } from '../data/moduleDetails'

const moduleContent = {
  network: {
    icon: '🌐',
    title: 'Network Analysis',
    desc: 'Analyze packet captures and identify suspicious traffic patterns in a simulated environment.',
    terminal: [
      '$ wireshark_sim --capture training_capture.pcap',
      '[*] Loading 847 packets...',
      '[*] Protocol hierarchy: TCP 62%, UDP 28%, DNS 10%',
      '[!] ALERT: Suspicious outbound connection detected',
      '    Source: 192.168.1.105 → Destination: 185.220.101.45:4444',
      '    Protocol: TCP | Flags: SYN | Payload: 0 bytes',
      '[!] Possible C2 beacon — irregular interval pattern (every 60s)',
    ],
    insights: [
      { label: 'Suspicious IP', detail: '185.220.101.45 is a known Tor exit node — unusual for internal traffic.' },
      { label: 'Port 4444', detail: 'Commonly used by Metasploit reverse shells. Non-standard for legitimate services.' },
      { label: 'Beacon Pattern', detail: 'Regular 60-second intervals suggest automated callback (C2 communication).' },
    ],
  },
  password: {
    icon: '🔐',
    title: 'Password Security',
    desc: 'Learn password strength analysis, hashing concepts, and multi-factor authentication.',
    terminal: [
      '$ passcheck --analyze "P@ssw0rd123"',
      '[*] Length: 11 characters',
      '[*] Has uppercase: Yes | Lowercase: Yes | Digits: Yes',
      '[*] Special chars: Yes | Dictionary word detected: Yes',
      '[!] CRACK TIME ESTIMATE: ~4 hours (dictionary + rules)',
      '',
      '$ passcheck --analyze "Tr0ub4dor&3" vs "correct-horse-battery-staple"',
      '[*] "Tr0ub4dor&3" — Entropy: 34 bits → Crack: hours',
      '[*] "correct-horse-battery-staple" — Entropy: 44 bits → Crack: centuries',
      '[✓] Passphrase > complex short password',
    ],
    insights: [
      { label: 'Length Matters', detail: 'A 4-word passphrase beats a complex 8-character password in entropy.' },
      { label: 'Hashing', detail: 'Passwords should be stored using bcrypt/Argon2 — never plain text or MD5.' },
      { label: 'MFA', detail: 'Multi-factor authentication blocks 99.9% of automated account attacks.' },
    ],
  },
  soc: {
    icon: '📊',
    title: 'SOC / Log Analysis',
    desc: 'Parse security logs and detect anomalies in a simulated Security Operations Center.',
    terminal: [
      '$ siem_analyzer --logs auth.log --timerange 1h',
      '[*] Parsing 12,847 log entries...',
      '[!] ANOMALY: 47 failed SSH login attempts from 203.0.113.55',
      '[!] ANOMALY: Privilege escalation attempt — sudo su root by user "guest"',
      '[!] ANOMALY: Data exfiltration pattern — 2.3GB outbound to unknown IP',
      '[*] Generating incident ticket: INC-2026-0814-001',
      '[*] Severity: HIGH | Recommended: Block IP, isolate host, rotate credentials',
    ],
    insights: [
      { label: 'Brute Force', detail: '47 failed SSH attempts in 1 hour indicates automated credential stuffing.' },
      { label: 'Priv Escalation', detail: 'Guest account attempting sudo su is a critical indicator of compromise.' },
      { label: 'Incident Response', detail: 'Follow the chain: Detect → Contain → Eradicate → Recover → Lessons Learned.' },
    ],
  },
  ctf: {
    icon: '🏆',
    title: 'Mini CTF',
    desc: 'Capture the flag challenges to test your cyber security skills.',
    terminal: [
      '$ ctf --challenge 1',
      '[*] Challenge: Hidden in Plain Sight',
      '[*] Hint: Check the page source of the login portal',
      '',
      'Flag format: ICT{your_answer_here}',
      '',
      '[*] Challenge 2: Decode the Message',
      '[*] Hint: VGVsbG8gQ3liZXIgU3R1ZGVudCE=',
      '[*] Decode this Base64 string to find the flag',
      '',
      '[*] Challenge 3: Port Puzzle',
      '[*] Which port does HTTPS use? Wrap answer in flag format.',
    ],
    insights: [
      { label: 'Challenge 1', detail: 'Inspect HTML comments in page source — flags are often hidden in <!-- --> tags.' },
      { label: 'Challenge 2', detail: 'Base64 decode: "Hello Cyber Student!" → Flag: ICT{Hello_Cyber_Student}' },
      { label: 'Challenge 3', detail: 'HTTPS uses port 443 → Flag: ICT{443}' },
    ],
  },
}

export default function GenericModule({ moduleId }) {
  const { visitedModules, getOverallProgress, bootcamp, getBadges, getScore } = useAuth()

  if (moduleId === 'progress') {
    const overall = getOverallProgress()
    const allTopics = Object.entries(bootcamp).flatMap(([day, topics]) =>
      Object.entries(topics).map(([key, done]) => ({ day, key, done }))
    )
    const completedCount = allTopics.filter((t) => t.done).length

    return (
      <PageShell
        icon="📚"
        title="Learning Progress"
        description="Track your bootcamp completion and modules explored."
        detailsSections={getModuleDetails('progress')}
      >
        <div className="lab-grid lab-grid-single">
          <div className="lab-main">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Bootcamp Progress</div>
                <span className="status-pill status-open">{overall}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
              </div>
              <p className="field-hint" style={{ marginTop: '0.75rem' }}>
                {completedCount} of {allTopics.length} bootcamp topics completed
              </p>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Overall Score</div>
                <span className="status-pill status-open">{getScore()}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${getScore()}%` }} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Badges Earned ({getBadges().length})</div>
              <div className="badges-row">
                {getBadges().map((b) => (
                  <span key={b.id} className="badge-chip earned">{b.icon} {b.name}</span>
                ))}
                {getBadges().length === 0 && <p className="field-hint">Complete labs to earn badges!</p>}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Modules Visited</div>
              {visitedModules.length === 0 ? (
                <p className="field-hint">No modules visited yet. Start exploring from the dashboard!</p>
              ) : (
                <ul className="threat-list">
                  {visitedModules.map((m) => (
                    <li key={m} className="threat-item">
                      <span className="threat-icon" style={{ color: 'var(--green)' }}>✓</span>
                      <div className="threat-label" style={{ textTransform: 'capitalize' }}>{m}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  const content = moduleContent[moduleId]
  if (!content) return null

  return (
    <PageShell
      icon={content.icon}
      title={content.title}
      description={content.desc}
      detailsSections={getModuleDetails(moduleId)}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Lab Output</div>
              <span className="panel-meta">{moduleId}_lab · training mode</span>
            </div>
            <div className="terminal terminal-pro">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">student@ict-lab</span>
              </div>
              <div className="terminal-body">
                {content.terminal.map((line, i) => (
                  <div key={i} className={line.startsWith('[!]') ? 'highlight' : line.startsWith('$') ? 'prompt' : 'output'}>
                    {line.startsWith('$') ? <><span className="prompt">$</span>{line.slice(1)}</> : line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Key Insights</div>
            {content.insights.map((ins) => (
              <div key={ins.label} className="why-item">
                <h4>{ins.label}</h4>
                <p>{ins.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
