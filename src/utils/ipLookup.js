import { dnsLookup, formatDnsAnswers } from './infoLookupDns'

export function isValidIPv4(ip) {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) return false
  return parts.every((p) => {
    const n = Number(p)
    return Number.isInteger(n) && n >= 0 && n <= 255 && String(n) === p
  })
}

export function parseIpInput(input) {
  const s = input.trim().replace(/^https?:\/\//, '').split('/')[0].split(':')[0]
  if (isValidIPv4(s)) return s
  return null
}

function ipv4ToPtr(ip) {
  return `${ip.split('.').reverse().join('.')}.in-addr.arpa`
}

function ipClass(ip) {
  const [a, b] = ip.split('.').map(Number)
  if (a === 10) return 'Private (RFC1918)'
  if (a === 172 && b >= 16 && b <= 31) return 'Private (RFC1918)'
  if (a === 192 && b === 168) return 'Private (RFC1918)'
  if (a === 127) return 'Loopback (localhost)'
  if (a === 0) return 'Reserved / Invalid'
  if (a >= 224) return 'Multicast / Reserved'
  return 'Public Internet'
}

async function reverseDns(ip) {
  try {
    const data = await dnsLookup(ipv4ToPtr(ip), 'PTR')
    const names = formatDnsAnswers(data).map((h) => h.replace(/\.$/, ''))
    return names[0] || null
  } catch {
    return null
  }
}

async function forwardDns(hostname) {
  try {
    const data = await dnsLookup(hostname, 'A')
    return formatDnsAnswers(data)
  } catch {
    return []
  }
}

async function probeDirectBrowse(ip) {
  for (const proto of ['https', 'http']) {
    try {
      await fetch(`${proto}://${ip}`, {
        mode: 'no-cors',
        signal: AbortSignal.timeout(4500),
      })
      return { browsable: true, protocol: proto.toUpperCase() }
    } catch {
      /* try next */
    }
  }
  return {
    browsable: false,
    reason: 'Connection reset / refused — normal for hosting servers that require a domain name',
  }
}

function buildVerdict({ ip, ipType, ptr, forwardMatch, browsable, linkedDomain }) {
  if (ipType.startsWith('Private') || ipType.startsWith('Loopback') || ipType.startsWith('Reserved')) {
    return {
      code: 'fake-local',
      label: '❌ NOT PUBLIC — Local / Private IP',
      ok: false,
      detail: 'This IP is not on the public internet. You cannot reach external websites with private IPs.',
    }
  }

  if (forwardMatch && ptr) {
    return {
      code: 'real-verified',
      label: '✅ REAL — Verified Server IP',
      ok: true,
      detail: browsable
        ? `Reverse DNS confirms ${ptr}. IP responds in browser — likely legitimate.`
        : `Reverse DNS confirms ${ptr}. Real server, but use https://${linkedDomain || ptr} instead of raw IP.`,
    }
  }

  if (ptr) {
    return {
      code: 'real-hosting',
      label: '✅ REAL IP — Use Domain Name to Open',
      ok: true,
      detail: `Server hostname: ${ptr}. Hosting/CDN blocks direct IP access — always open the website URL, not the IP.`,
    }
  }

  if (browsable) {
    return {
      code: 'real-open',
      label: '✅ REAL — IP Responds Directly',
      ok: true,
      detail: 'This IP accepts browser connections. Still verify it belongs to the site you expect.',
    }
  }

  return {
    code: 'fake-unverified',
    label: '⚠️ UNVERIFIED — Cannot Open in Browser',
    ok: false,
    detail: 'No reverse DNS found and direct browser access failed. Could be old DNS, firewall, or wrong IP. Verify using the official domain name.',
  }
}

export async function analyzeIp(ip, contextDomain) {
  const ipType = ipClass(ip)
  const [ptr, browse] = await Promise.all([
    reverseDns(ip),
    probeDirectBrowse(ip),
  ])

  let forwardMatch = false
  let linkedDomain = contextDomain || null

  if (ptr) {
    const forwardIps = await forwardDns(ptr)
    forwardMatch = forwardIps.includes(ip)
    if (!linkedDomain) linkedDomain = ptr.replace(/^www\./, '')
  }

  if (contextDomain && !forwardMatch) {
    try {
      const domainIps = await forwardDns(parseDomainSafe(contextDomain))
      if (domainIps.includes(ip)) {
        forwardMatch = true
        linkedDomain = contextDomain
      }
    } catch {
      /* optional */
    }
  }

  const verdict = buildVerdict({ ip, ipType, ptr, forwardMatch, browsable: browse.browsable, linkedDomain })

  return {
    ip,
    ipType,
    ptr,
    forwardMatch,
    linkedDomain,
    browsable: browse.browsable,
    browseProtocol: browse.protocol,
    browseFailReason: browse.reason,
    verdict,
  }
}

function parseDomainSafe(d) {
  return d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

export async function lookupIp(input, contextDomain) {
  const ip = parseIpInput(input)
  if (!ip) {
    return { ok: false, error: 'Enter a valid IPv4 address — e.g. 93.127.173.35' }
  }

  const check = await analyzeIp(ip, contextDomain)
  const { verdict } = check

  const security = [
    {
      label: 'Browser Test',
      value: check.browsable
        ? `Opens in browser via ${check.browseProtocol} — IP is reachable`
        : `Cannot open directly — ${check.browseFailReason}`,
      ok: check.browsable,
    },
    {
      label: 'Reverse DNS (PTR)',
      value: check.ptr || 'No PTR record — common on shared hosting',
      ok: Boolean(check.ptr),
    },
    {
      label: 'Forward DNS Match',
      value: check.forwardMatch
        ? `Confirmed — IP belongs to ${check.linkedDomain}`
        : 'Could not confirm round-trip DNS (still may be real hosting IP)',
      ok: check.forwardMatch,
    },
    {
      label: 'Safe Access Tip',
      value: check.linkedDomain
        ? `Always visit https://${check.linkedDomain} — never trust raw IP links in messages`
        : 'Never open unknown IP links — attackers hide phishing sites behind numbers',
      ok: true,
    },
  ]

  return {
    ok: true,
    type: 'ip',
    query: input,
    title: ip,
    description: verdict.label,
    summary: verdict.detail,
    verdict: verdict.code,
    verdictOk: verdict.ok,
    url: check.linkedDomain ? `https://${check.linkedDomain}` : undefined,
    source: 'Google Public DNS + live browser probe',
    ipChecks: [check],
    facts: [
      { label: 'IP Address', value: ip },
      { label: 'IP Type', value: check.ipType },
      { label: 'Reverse DNS', value: check.ptr || 'None' },
      { label: 'Linked Domain', value: check.linkedDomain || 'Unknown' },
      { label: 'Direct Browser', value: check.browsable ? 'Yes — opens' : 'No — connection reset/failed' },
      { label: 'Verdict', value: verdict.label },
    ],
    security,
  }
}

export async function analyzeIpList(ips, contextDomain) {
  const unique = [...new Set(ips.filter(isValidIPv4))]
  return Promise.all(unique.map((ip) => analyzeIp(ip, contextDomain)))
}
