/** Build login URL encoded in QR codes for class quick-login */
export function buildStudentLoginUrl(username, password, baseUrl) {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const params = new URLSearchParams({
    u: username,
    p: password,
    qr: '1',
  })
  return `${origin}/login?${params.toString()}`
}

export async function generateQrDataUrl(text) {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(text, {
    width: 220,
    margin: 2,
    color: { dark: '#1e3a8a', light: '#ffffff' },
  })
}
