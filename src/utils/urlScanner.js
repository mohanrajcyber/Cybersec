/** Client-side URL phishing / legitimacy analysis for training */
const KNOWN_BRANDS = [
  { brand: 'google', domains: ['google.com', 'google.co.in', 'gmail.com'] },
  { brand: 'auxilium', domains: ['auxiliumcollege.ac.in', 'aascw.ac.in'] },
  { brand: 'facebook', domains: ['facebook.com', 'fb.com'] },
  { brand: 'instagram', domains: ['instagram.com'] },
  { brand: 'whatsapp', domains: ['whatsapp.com', 'wa.me'] },
  { brand: 'paytm', domains: ['paytm.com'] },
  { brand: 'phonepe', domains: ['phonepe.com'] },
  { brand: 'amazon', domains: ['amazon.in', 'amazon.com'] },
  { brand: 'sbi', domains: ['onlinesbi.sbi', 'sbi.co.in'] },
]

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.click', '.loan', '.work', '.tk', '.ml', '.ga', '.cf']

function hasHomoglyph(s) {
  return /[0оО]/.test(s.replace(/o/gi, '')) === false && /g00gle|paytm|faceb00k|micr0soft|amaz0n|goog1e|paypa1/i.test(s)
    || /[il1|0o]/i.test(s) && /g00g|faceb00k|payt m|micr0s0ft/i.test(s.replace(/\s/g, ''))
    || /\d/.test(s.split('.')[0]?.replace(/^www/, '') || '')
}

