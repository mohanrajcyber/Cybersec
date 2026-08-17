export const PHISH_SMS_TEMPLATE =
  'Dear Customer, ₹5,000 has been credited to your account. Verify now to claim: http://refund-bank-verify.in/claim?id=8821 — Do NOT ignore. -SBI Alerts'

export const PHISH_FAKE_URL = 'http://refund-bank-verify.in/claim?id=8821'

export const PHISH_VICTIM = {
  name: 'Student',
  phone: '9876543210',
  balance: 47820,
}

export const PHISH_THEORY = [
  {
    id: 'attack',
    icon: '📩',
    title: 'Attack Method',
    text: 'Fake "you received ₹5000" SMS with malicious link or QR code scan request.',
  },
  {
    id: 'trick',
    icon: '📞',
    title: 'Social Trick',
    text: 'Caller pretends to be bank officer — asks for OTP "to verify refund".',
  },
  {
    id: 'impact',
    icon: '💸',
    title: 'Real Impact',
    text: 'Victims lose entire bank balance in seconds — money transferred to mule accounts.',
  },
  {
    id: 'protect',
    icon: '🛡️',
    title: 'Protection',
    text: 'NEVER share OTP. Banks never ask OTP over phone. Verify via official app only.',
  },
]

export const PHISH_STEPS = [
  { id: 'idle', label: 'Setup', attacker: 'Configure fake SMS on attacker PC', victim: 'Victim using phone normally' },
  { id: 'sent', label: 'SMS Sent', attacker: 'Bulk SMS dispatched to victim', victim: 'Notification arrives on phone' },
  { id: 'opened', label: 'SMS Opened', attacker: 'Waiting for victim to click link', victim: 'Reads urgent refund message' },
  { id: 'site', label: 'Fake Site', attacker: 'Phishing page captures mobile number', victim: 'Fake bank refund portal opens' },
  { id: 'call', label: 'Fake Call', attacker: 'Social engineering call in progress', victim: 'Caller claims to be bank officer' },
  { id: 'otp', label: 'OTP Stolen', attacker: 'OTP captured — draining account', victim: 'Balance transferred to mule account' },
  { id: 'stolen', label: 'Money Lost', attacker: 'Funds sent to mule account', victim: 'Entire balance gone in seconds' },
  { id: 'safe', label: 'Protected', attacker: 'Attack failed — victim aware', victim: 'OTP not shared — scam blocked' },
]
