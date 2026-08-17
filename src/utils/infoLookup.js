import { matchCollegeDirectory, matchCollegeByDomain, collegeToResult } from '../data/collegeDirectory'
import { dnsLookup, formatDnsAnswers } from './infoLookupDns'
import { parseIpInput, lookupIp, analyzeIpList } from './ipLookup'

const WIKI_API = 'https://en.wikipedia.org/w/api.php'
const WIKI_REST = 'https://en.wikipedia.org/api/rest_v1/page/summary'

export function parseDomain(input) {
  let s = input.trim().toLowerCase()
  if (!s) return ''
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0]
  return s.replace(/[^a-z0-9.-]/g, '')
}

function wikiTitleUrl(title) {
  return `${WIKI_REST}/${encodeURIComponent(title.replace(/ /g, '_'))}`
}

async function wikiSummaryByTitle(title) {
  const res = await fetch(wikiTitleUrl(title))
  if (!res.ok) return null
  const data = await res.json()
  if (data.type === 'disambiguation') return null
  return data
}

async function wikiQuerySearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: '5',
    prop: 'pageprops',
    ppprop: 'disambiguation',
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`${WIKI_API}?${params}`)
  const json = await res.json()
  const pages = json.query?.pages
  if (!pages) return null

  for (const page of Object.values(pages)) {
    if (page.pageprops?.disambiguation) continue
    const summary = await wikiSummaryByTitle(page.title)
    if (summary) return { ...summary, matchedTitle: page.title }
  }
  return null
}

export async function wikiSearch(query) {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: '5',
    namespace: '0',
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`${WIKI_API}?${params}`)
  const [, titles] = await res.json()

  if (titles?.length) {
    for (const title of titles) {
      const summary = await wikiSummaryByTitle(title)
      if (summary) return { ...summary, matchedTitle: title }
    }
  }

  return wikiQuerySearch(query)
}

async function enrichWithDns(result) {
  const domain = parseDomain(result.website || result.url || result.domain || '')
  if (!domain || !domain.includes('.')) return result

  try {
    const [aRec, mxRec] = await Promise.allSettled([
      dnsLookup(domain, 'A'),
      dnsLookup(domain, 'MX'),
    ])
    const ips = aRec.status === 'fulfilled' ? formatDnsAnswers(aRec.value) : []
    const mx = mxRec.status === 'fulfilled' ? formatDnsAnswers(mxRec.value) : []

    if (ips.length) {
      result.ipChecks = await analyzeIpList(ips.slice(0, 3), domain)
    }

    const extra = []
    if (ips.length) {
      extra.push({
        label: 'Website IP (live DNS)',
        value: ips.slice(0, 2).join(', '),
        hint: 'Tap IP tab to check Real vs Fake',
      })
    }
    if (mx.length) extra.push({ label: 'Mail Server (MX)', value: mx[0] })

    if (extra.length) {
      result.facts = [...(result.facts || []), ...extra]
      result.source = `${result.source} + live DNS`
    }
  } catch {
    /* DNS optional */
  }
  return result
}

function buildCollegeQueries(name) {
  const base = name.trim()
  const short = base
    .replace(/\bfor women\b/gi, '')
    .replace(/\barts and science\b/gi, 'college')
    .replace(/\s+/g, ' ')
    .trim()

  return [...new Set([
    base,
    short,
    `${base} Tamil Nadu`,
    `${base} India`,
    `${short} Tamil Nadu`,
    `${short} India`,
    `${base.replace(/\bcollege\b/gi, '').trim()} college Tamil Nadu`,
  ])].filter(Boolean)
}

function buildCollegeFacts(wiki) {
  const facts = []
  if (wiki.description) facts.push({ label: 'Type', value: wiki.description })
  if (wiki.coordinates?.lat) {
    facts.push({
      label: 'Coordinates',
      value: `${wiki.coordinates.lat.toFixed(2)}°N, ${Math.abs(wiki.coordinates.lon).toFixed(2)}°E`,
    })
  }
  facts.push({ label: 'Source', value: 'Wikipedia — publicly verified encyclopedia' })
  return facts
}

export async function lookupCollege(name) {
  const directoryHit = matchCollegeDirectory(name)
  if (directoryHit) {
    let result = collegeToResult(directoryHit, name)

    if (directoryHit.wikiTitle) {
      const wiki = await wikiSummaryByTitle(directoryHit.wikiTitle)
      if (wiki?.thumbnail?.source) result.thumbnail = wiki.thumbnail.source
    }

    result = await enrichWithDns(result)
    return result
  }

  const queries = buildCollegeQueries(name)
  let wiki = null
  for (const q of queries) {
    wiki = await wikiSearch(q)
    if (wiki) break
  }

  if (!wiki) {
    return {
      ok: false,
      error: 'No match found. Try: short name (e.g. "Auxilium Madurai"), city name, or official website domain.',
    }
  }

  return enrichWithDns({
    ok: true,
    type: 'college',
    query: name,
    title: wiki.title,
    description: wiki.description || 'Educational institution',
    summary: wiki.extract,
    thumbnail: wiki.thumbnail?.source,
    url: wiki.content_urls?.desktop?.page,
    source: 'Wikipedia (live)',
    facts: buildCollegeFacts(wiki),
  })
}