function normalizeHost(input) {
  let s = input.trim()
  if (!s) return null
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`
  try {
    const u = new URL(s)
    return u
  } catch {
    return null
  }
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function getRegisteredDomain(host) {
  const parts = host.replace(/^www\./, '').split('.')
  if (parts.length <= 2) return parts.join('.')
  const twoPartTlds = ['co.in', 'ac.in', 'gov.in', 'org.in', 'edu.in', 'com.au']
  const tail = parts.slice(-2).join('.')
  if (twoPartTlds.includes(tail) && parts.length >= 3) {
    return parts.slice(-3).join('.')
  }
  return parts.slice(-2).join('.')
}

function checkBrandImpersonation(host) {
  const reg = getRegisteredDomain(host)
  for (const { brand, domains } of KNOWN_BRANDS) {
    for (const legit of domains) {
      if (reg === legit || host.endsWith(`.${legit}`)) {
        return { impersonating: false, brand, legitDomain: legit }
      }
      const brandInHost = host.includes(brand)
      const looksLike = levenshtein(reg.replace(/\.(com|in|ac\.in).*/, ''), brand) <= 2
      if (brandInHost && reg !== legit && !host.endsWith(legit)) {
        return {
          impersonating: true,
          brand,
          legitDomain: legit,
          reason: `Domain contains "${brand}" but is NOT the official ${legit}`,
        }
      }
      if (looksLike && reg !== legit) {
        return {
          impersonating: true,
          brand,
          legitDomain: legit,
          reason: `Looks like typosquatting of ${legit}`,
        }
      }
    }
  }
  return null
}

export function analyzeUrl(input) {
  const reasons = []
  const checks = []

  if (!input?.trim()) {
    return { verdict: 'invalid', label: '❌ Enter a URL', ok: false, reasons: ['Empty input'], checks: [] }
  }

  if (input.includes('@')) {
    reasons.push('Contains @ symbol — trick to hide real destination (credential phishing)')
    checks.push({ label: '@ Symbol', ok: false, value: 'Suspicious — URL may redirect elsewhere' })
  }

  const parsed = normalizeHost(input.split('@').pop())
  if (!parsed) {
    return { verdict: 'invalid', label: '❌ Invalid URL', ok: false, reasons: ['Could not parse URL'], checks: [] }
  }

  const host = parsed.hostname.toLowerCase()
  const isHttps = parsed.protocol === 'https:'
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host)

  checks.push({
    label: 'Protocol',
    ok: isHttps,
    value: isHttps ? 'HTTPS (encrypted)' : 'HTTP only — no padlock, data can be stolen',
  })
  if (!isHttps) reasons.push('No HTTPS — passwords and OTP can be intercepted')

  if (isIp) {
    reasons.push('Uses raw IP address instead of domain — common in phishing links')
    checks.push({ label: 'Hostname', ok: false, value: `Raw IP ${host} — verify domain name instead` })
  } else {
    checks.push({ label: 'Hostname', ok: true, value: host })
  }

  const regDomain = getRegisteredDomain(host)
  const dotCount = host.split('.').length
  if (dotCount > 3 && !host.endsWith('.co.in') && !host.endsWith('.ac.in')) {
    const suspiciousSub = host.includes('.login.') || host.includes('.secure.') || host.includes('.verify.')
    if (suspiciousSub) {
      reasons.push(`Extra fake subdomain (${host}) — real sites use simple URLs`)
      checks.push({ label: 'Subdomain', ok: false, value: 'Fake path/subdomain pattern detected' })
    }
  }

  const brandHit = checkBrandImpersonation(host)
  if (brandHit?.impersonating) {
    reasons.push(brandHit.reason)
    checks.push({ label: 'Brand Check', ok: false, value: `FAKE — official site is ${brandHit.legitDomain}` })
  } else if (brandHit?.legitDomain) {
    checks.push({ label: 'Brand Check', ok: true, value: `Matches official ${brandHit.legitDomain}` })
  }

  if (hasHomoglyph(host) || /g00gle|paypa1|faceb00k|micr0soft|goog1e/i.test(host)) {
    reasons.push('Homoglyph / character substitution detected (e.g. g00gle instead of google)')
    checks.push({ label: 'Typosquatting', ok: false, value: 'Look-alike spelling — FAKE' })
  }

  const tld = '.' + regDomain.split('.').slice(1).join('.')
  if (SUSPICIOUS_TLDS.some((t) => host.endsWith(t))) {
    reasons.push(`Suspicious TLD (${tld}) often used in scam sites`)
    checks.push({ label: 'TLD Risk', ok: false, value: `Risky extension ${tld}` })
  }

  if (parsed.pathname.length > 40 || (parsed.pathname.match(/\//g) || []).length > 4) {
    reasons.push('Very long URL path — may hide malicious redirect')
    checks.push({ label: 'URL Length', ok: false, value: 'Unusually long path' })
  }

  let verdict = 'real'
  let label = '✅ REAL — Looks Legitimate'
  let ok = true

  if (reasons.length >= 2 || brandHit?.impersonating || hasHomoglyph(host)) {
    verdict = 'fake'
    label = '❌ FAKE / PHISHING — Do NOT Click'
    ok = false
  } else if (reasons.length === 1 || !isHttps || isIp) {
    verdict = 'suspicious'
    label = '⚠️ SUSPICIOUS — Verify Before Clicking'
    ok = false
  }

  if (brandHit?.legitDomain && regDomain === brandHit.legitDomain && isHttps && reasons.length === 0) {
    verdict = 'real'
    label = '✅ REAL — Official Website'
    ok = true
  }

  return {
    verdict,
    label,
    ok,
    host,
    domain: regDomain,
    protocol: parsed.protocol,
    reasons: reasons.length ? reasons : ['No major red flags — still verify sender and use official app'],
    checks,
    parsedUrl: parsed.href,
  }
}

export const URL_SCANNER_SAMPLES = [
  { url: 'https://www.google.com', note: 'Real — official Google' },
  { url: 'https://g00gle.com/login', note: 'Fake — homoglyph typosquatting' },
  { url: 'https://auxiliumcollege.ac.in', note: 'Real — official college site' },
  { url: 'http://auxiliumcollege.ac.in.login.xyz/verify', note: 'Fake — brand name hidden in subdomain' },
  { url: 'https://www.auxiliumcollege.ac.in@evil-site.com/', note: 'Fake — @ hides real destination' },
  { url: 'http://93.127.173.35/login', note: 'Suspicious — raw IP link' },
]
