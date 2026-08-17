import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  HACK_SMS_TEMPLATE,
  HACK_FAKE_URL,
  HACK_VICTIM,
  HACK_PERMISSIONS,
  HACK_STOLEN_DATA,
  HACK_THEORY,
  HACK_STEPS,
  STEP_ORDER,
} from '../data/warRoomPhoneHack'

function PhoneStatusBar() {
  return (
    <div className="war-phish-phone-status">
      <span className="war-phish-time">15:24</span>
      <div className="war-phish-status-icons">
        <span className="war-phish-signal" aria-hidden />
        <span className="war-phish-wifi" aria-hidden />
        <span className="war-phish-battery" aria-hidden />
      </div>
    </div>
  )
}

export default function WarRoomPhoneHackDemo() {
  const { studentName, isStudent } = useAuth()
  const victimName = isStudent && studentName ? studentName : HACK_VICTIM.name
  const [step, setStep] = useState('idle')
  const [victimPhone, setVictimPhone] = useState(HACK_VICTIM.phone)
  const [attackerLog, setAttackerLog] = useState(['[INFO] Spyware RAT kit loaded — simulation only'])
  const [grantedPerms, setGrantedPerms] = useState([])

  const stepIdx = STEP_ORDER.indexOf(step)

  const log = (msg) => {
    setAttackerLog((prev) => [...prev, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ${msg}`])
  }

  const sendSms = () => {
    if (step !== 'idle') return
    setStep('sent')
    log(`Malicious SMS sent to +91 ${victimPhone}`)
    log(`Payload link: ${HACK_FAKE_URL}`)
  }

  const openSms = () => {
    if (step !== 'sent') return
    setStep('opened')
    log('Victim opened SMS — fear trigger activated')
  }

  const clickLink = () => {
    if (step !== 'opened') return
    setStep('install')
    log('Victim clicked link — fake security APK page loaded')
  }

  const startInstall = () => {
    if (step !== 'install') return
    setStep('permissions')
    log('Victim tapped Install — permission dialog shown')
  }

  const grantAll = () => {
    if (step !== 'permissions') return
    setGrantedPerms(HACK_PERMISSIONS.map((p) => p.id))
    setStep('hacked')
    log('[SUCCESS] All permissions granted — spyware active')
    log(`Contacts harvested: ${HACK_STOLEN_DATA.contacts}`)
    log(`Photos exfiltrated: ${HACK_STOLEN_DATA.photos}`)
    log(`SMS intercepted: ${HACK_STOLEN_DATA.sms} (incl. bank OTPs)`)
    log(`GPS live: ${HACK_STOLEN_DATA.location}`)
  }

  const blockHack = () => {
    if (!['sent', 'opened', 'install', 'permissions'].includes(step)) return
    setStep('safe')
    log('[FAILED] Victim blocked install — phone hack prevented')
  }

  const goBackPhone = () => {
    if (step === 'safe' || step === 'hacked') {
      setStep('idle')
      setGrantedPerms([])
      return
    }
    const idx = STEP_ORDER.indexOf(step)
    if (idx <= 0) return
    if (step === 'permissions') setGrantedPerms([])
    setStep(STEP_ORDER[idx - 1])
  }

  const resetDemo = () => {
    setStep('idle')
    setGrantedPerms([])
    setAttackerLog(['[INFO] Spyware RAT kit loaded — simulation only'])
  }

  const currentStep = HACK_STEPS.find((s) => s.id === step) || HACK_STEPS[0]
  const progressPct = Math.round((Math.max(0, stepIdx) / (STEP_ORDER.length - 2)) * 100)

  return (
    <section className="war-phonehack-section">
      <div className="war-phish-header">
        <div>
          <h2>📲 SMS → PHONE HACK SIMULATION</h2>
          <p>Malicious link via SMS → Spyware install → Full phone compromise (ICT Academy Lab)</p>
        </div>
        <div className="war-phish-header-actions">
          <span className="war-phonehack-step-badge">Step: {currentStep.label}</span>
          <button type="button" className="war-btn war-btn-reset" onClick={resetDemo}>Reset Demo</button>
        </div>
      </div>

      <div className="war-phish-theory">
        {HACK_THEORY.map((t) => (
          <div key={t.id} className={`war-phish-theory-card ${t.id}`}>
            <span className="war-phish-theory-icon">{t.icon}</span>
            <strong>{t.title}</strong>
            <p>{t.text}</p>
          </div>
        ))}
      </div>

      <div className="war-phish-stage">
        {/* Attacker PC */}
        <div className="war-phish-pc">
          <div className="war-phish-pc-title">💻 ATTACKER PC — Spyware / RAT Panel</div>
          <div className="war-phish-pc-screen war-phonehack-pc">
            <div className="war-phish-pc-bar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span>root@rat-server:~ — Lab simulation only</span>
            </div>
            <div className="war-phish-pc-body">
              <div className="war-phish-tool">
                <label>AndroSpy RAT Builder v3.0</label>
                <div className="war-phish-field">
                  <span>Target Number</span>
                  <input
                    type="text"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    disabled={step !== 'idle'}
                  />
                </div>
                <div className="war-phish-field">
                  <span>SMS Lure Template</span>
                  <textarea readOnly value={HACK_SMS_TEMPLATE} rows={4} />
                </div>
                <div className="war-phish-field">
                  <span>Payload URL</span>
                  <code>{HACK_FAKE_URL}</code>
                </div>
                <button
                  type="button"
                  className="war-phonehack-send-btn"
                  onClick={sendSms}
                  disabled={step !== 'idle' || victimPhone.length !== 10}
                >
                  📤 Send Hack Link via SMS
                </button>
              </div>

              <div className="war-phish-attacker-log">
                <div className="war-sub-title">RAT Console</div>
                <div className="war-phish-log-scroll">
                  {attackerLog.map((line, i) => (
                    <p key={i} className={line.includes('SUCCESS') || line.includes('harvested') ? 'stolen' : line.includes('FAILED') ? 'safe' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {step === 'hacked' && (
                <div className="war-phonehack-dashboard">
                  <strong>🎯 LIVE VICTIM FEED — {victimName}</strong>
                  <div className="war-phonehack-stats">
                    <div><span>{HACK_STOLEN_DATA.contacts}</span>Contacts</div>
                    <div><span>{HACK_STOLEN_DATA.photos}</span>Photos</div>
                    <div><span>{HACK_STOLEN_DATA.sms}</span>SMS</div>
                    <div className="live"><span>●</span>Camera LIVE</div>
                  </div>
                  <p className="war-phonehack-gps">📍 {HACK_STOLEN_DATA.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="war-phish-flow">
          <div className={`war-phish-arrow ${stepIdx > 0 ? 'active' : ''}`}>SMS →</div>
          <div className={`war-phish-arrow ${stepIdx > 2 ? 'active' : ''}`}>Link →</div>
          <div className={`war-phish-arrow ${stepIdx > 4 ? 'active' : ''}`}>Hack →</div>
          <div className="war-phish-progress">
            <div style={{ height: `${Math.min(progressPct, 100)}%` }} />
          </div>
        </div>

        {/* Victim phone */}
        <div className="war-phish-mobile-wrap">
          <div className="war-phish-mobile-title">📱 VICTIM MOBILE — {victimName}</div>
          <div className="war-phish-phone">
            <div className="war-phish-phone-frame">
              <div className="war-phish-phone-notch" />
              <div className={`war-phish-phone-screen ${step === 'hacked' ? 'compromised' : ''}`}>
                <PhoneStatusBar />

                {step === 'idle' && (
                  <div className="war-phish-phone-home">
                    <div className="war-phish-wallpaper" />
                    <div className="war-phish-home-clock">
                      <strong>15:24</strong>
                      <span>Mon, 17 Aug</span>
                    </div>
                    <div className="war-phish-app-grid">
                      {[
                        { icon: '▶️', label: 'Play Store', color: '#059669' },
                        { icon: '💬', label: 'Messages', color: '#2563eb' },
                        { icon: '📷', label: 'Gallery', color: '#7c3aed' },
                        { icon: '⚙️', label: 'Settings', color: '#64748b' },
                      ].map((app) => (
                        <div key={app.label} className="war-phish-app-item">
                          <div className="war-phish-app-icon" style={{ background: app.color }}>{app.icon}</div>
                          <span>{app.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'sent' && (
                  <div className="war-phish-lock-screen">
                    <div className="war-phish-wallpaper dim" />
                    <div className="war-phish-lock-time">
                      <strong>15:24</strong>
                      <span>Monday, 17 August</span>
                    </div>
                    <div
                      className="war-phish-notif war-phonehack-notif"
                      onClick={openSms}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openSms()}
                    >
                      <div className="war-phish-notif-row">
                        <div className="war-phish-notif-app">
                          <span className="war-phish-notif-icon">⚠️</span>
                          <span>Messages · now</span>
                        </div>
                      </div>
                      <div className="war-phish-notif-body">
                        <strong>Google Security</strong>
                        <p>ALERT: Suspicious activity detected. Install security patch now →</p>
                      </div>
                      <small>Tap to open</small>
                    </div>
                  </div>
                )}

                {step === 'opened' && (
                  <div className="war-phish-sms-app">
                    <div className="war-phish-sms-top">
                      <button type="button" className="war-phish-sms-back" onClick={goBackPhone} aria-label="Go back">‹</button>
                      <div className="war-phish-sms-contact">
                        <div className="war-phish-sms-avatar warn">!</div>
                        <div>
                          <strong>Google Security</strong>
                          <span>Unknown sender</span>
                        </div>
                      </div>
                    </div>
                    <div className="war-phish-sms-thread">
                      <span className="war-phish-sms-time">Today, 3:23 PM</span>
                      <div className="war-phish-sms-bubble warn">
                        {HACK_SMS_TEMPLATE}
                        <a className="war-phish-sms-link" href="#" onClick={(e) => { e.preventDefault(); clickLink() }}>
                          {HACK_FAKE_URL}
                        </a>
                      </div>
                    </div>
                    <div className="war-phish-sms-actions">
                      <button type="button" className="war-phish-link-btn" onClick={clickLink}>Open Link</button>
                      <button type="button" className="war-phish-safe-btn" onClick={blockHack}>Block &amp; Report</button>
                    </div>
                  </div>
                )}

                {step === 'install' && (
                  <div className="war-phish-browser">
                    <div className="war-phish-chrome-bar">
                      <button type="button" className="war-phish-chrome-back" onClick={goBackPhone} aria-label="Go back">‹</button>
                      <div className="war-phish-chrome-tabs"><span className="active">Security Update</span></div>
                      <div className="war-phish-chrome-url">
                        <span className="war-phish-chrome-warn">⚠</span>
                        <span>{HACK_FAKE_URL.replace('http://', '')}</span>
                      </div>
                    </div>
                    <div className="war-phonehack-install-page">
                      <div className="war-phonehack-apk-icon">🛡️</div>
                      <h3>Android Security Patch</h3>
                      <p className="war-phonehack-ver">v12.4.1 · 8.2 MB · Unknown source</p>
                      <div className="war-phonehack-warn-box">
                        ⚠ Your device may be infected. Install immediately to protect data.
                      </div>
                      <ul className="war-phonehack-perm-preview">
                        <li>Access contacts, camera, SMS</li>
                        <li>Run in background 24/7</li>
                      </ul>
                      <button type="button" className="war-phish-submit danger" onClick={startInstall}>
                        Install APK
                      </button>
                      <button type="button" className="war-phish-safe-btn small" onClick={blockHack}>
                        Cancel — Never install unknown apps
                      </button>
                    </div>
                  </div>
                )}

                {step === 'permissions' && (
                  <div className="war-phonehack-perm-screen">
                    <div className="war-phonehack-perm-head">
                      <div className="war-phonehack-apk-icon small">🛡️</div>
                      <div>
                        <strong>Security Patch</strong>
                        <span>wants to access</span>
                      </div>
                    </div>
                    <div className="war-phonehack-perm-list">
                      {HACK_PERMISSIONS.map((p) => (
                        <div key={p.id} className="war-phonehack-perm-item">
                          <span>{p.icon}</span>
                          <div>
                            <strong>{p.label}</strong>
                            <small>{p.desc}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="war-phonehack-perm-btns">
                      <button type="button" className="war-phish-safe-btn" onClick={blockHack}>Deny</button>
                      <button type="button" className="war-phish-submit danger" onClick={grantAll}>Allow All</button>
                    </div>
                  </div>
                )}

                {step === 'hacked' && (
                  <div className="war-phonehack-compromised">
                    <div className="war-phonehack-compromised-banner">
                      <span className="pulse">🔴</span> PHONE COMPROMISED
                    </div>
                    <div className="war-phonehack-compromised-body">
                      <p>Spyware is running in background</p>
                      <div className="war-phonehack-stolen-grid">
                        {HACK_PERMISSIONS.map((p) => (
                          <div key={p.id} className="war-phonehack-stolen-item">
                            <span>{p.icon}</span>
                            <strong>{p.label}</strong>
                            <small>ACCESS GRANTED</small>
                          </div>
                        ))}
                      </div>
                      <p className="war-phonehack-tip bad">Attacker can see your photos, read OTP SMS, track location &amp; use camera — simulation</p>
                    </div>
                  </div>
                )}

                {step === 'safe' && (
                  <div className="war-phonehack-safe">
                    <div className="war-phish-safe-badge">✓</div>
                    <strong>Phone Safe</strong>
                    <p>Unknown app was NOT installed.</p>
                    <p className="war-phish-tip">Only install apps from official Play Store.</p>
                    <button type="button" className="war-phish-safe-btn" onClick={goBackPhone}>Back to Home</button>
                  </div>
                )}

                <div className="war-phish-phone-home-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="war-phish-ethics">
        ⚖️ Simulation only — Installing spyware is illegal. Trainer: Mohan Raj · ICT Academy
      </p>
    </section>
  )
}
