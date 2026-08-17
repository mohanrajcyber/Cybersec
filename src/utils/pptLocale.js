export function pickLang(obj, lang) {
  if (obj == null) return obj
  if (typeof obj === 'object' && (Object.prototype.hasOwnProperty.call(obj, 'en') || Object.prototype.hasOwnProperty.call(obj, 'ta'))) {
    return obj[lang] ?? obj.en
  }
  if (Array.isArray(obj)) return obj.map((item) => pickLang(item, lang))
  if (typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = pickLang(v, lang)
    return out
  }
  return obj
}

export function localizeSlide(slide, lang) {
  const { id, type, visual, image } = slide
  return { id, type, visual, image, ...pickLang(slide.content, lang) }
}

export const PPT_UI = {
  en: {
    prev: '← Previous',
    next: 'Next →',
    exit: '✕ Exit',
    tamil: 'தமிழ்',
    english: 'English',
    slide: 'Slide',
  },
  ta: {
    prev: '← முந்தைய',
    next: 'அடுத்து →',
    exit: '✕ வெளியே',
    tamil: 'தமிழ்',
    english: 'English',
    slide: 'ஸ்லைடு',
  },
}
