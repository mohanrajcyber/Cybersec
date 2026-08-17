import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  PHISH_SMS_TEMPLATE,
  PHISH_FAKE_URL,
  PHISH_VICTIM,
  PHISH_THEORY,
  PHISH_STEPS,
} from '../data/warRoomPhishing'

const STEP_ORDER = ['idle', 'sent', 'opened', 'site', 'call', 'otp', 'stolen', 'safe']

function formatMoney(n) {
  return `₹${n.toLocaleString('en-IN')}`
}

function PhoneStatusBar() {
  return (
    <div className="war-phish-phone-status">
      <span className="war-phish-time">15:06</span>
      <div className="war-phish-status-icons">
        <span className="war-phish-signal" aria-hidden />
        <span className="war-phish-wifi" aria-hidden />
        <span className="war-phish-battery" aria-hidden />
      </div>
    </div>
  )
}

function BankAppHeader({ title = 'SBI YONO', onBack }) {
  return (
    <div className="war-phish-bank-app-header">
      <button type="button" className="war-phish-bank-app-back" onClick={onBack} aria-label="Go back">‹</button>
      <div className="war-phish-bank-app-brand">
        <span className="war-phish-bank-app-logo">SBI</span>
        <span>{title}</span>
      </div>
      <span className="war-phish-bank-app-menu">⋮</span>
    </div>
  )
}

function formatAccountName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return parts[0] || 'Student'
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

