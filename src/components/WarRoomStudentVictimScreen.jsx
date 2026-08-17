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

function PhoneFrame({ title, children, compromised }) {
  return (
    <div className="war-phish-mobile-wrap war-student-full-mobile">
      <div className="war-phish-mobile-title">{title}</div>
      <div className="war-phish-phone">
        <div className="war-phish-phone-frame">
          <div className="war-phish-phone-notch" />
          <div className={`war-phish-phone-screen ${compromised ? 'compromised' : ''}`}>
            <PhoneStatusBar />
            {children}
            <div className="war-phish-phone-home-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PcFrame({ title, children, alert }) {
  return (
    <div className="war-phish-mobile-wrap war-student-full-pc">
      <div className="war-phish-mobile-title">{title}</div>
      <div className="war-student-pc-mock">
        <div className="war-phish-pc-bar">
          <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
          <span>student@auxilium-pc — Lab simulation</span>
        </div>
        <div className={`war-student-pc-screen ${alert ? 'alert' : ''}`}>{children}</div>
      </div>
    </div>
  )
}

function SceneWifi({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner wifi bad">
        <div className="war-student-wifi-banner bad">⚠ CREDENTIALS STOLEN</div>
        <div className="war-student-captive-portal">
          <p>Login successful — redirecting…</p>
          <code>password sent to attacker</code>
        </div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner wifi safe">
        <div className="war-student-wifi-banner safe">✓ SECURED NETWORK</div>
        <p>Connected to Auxilium_Official WPA2</p>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner wifi">
      <div className="war-student-wifi-head">Wi‑Fi Networks</div>
      <ul className="war-student-wifi-list">
        <li className="evil pulse"><span>📶</span><div><strong>Auxilium_Free_WiFi</strong><small>Open · No lock</small></div></li>
        <li className="safe-net"><span>🔒</span><div><strong>Auxilium_Official</strong><small>WPA2 · Secured</small></div></li>
        <li><span>📶</span><div><strong>Jio_Public</strong><small>Open</small></div></li>
      </ul>
      <div className="war-student-captive-portal dim">
        <small>Fake login page waiting…</small>
      </div>
    </div>
  )
}

function SceneRansomware({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner ransomware bad">
        <div className="war-student-ransom-note">
          <h3>🔒 YOUR FILES ARE ENCRYPTED</h3>
          <p>Project_Report.exe ran ransomware</p>
          <ul><li>Notes.encrypted</li><li>Photos.encrypted</li><li>README_RANSOM.txt</li></ul>
          <code>Pay 0.5 BTC to decrypt</code>
        </div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner ransomware safe">
        <div className="war-student-email-client safe">
          <strong>✓ Attachment quarantined by IT</strong>
          <p>Project_Report.exe blocked — EDR alert sent</p>
        </div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner ransomware">
      <div className="war-student-email-client">
        <div className="war-student-email-row from">From: ict-support@auxilium-edu.com</div>
        <div className="war-student-email-row subj">Subject: Project Report URGENT — Submit Today</div>
        <div className="war-student-email-attach pulse">📎 Project_Report.exe <span>842 KB</span></div>
      </div>
    </div>
  )
}

function SceneQr({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner qr bad">
        <div className="war-student-upi bad"><span>₹50 sent</span><strong>To: Rahul_Kumar_99</strong><small>Wrong account!</small></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner qr safe">
        <div className="war-student-upi safe"><span>Verified ✓</span><strong>Canteen_Auxilium</strong><small>Legitimate merchant</small></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner qr">
      <div className="war-student-qr-scan">
        <div className="war-student-qr-box pulse"><span>▦</span></div>
        <p>Scan QR at Canteen</p>
        <small>Amount: ₹50 — Check payee name!</small>
      </div>
    </div>
  )
}

function SceneSim({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner sim bad">
        <div className="war-student-call-screen bad">
          <span className="pulse">📵</span><strong>SIM NOT REGISTERED</strong>
          <p>Your number is dead — OTP going to attacker</p>
        </div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner sim safe">
        <div className="war-student-call-screen safe"><span>✓</span><strong>Scam blocked</strong><p>Called operator directly</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner sim">
      <div className="war-student-call-screen incoming pulse">
        <span>📞</span><strong>Airtel Verification</strong><small>+91 1800-XXX-XXXX</small>
        <p>SIM upgrade required — share Aadhaar</p>
      </div>
    </div>
  )
}

function SceneWhatsapp({ viewState, variant }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner wa bad">
        <div className="war-student-wa-chat">
          <div className="war-student-wa-bubble them">Urgent ₹5000 Google Pay pannunga!</div>
          <div className="war-student-wa-bubble me bad">₹5000 sent ✓</div>
          <p className="bad-label">Money lost to scammer</p>
        </div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner wa safe">
        <div className="war-student-wa-chat">
          <div className="war-student-wa-bubble them">Urgent ₹5000 venum</div>
          <div className="war-student-wa-bubble me safe">Video call first ✓</div>
        </div>
      </div>
    )
  }
  if (variant === 'job') {
    return (
      <div className="war-student-scene-inner wa job">
        <div className="war-student-wa-head">Amazon WFH Jobs</div>
        <div className="war-student-wa-chat">
          <div className="war-student-wa-bubble them">Work from home ₹30,000/day!</div>
          <div className="war-student-wa-bubble them pulse">Registration fee ₹499 only via UPI</div>
        </div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner wa">
      <div className="war-student-wa-head">Mom (new number)</div>
      <div className="war-student-wa-chat">
        <div className="war-student-wa-bubble them">Amma na, new number save pannunga</div>
        <div className="war-student-wa-bubble them pulse">Urgent ₹5000 venum — Google Pay</div>
      </div>
    </div>
  )
}