export async function lookupProduct(name) {
  const wiki = await wikiSearch(name.trim())
  if (!wiki) return { ok: false, error: 'No public product information found. Try brand + product name.' }

  return {
    ok: true,
    type: 'product',
    query: name,
    title: wiki.title,
    description: wiki.description || 'Product / Technology',
    summary: wiki.extract,
    thumbnail: wiki.thumbnail?.source,
    url: wiki.content_urls?.desktop?.page,
    source: 'Wikipedia (live)',
    facts: [
      { label: 'Category', value: wiki.description || 'Technology product' },
      { label: 'Full name', value: wiki.title },
      { label: 'Source', value: 'Wikipedia — real public data' },
    ],
  }
}

export async function lookupWebsite(input) {
  const domain = parseDomain(input)
  if (!domain || !domain.includes('.')) {
    return { ok: false, error: 'Enter a valid website — e.g. google.com or https://example.org' }
  }

  const directoryHit = matchCollegeByDomain(domain)
  if (directoryHit) {
    let result = collegeToResult(directoryHit, domain)
    result.type = 'college'
    result = await enrichWithDns(result)
    return result
  }

  const [aRec, aaaaRec, mxRec, nsRec] = await Promise.allSettled([
    dnsLookup(domain, 'A'),
    dnsLookup(domain, 'AAAA'),
    dnsLookup(domain, 'MX'),
    dnsLookup(domain, 'NS'),
  ])

  const ips = aRec.status === 'fulfilled' ? formatDnsAnswers(aRec.value) : []
  const ipv6 = aaaaRec.status === 'fulfilled' ? formatDnsAnswers(aaaaRec.value) : []
  const mx = mxRec.status === 'fulfilled' ? formatDnsAnswers(mxRec.value) : []
  const ns = nsRec.status === 'fulfilled' ? formatDnsAnswers(nsRec.value) : []

  const ipChecks = ips.length ? await analyzeIpList(ips.slice(0, 3), domain) : []

  const brand = domain.split('.')[0]
  const wiki = await wikiSearch(brand)

  const security = []
  if (ips.length) security.push({ label: 'DNS Status', value: 'Domain resolves — active on the internet', ok: true })
  else security.push({ label: 'DNS Status', value: 'No A record found — domain may be inactive or misspelled', ok: false })
  security.push({ label: 'HTTPS Tip', value: 'Always check for padlock icon — use https:// when visiting', ok: true })
  security.push({ label: 'Phishing Check', value: 'Verify spelling — attackers use look-alike domains (gooogle.com)', ok: true })
  if (mx.length) security.push({ label: 'Email Server', value: 'Has mail servers — can send/receive email', ok: true })

  return {
    ok: true,
    type: 'website',
    query: input,
    domain,
    title: wiki?.title || domain,
    description: wiki?.description || 'Website / Domain',
    summary: wiki?.extract || `Live DNS lookup for ${domain}. IP addresses and nameservers fetched in real-time from Google Public DNS.`,
    thumbnail: wiki?.thumbnail?.source,
    url: wiki?.content_urls?.desktop?.page || `https://${domain}`,
    source: 'Google Public DNS + Wikipedia (live)',
    facts: [
      { label: 'Domain', value: domain },
      { label: 'IPv4 Address', value: ips.length ? ips.join(', ') : 'Not found' },
      { label: 'IPv6', value: ipv6.length ? ipv6.slice(0, 2).join(', ') : 'Not found' },
      { label: 'Mail (MX)', value: mx.length ? mx.slice(0, 2).join(', ') : 'None listed' },
      { label: 'Nameservers', value: ns.length ? ns.slice(0, 3).join(', ') : 'Not found' },
    ],
    ipChecks,
    security,
  }
}

export async function runLookup(type, query) {
  const q = query.trim()
  if (!q) return { ok: false, error: 'Please enter a name to search.' }

  const ip = parseIpInput(q)
  if (ip) return lookupIp(q)

  if (type === 'college') return lookupCollege(q)
  if (type === 'product') return lookupProduct(q)
  if (type === 'ip') return lookupIp(q)
  return lookupWebsite(q)
}
