let speaking = false

export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSpeech() {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  speaking = false
}

function pickVoice(langPrefix) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === langPrefix) ||
    voices.find((v) => v.lang.startsWith(langPrefix.split('-')[0])) ||
    null
  )
}

export function speakText(text, lang = 'en-IN') {
  return new Promise((resolve) => {
    if (!isTTSSupported() || !text?.trim()) {
      resolve()
      return
    }
    stopSpeech()
    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = lang
    utterance.rate = 0.92
    utterance.pitch = 1
    const voice = pickVoice(lang)
    if (voice) utterance.voice = voice
    utterance.onend = () => {
      speaking = false
      resolve()
    }
    utterance.onerror = () => {
      speaking = false
      resolve()
    }
    speaking = true
    window.speechSynthesis.speak(utterance)
  })
}

export async function speakBilingual(en, ta, mode = 'en') {
  if (mode === 'off' || !isTTSSupported()) return
  if (mode === 'en' || mode === 'both') await speakText(en, 'en-IN')
  if (mode === 'ta' || mode === 'both') await speakText(ta, 'ta-IN')
}

export function preloadVoices() {
  if (!isTTSSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}