function SceneUsb({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner usb bad">
        <div className="war-student-autorun bad"><span>💾</span><strong>Autorun malware installed!</strong><p>Keylogger active</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner usb safe">
        <div className="war-student-autorun safe"><span>✓</span><strong>USB handed to IT</strong><p>Never plugged in</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner usb">
      <div className="war-student-usb-found pulse">
        <span>💾</span><strong>Exam_Answers_2026</strong><small>Found near Lab 204 — OPEN ME</small>
      </div>
    </div>
  )
}

function SceneKyc({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner kyc bad">
        <div className="war-student-fake-site bad"><h4>uidai-kyc-update.in</h4><p>Identity stolen</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner kyc safe">
        <div className="war-student-fake-site safe"><p>Closed fake site ✓</p><small>Use uidai.gov.in only</small></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner kyc">
      <div className="war-student-fake-site pulse">
        <h4>🪪 UIDAI KYC Update</h4>
        <p>uidai-kyc-update.in</p>
        <input readOnly placeholder="Aadhaar number" />
        <input readOnly placeholder="OTP" />
      </div>
    </div>
  )
}

function SceneDeepfake({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner deepfake bad">
        <div className="war-student-call-screen bad"><span>🎙️</span><strong>₹2000 UPI sent</strong><p>Deepfake voice scam</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner deepfake safe">
        <div className="war-student-call-screen safe"><span>✓</span><strong>Verified in office</strong><p>Real principal knows nothing</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner deepfake">
      <div className="war-student-call-screen incoming">
        <span className="pulse">🎙️</span><strong>Principal Calling…</strong>
        <div className="war-student-waveform"><span /><span /><span /><span /><span /></div>
        <p>AI voice: "Pay fees NOW via UPI"</p>
      </div>
    </div>
  )
}

function SceneDdos({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner ddos bad">
        <div className="war-student-503 bad"><h2>503</h2><p>Service Unavailable — still down</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner ddos safe">
        <div className="war-student-503 safe"><h2>✓</h2><p>CDN + rate limit — restored in 12 min</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner ddos">
      <div className="war-student-traffic-graph">
        <div className="war-student-traffic-bars">
          {[40, 65, 90, 100, 95, 88].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className={h > 80 ? 'spike' : ''} />
          ))}
        </div>
        <p className="pulse">2.4M requests/sec — Portal DOWN</p>
      </div>
    </div>
  )
}

function SceneOsint({ viewState, displayName }) {
  const handle = displayName.split(' ')[0]?.toLowerCase() || 'student'
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner osint bad">
        <div className="war-student-phish-email bad"><strong>Credentials stolen</strong><p>They knew your name & college</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner osint safe">
        <div className="war-student-phish-email safe"><strong>✓ Verified via official page</strong></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner osint">
      <div className="war-student-insta">
        <div className="war-student-insta-av">📸</div>
        <strong>@{handle}_auxilium</strong>
        <small>Public · College · Birthday · Pet name</small>
      </div>
      <div className="war-student-phish-email pulse">
        <small>Email inbox</small>
        <p>Hi {displayName}, your fest photo won — click link</p>
      </div>
    </div>
  )
}

