export async function dnsLookup(name, type) {
  const res = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`
  )
  if (!res.ok) throw new Error('DNS lookup failed')
  return res.json()
}

export function formatDnsAnswers(data) {
  if (!data?.Answer?.length) return []
  return data.Answer.map((a) => {
    const parts = a.data.split(' ')
    return parts.length > 1 ? parts[parts.length - 1] : a.data
  })
}
