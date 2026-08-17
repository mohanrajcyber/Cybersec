export const HACK_SMS_TEMPLATE =
  'ALERT: Suspicious activity on your device detected. Install Android Security Patch immediately: http://mobile-fix-update.in/apk?id=7742 — Do NOT delay. -Google Security'

export const HACK_FAKE_URL = 'http://mobile-fix-update.in/apk?id=7742'

export const HACK_VICTIM = {
  name: 'Student',
  phone: '9876543210',
}

export const HACK_PERMISSIONS = [
  { id: 'contacts', icon: '👥', label: 'Contacts', desc: 'Read all contacts' },
  { id: 'camera', icon: '📷', label: 'Camera', desc: 'Take photos & record video' },
  { id: 'mic', icon: '🎤', label: 'Microphone', desc: 'Record audio anytime' },
  { id: 'sms', icon: '💬', label: 'SMS', desc: 'Read & send messages' },
  { id: 'location', icon: '📍', label: 'Location', desc: 'Track GPS 24/7' },
  { id: 'storage', icon: '📁', label: 'Storage', desc: 'Access photos & files' },
]

export const HACK_STOLEN_DATA = {
  contacts: 847,
  photos: 2341,
  sms: 156,
  location: '10.7632° N, 78.8123° E · Pudukkottai',
}

export const HACK_THEORY = [
  {
    id: 'attack',
    icon: '📩',
    title: 'Attack Method',
    text: 'SMS sends malicious link — fake "security update" or APK installs spyware on phone.',
  },
  {
    id: 'trick',
    icon: '⚠️',
    title: 'Social Trick',
    text: '"Your phone is infected" or "You won a prize" — urgent link click panra maari force pannuvanga.',
  },
  {
    id: 'impact',
    icon: '📱',
    title: 'Real Impact',
    text: 'Attacker gets full phone access — contacts, photos, bank OTP SMS, camera, live location.',
  },
  {
    id: 'protect',
    icon: '🛡️',
    title: 'Protection',
    text: 'Never install apps from SMS links. Use Play Store only. Enable 2FA. Check app permissions.',
  },
]

export const HACK_STEPS = [
  { id: 'idle', label: 'Setup' },
  { id: 'sent', label: 'SMS Sent' },
  { id: 'opened', label: 'SMS Opened' },
  { id: 'install', label: 'Fake App' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'hacked', label: 'Phone Hacked' },
  { id: 'safe', label: 'Blocked' },
]

export const STEP_ORDER = ['idle', 'sent', 'opened', 'install', 'permissions', 'hacked', 'safe']