export default function WarRoomPhishingDemo() {
  const { studentName, isStudent } = useAuth()
  const victimName = isStudent && studentName ? studentName : PHISH_VICTIM.name
  const accountLabel = formatAccountName(victimName)
  const [step, setStep] = useState('idle')
  const [victimPhone, setVictimPhone] = useState(PHISH_VICTIM.phone)
  const [otp, setOtp] = useState('')
  const [attackerLog, setAttackerLog] = useState(['[INFO] SMS Phishing kit loaded — simulation only'])
  const [balance, setBalance] = useState(PHISH_VICTIM.balance)
  const [callActive, setCallActive] = useState(false)

  const stepIdx = STEP_ORDER.indexOf(step)

  const log = (msg) => {
    setAttackerLog((prev) => [...prev, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ${msg}`])
  }

  const sendSms = () => {
    if (step !== 'idle') return
    setStep('sent')
    log(`SMS sent to +91 ${victimPhone} — "₹5000 refund" lure`)
    log(`Malicious link embedded: ${PHISH_FAKE_URL}`)
  }

  const openSms = () => {
    if (step !== 'sent') return
    setStep('opened')
    log('Victim opened SMS — urgency hook triggered')
  }

  const clickLink = () => {
    if (step !== 'opened') return
    setStep('site')
    log('Victim clicked phishing link — fake bank portal loaded')
  }

  const submitPhone = () => {
    if (step !== 'site') return
    setStep('call')
    setCallActive(true)
    log(`Mobile captured: +91 ${victimPhone}`)
    log('Auto-dialer: Fake "Bank Officer" call initiated…')
  }

  const answerCall = () => {
    if (step !== 'call') return
    setCallActive(false)
    setStep('otp')
    log('Victim answered call — social engineering in progress')
    log('Attacker script: "Share OTP to verify refund"')
  }

  const submitOtp = () => {
    if (step !== 'otp' || !otp.trim()) return
    setStep('stolen')
    setBalance(0)
    log(`OTP CAPTURED: ${otp}`)
    log(`Account drained: ${formatMoney(PHISH_VICTIM.balance)} → mule account (simulation)`)
    log('[SUCCESS] Attack complete — victim balance zero')
  }

  const rejectScam = () => {
    if (!['call', 'otp', 'site', 'opened', 'sent'].includes(step)) return
    setCallActive(false)
    setStep('safe')
    log('[FAILED] Victim refused OTP — attack blocked')
    log('[INFO] Victim reported scam to bank helpline')
  }

  const resetPhish = () => {
    setStep('idle')
    setOtp('')
    setBalance(PHISH_VICTIM.balance)
    setCallActive(false)
    setAttackerLog(['[INFO] SMS Phishing kit loaded — simulation only'])
  }

  const goBackPhone = () => {
    if (step === 'call' && callActive) {
      setCallActive(false)
      setStep('site')
      return
    }
    if (step === 'safe' || step === 'stolen') {
      if (step === 'stolen') setBalance(PHISH_VICTIM.balance)
      setStep('idle')
      return
    }
    const idx = STEP_ORDER.indexOf(step)
    if (idx <= 0) return
    if (step === 'otp') setOtp('')
    setStep(STEP_ORDER[idx - 1])
  }

  const currentStepMeta = PHISH_STEPS.find((s) => s.id === step) || PHISH_STEPS[0]
  const progressPct = Math.round((Math.max(0, stepIdx) / (STEP_ORDER.length - 2)) * 100)

  return (
    <section className="war-phish-section">
      <div className="war-phish-header">
        <div>
          <h2>📱 SMS &amp; UPI PHISHING DEMO</h2>
          <p>Attacker PC → Victim Mobile — Practical social engineering simulation (ICT Academy Lab)</p>
        </div>
        <div className="war-phish-header-actions">
          <span className="war-phish-step-badge">Step: {currentStepMeta.label}</span>
          <button type="button" className="war-btn war-btn-reset" onClick={resetPhish}>Reset Demo</button>
        </div>
      </div>

      <div className="war-phish-theory">
        {PHISH_THEORY.map((t) => (
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
          <div className="war-phish-pc-title">💻 ATTACKER PC — SMS Phishing Kit</div>
          <div className="war-phish-pc-screen">
            <div className="war-phish-pc-bar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span>root@scammer:~ — Illegal in real life · Lab simulation</span>
            </div>
            <div className="war-phish-pc-body">
              <div className="war-phish-tool">
                <label>SMS Blast Tool v2.1</label>
                <div className="war-phish-field">
                  <span>Target Number</span>
                  <input
                    type="text"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    disabled={step !== 'idle'}
                    placeholder="10-digit mobile"
                  />
                </div>
                <div className="war-phish-field">
                  <span>Message Template</span>
                  <textarea readOnly value={PHISH_SMS_TEMPLATE} rows={4} />
                </div>
                <div className="war-phish-field">
                  <span>Phishing URL</span>
                  <code>{PHISH_FAKE_URL}</code>
                </div>
                <button
                  type="button"
                  className="war-phish-send-btn"
                  onClick={sendSms}
                  disabled={step !== 'idle' || victimPhone.length !== 10}
                >
                  📤 Send Fake SMS to Victim
                </button>
              </div>

              <div className="war-phish-attacker-log">
                <div className="war-sub-title">Attacker Console</div>
                <div className="war-phish-log-scroll">
                  {attackerLog.map((line, i) => (
                    <p key={i} className={line.includes('CAPTURED') || line.includes('drained') ? 'stolen' : line.includes('FAILED') ? 'safe' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {step === 'stolen' && (
                <div className="war-phish-stolen-panel">
                  <strong>💰 Stolen Credentials</strong>
                  <p>Mobile: +91 {victimPhone}</p>
                  <p>OTP: {otp || '******'}</p>
                  <p>Amount: {formatMoney(PHISH_VICTIM.balance)} → mule account</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flow arrow */}
        <div className="war-phish-flow">
          <div className={`war-phish-arrow ${stepIdx > 0 ? 'active' : ''}`}>SMS →</div>
          <div className={`war-phish-arrow ${stepIdx > 2 ? 'active' : ''}`}>Link →</div>
          <div className={`war-phish-arrow ${stepIdx > 4 ? 'active' : ''}`}>OTP →</div>
          <div className="war-phish-progress">
            <div style={{ height: `${Math.min(progressPct, 100)}%` }} />
          </div>
        </div>

        {/* Victim Mobile */}
        <div className="war-phish-mobile-wrap">
          <div className="war-phish-mobile-title">📱 VICTIM MOBILE — {victimName}</div>
          <div className="war-phish-phone">
            <div className="war-phish-phone-frame">
              <div className="war-phish-phone-notch" />
              <div className="war-phish-phone-screen">
                <PhoneStatusBar />

                {/* Home / idle */}
                {step === 'idle' && (
                  <div className="war-phish-phone-home">
                    <div className="war-phish-wallpaper" />
                    <div className="war-phish-home-clock">
                      <strong>15:06</strong>
                      <span>Mon, 17 Aug</span>
                    </div>
                    <div className="war-phish-app-grid">
                      {[
                        { icon: '🏦', label: 'YONO SBI', color: '#1d4ed8' },
                        { icon: '💜', label: 'PhonePe', color: '#5b21b6' },
                        { icon: '💬', label: 'Messages', color: '#059669' },
                        { icon: '📞', label: 'Phone', color: '#0284c7' },
                        { icon: '📷', label: 'Camera', color: '#475569' },
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

                {step === 'safe' && (
                  <div className="war-phish-bank-app">
                    <BankAppHeader title="Account Safe" onBack={goBackPhone} />
                    <div className="war-phish-safe-screen">
                      <div className="war-phish-safe-badge">✓</div>
                      <strong>Scam Blocked</strong>
                      <p>You did not share OTP.</p>
                      <div className="war-phish-balance-card safe">
                        <span>Available Balance</span>
                        <strong>{formatMoney(balance)}</strong>
                        <small>A/c ****{victimPhone.slice(-4)}</small>
                      </div>
                      <p className="war-phish-tip">Report to <strong>1930</strong> or bank helpline</p>
                    </div>
                  </div>
                )}

                {/* SMS notification on lock screen */}
                {step === 'sent' && (
                  <div className="war-phish-lock-screen">
                    <div className="war-phish-wallpaper dim" />
                    <div className="war-phish-lock-time">
                      <strong>15:06</strong>
                      <span>Monday, 17 August</span>
                    </div>
                    <div
                      className="war-phish-notif"
                      onClick={openSms}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openSms()}
                    >
                      <div className="war-phish-notif-row">
                        <div className="war-phish-notif-app">
                          <span className="war-phish-notif-icon">💬</span>
                          <span>Messages · now</span>
                        </div>
                      </div>
                      <div className="war-phish-notif-body">
                        <strong>SBI-Alerts</strong>
                        <p>₹5,000 credited to your account. Tap to verify refund claim immediately.</p>
                      </div>
                      <small>Tap notification to open</small>
                    </div>
                  </div>
                )}

                {/* SMS reading */}
                {step === 'opened' && (
                  <div className="war-phish-sms-app">
                    <div className="war-phish-sms-top">
                      <button type="button" className="war-phish-sms-back" onClick={goBackPhone} aria-label="Go back">‹</button>
                      <div className="war-phish-sms-contact">
                        <div className="war-phish-sms-avatar">S</div>
                        <div>
                          <strong>SBI-Alerts</strong>
                          <span>+91-1800-XXX-XX</span>
                        </div>
                      </div>
                    </div>
                    <div className="war-phish-sms-thread">
                      <span className="war-phish-sms-time">Today, 3:05 PM</span>
                      <div className="war-phish-sms-bubble">
                        {PHISH_SMS_TEMPLATE}
                        <a className="war-phish-sms-link" href="#" onClick={(e) => { e.preventDefault(); clickLink() }}>
                          {PHISH_FAKE_URL}
                        </a>
                      </div>
                    </div>
                    <div className="war-phish-sms-actions">
                      <button type="button" className="war-phish-link-btn" onClick={clickLink}>
                        Open Link
                      </button>
                      <button type="button" className="war-phish-safe-btn" onClick={rejectScam}>
                        Report Spam
                      </button>
                    </div>
                  </div>
                )}

                {/* Fake bank site in Chrome */}
                {step === 'site' && (
                  <div className="war-phish-browser">
                    <div className="war-phish-chrome-bar">
                      <button type="button" className="war-phish-chrome-back" onClick={goBackPhone} aria-label="Go back">‹</button>
                      <div className="war-phish-chrome-tabs">
                        <span className="active">Refund Portal</span>
                      </div>
                      <div className="war-phish-chrome-url">
                        <span className="war-phish-chrome-warn">⚠</span>
                        <span>{PHISH_FAKE_URL.replace('http://', '')}</span>
                      </div>
                    </div>
                    <div className="war-phish-fake-bank">
                      <div className="war-phish-bank-banner">
                        <div className="war-phish-bank-logo-mark">SBI</div>
                        <div>
                          <h3>Refund Verification</h3>
                          <p>Claim pending amount</p>
                        </div>
                      </div>
                      <div className="war-phish-refund-card">
                        <span>Refund Amount</span>
                        <strong>₹5,000.00</strong>
                      </div>
                      <p className="war-phish-fake-warn">Enter registered mobile number to receive OTP</p>
                      <label className="war-phish-input-label">Mobile Number</label>
                      <div className="war-phish-input-wrap">
                        <span>+91</span>
                        <input type="tel" value={victimPhone} readOnly className="war-phish-input" />
                      </div>
                      <button type="button" className="war-phish-submit" onClick={submitPhone}>
                        Get OTP →
                      </button>
                      <button type="button" className="war-phish-safe-btn small" onClick={rejectScam}>
                        This looks suspicious — Exit
                      </button>
                    </div>
                  </div>
                )}

                {/* Fake call */}
                {step === 'call' && callActive && (
                  <div className="war-phish-call-overlay">
                    <div className="war-phish-call-bg" />
                    <p className="war-phish-call-label">Incoming call</p>
                    <div className="war-phish-call-avatar">🏦</div>
                    <strong>SBI Bank Officer</strong>
                    <p className="war-phish-call-num">+91 1800-425-3800</p>
                    <p className="war-phish-call-script">"OTP share pannunga — refund verify pannanum"</p>
                    <div className="war-phish-call-btns">
                      <div className="war-phish-call-action">
                        <button type="button" className="war-phish-call-decline" onClick={rejectScam}>✕</button>
                        <span>Decline</span>
                      </div>
                      <div className="war-phish-call-action">
                        <button type="button" className="war-phish-call-answer" onClick={answerCall}>📞</button>
                        <span>Answer</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* OTP page */}
                {step === 'otp' && (
                  <div className="war-phish-browser">
                    <div className="war-phish-chrome-bar">
                      <button type="button" className="war-phish-chrome-back" onClick={goBackPhone} aria-label="Go back">‹</button>
                      <div className="war-phish-chrome-tabs">
                        <span className="active">OTP Verify</span>
                      </div>
                      <div className="war-phish-chrome-url">
                        <span className="war-phish-chrome-warn">⚠</span>
                        <span>{PHISH_FAKE_URL.replace('http://', '')}/otp</span>
                      </div>
                    </div>
                    <div className="war-phish-fake-bank">
                      <div className="war-phish-bank-banner compact">
                        <div className="war-phish-bank-logo-mark">SBI</div>
                        <div>
                          <h3>Enter OTP</h3>
                          <p>Sent to +91 {victimPhone}</p>
                        </div>
                      </div>
                      <div className="war-phish-otp-boxes">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={otp[i] ? 'filled' : ''}>{otp[i] || ''}</span>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="war-phish-input otp hidden-input"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      />
                      <button type="button" className="war-phish-submit danger" onClick={submitOtp} disabled={otp.length < 4}>
                        Verify &amp; Claim Refund
                      </button>
                      <button type="button" className="war-phish-safe-btn small" onClick={rejectScam}>
                        Never share OTP — Exit
                      </button>
                    </div>
                  </div>
                )}

                {/* Stolen — real banking app style */}
                {step === 'stolen' && (
                  <div className="war-phish-bank-app">
                    <BankAppHeader onBack={goBackPhone} />
                    <div className="war-phish-bank-alert-banner">
                      ⚠ Unauthorized transaction detected
                    </div>
                    <div className="war-phish-balance-card stolen">
                      <span>Available Balance</span>
                      <strong>{formatMoney(balance)}</strong>
                      <small>Savings A/c ****{victimPhone.slice(-4)} · {accountLabel}</small>
                    </div>
                    <div className="war-phish-txn-section">
                      <div className="war-phish-txn-head">
                        <span>Recent Transactions</span>
                        <span className="war-phish-txn-today">Today</span>
                      </div>
                      <div className="war-phish-txn-item debit">
                        <div className="war-phish-txn-icon">↓</div>
                        <div className="war-phish-txn-info">
                          <strong>UPI/IMPS Transfer</strong>
                          <span>To: XXXX-MULE-ACCT</span>
                          <small>15:06 · Ref: SIM-DEBIT-8821</small>
                        </div>
                        <div className="war-phish-txn-amt">-{formatMoney(PHISH_VICTIM.balance)}</div>
                      </div>
                      <div className="war-phish-txn-item credit dim">
                        <div className="war-phish-txn-icon up">↑</div>
                        <div className="war-phish-txn-info">
                          <strong>Salary Credit</strong>
                          <span>From: Employer</span>
                          <small>09:12 · Ref: SAL-2026</small>
                        </div>
                        <div className="war-phish-txn-amt up">+₹45,000</div>
                      </div>
                    </div>
                    <div className="war-phish-stolen-footer">
                      <p>Full balance transferred in <strong>8 seconds</strong></p>
                      <p className="war-phish-tip bad">OTP shared → account emptied. Never share OTP with anyone.</p>
                    </div>
                  </div>
                )}

                <div className="war-phish-phone-home-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="war-phish-ethics">
        ⚖️ Simulation only — Never send fake SMS or steal OTP in real life. Trainer: Mohan Raj · ICT Academy
      </p>
    </section>
  )
}
