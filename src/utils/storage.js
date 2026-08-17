export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return { ok: true }
  } catch (err) {
    const quota =
      err?.name === 'QuotaExceededError' ||
      err?.code === 22 ||
      /quota/i.test(err?.message || '')
    return {
      ok: false,
      error: quota
        ? 'Storage full — too many student records. Ask your trainer to clear old data or export backups.'
        : 'Could not save data. Please try again.',
    }
  }
}

export function safeGetItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ?? fallback
  } catch {
    return fallback
  }
}