function SceneCrypto({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner crypto bad">
        <div className="war-student-cpu bad"><span>⛏️</span><strong>CPU 98%</strong><p>Battery ruined — miner active</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner crypto safe">
        <div className="war-student-cpu safe"><span>✓</span><strong>Mod APK removed</strong><p>Antivirus clean</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner crypto">
      <div className="war-student-cpu pulse">
        <span>⛏️</span><strong>CPU: 98%</strong>
        <div className="war-student-cpu-bar"><div style={{ width: '98%' }} /></div>
        <small>Free Fire Mod APK · Battery draining</small>
      </div>
    </div>
  )
}

function ScenePortal({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner portal bad">
        <div className="war-student-portal-login bad"><strong>Account compromised!</strong><p>Attendance tamper attempt</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner portal safe">
        <div className="war-student-portal-login safe"><strong>✓ Login blocked</strong><p>MFA + unique password</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner portal">
      <div className="war-student-portal-login pulse">
        <h4>🎓 Auxilium College Portal</h4>
        <input readOnly value="student@college" />
        <input readOnly type="password" value="••••••••••" />
        <small>Attempt from Russia · password123 tried</small>
      </div>
    </div>
  )
}

function SceneAvpop({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner avpop bad">
        <div className="war-student-fake-av bad"><h2>REMOTE ACCESS GRANTED</h2><p>PC hijacked via fake support</p></div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner avpop safe">
        <div className="war-student-fake-av safe"><p>✓ Browser closed — Defender clean</p></div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner avpop">
      <div className="war-student-fake-av pulse">
        <h2>⚠ 847 VIRUSES FOUND!</h2>
        <p>Call Microsoft Support</p>
        <code>1800-XXX-XXXX</code>
      </div>
    </div>
  )
}

function SceneChain({ viewState }) {
  if (viewState === 'compromised') {
    return (
      <div className="war-student-scene-inner chain bad">
        <div className="war-student-wa-chat">
          <div className="war-student-wa-bubble them bad">Your account hacked too!</div>
        </div>
      </div>
    )
  }
  if (viewState === 'safe') {
    return (
      <div className="war-student-scene-inner chain safe">
        <div className="war-student-wa-chat">
          <div className="war-student-wa-bubble me safe">Called friend — account hacked ✓</div>
        </div>
      </div>
    )
  }
  return (
    <div className="war-student-scene-inner chain">
      <div className="war-student-wa-head">Class Group · 12 online</div>
      <div className="war-student-wa-chat">
        <div className="war-student-wa-bubble them pulse">Check this fest result link 👇</div>
        <small>http://auxilium-result.xyz</small>
      </div>
    </div>
  )
}

function SceneIdlePhone() {
  return (
    <div className="war-phish-phone-home">
      <div className="war-phish-wallpaper" />
      <div className="war-phish-home-clock"><strong>15:24</strong><span>Mon, 17 Aug</span></div>
      <div className="war-phish-app-grid">
        {[
          { icon: '💬', label: 'Messages', color: '#2563eb' },
          { icon: '📷', label: 'Gallery', color: '#7c3aed' },
          { icon: '📶', label: 'WiFi', color: '#059669' },
          { icon: '⚙️', label: 'Settings', color: '#64748b' },
        ].map((app) => (
          <div key={app.label} className="war-phish-app-item">
            <div className="war-phish-app-icon" style={{ background: app.color }}>{app.icon}</div>
            <span>{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SceneIdlePc() {
  return (
    <div className="war-student-pc-desktop">
      <div className="war-student-pc-icons">
        <span>📁 Files</span><span>📧 Mail</span><span>🌐 Chrome</span>
      </div>
    </div>
  )
}

const PC_SCENES = new Set(['ransomware', 'email', 'usb', 'ddos', 'portal', 'avpop'])

function renderScene(scene, viewState, displayName) {
  const props = { viewState, displayName }
  switch (scene) {
    case 'wifi': return <SceneWifi {...props} />
    case 'ransomware':
    case 'email': return <SceneRansomware {...props} />
    case 'qr': return <SceneQr {...props} />
    case 'sim': return <SceneSim {...props} />
    case 'whatsapp': return <SceneWhatsapp {...props} />
    case 'job': return <SceneWhatsapp {...props} variant="job" />
    case 'usb': return <SceneUsb {...props} />
    case 'kyc': return <SceneKyc {...props} />
    case 'deepfake': return <SceneDeepfake {...props} />
    case 'ddos': return <SceneDdos {...props} />
    case 'osint': return <SceneOsint {...props} />
    case 'crypto': return <SceneCrypto {...props} />
    case 'portal': return <ScenePortal {...props} />
    case 'avpop': return <SceneAvpop {...props} />
    case 'chain': return <SceneChain {...props} />
    default: return <SceneWifi {...props} />
  }
}

export default function WarRoomStudentVictimScreen({
  scene,
  viewState = 'active',
  displayName,
  simStarted,
}) {
  const isPc = PC_SCENES.has(scene)
  const compromised = viewState === 'compromised'
  const title = isPc
    ? `💻 VICTIM PC — ${displayName}`
    : `📱 VICTIM MOBILE — ${displayName}`

  const body = !simStarted
    ? (isPc ? <SceneIdlePc /> : <SceneIdlePhone />)
    : renderScene(scene, viewState, displayName)

  if (isPc) {
    return (
      <PcFrame title={title} alert={compromised}>
        {body}
      </PcFrame>
    )
  }

  return (
    <PhoneFrame title={title} compromised={compromised}>
      {body}
    </PhoneFrame>
  )
}

export function getScenarioDevice(scene) {
  return PC_SCENES.has(scene) ? 'pc' : 'phone'
}

export function getAttackerTool(scene, scenario) {
  const tools = {
    wifi: { kit: 'Evil Twin AP Toolkit v2', action: 'Deploy Rogue AP', payload: 'SSID: Auxilium_Free_WiFi · Captive portal ON' },
    ransomware: { kit: 'Ransomware Builder', action: 'Send Spear-Phish Email', payload: 'Attachment: Project_Report.exe' },
    email: { kit: 'Ransomware Builder', action: 'Send Spear-Phish Email', payload: 'Attachment: Project_Report.exe' },
    qr: { kit: 'Fake UPI QR Generator', action: 'Paste Fake QR Sticker', payload: 'Payee: Rahul_Kumar_99' },
    sim: { kit: 'SIM Swap Kit', action: 'Spoof Caller ID', payload: 'Airtel Verification Dept' },
    whatsapp: { kit: 'WhatsApp Impersonator', action: 'Send "Hi Mom" Message', payload: 'New number · ₹5000 UPI' },
    job: { kit: 'Job Scam Bot', action: 'Blast WFH Offer', payload: 'Amazon WFH · ₹499 fee' },
    usb: { kit: 'USB Drop Payload', action: 'Drop Infected USB', payload: 'Label: Exam_Answers_2026' },
    kyc: { kit: 'Phishing Page Clone', action: 'Send KYC SMS', payload: 'uidai-kyc-update.in' },
    deepfake: { kit: 'AI Voice Clone', action: 'Initiate Deepfake Call', payload: 'Principal voice model' },
    ddos: { kit: 'Botnet Controller', action: 'Launch SYN Flood', payload: '50,000 IPs → college server' },
    osint: { kit: 'OSINT Harvester', action: 'Scrape Public Profile', payload: 'Instagram → spear-phish email' },
    crypto: { kit: 'Cryptojacker APK', action: 'Distribute Mod APK', payload: 'CoinHive miner embedded' },
    portal: { kit: 'Credential Stuffing', action: 'Try Leaked Password', payload: 'password123 from breach' },
    avpop: { kit: 'Scareware Kit', action: 'Trigger Malvertising', payload: '847 viruses pop-up' },
    chain: { kit: 'Chain Phish Bot', action: 'Hijack Account → Spread', payload: 'Class group message' },
  }
  return tools[scene] || { kit: scenario?.title || 'Attack Kit', action: 'Launch Attack', payload: scenario?.attacker || '' }
}

export function getScenarioTheory(scenario) {
  return [
    { id: 'attack', icon: scenario.icon, title: 'Attack Method', text: scenario.attacker },
    { id: 'trick', icon: '⚠️', title: 'Social Trick', text: scenario.victim },
    { id: 'impact', icon: '💥', title: 'Real Impact', text: scenario.impact || scenario.victim },
    { id: 'protect', icon: '🛡️', title: 'Protection', text: scenario.defender },
  ]
}
