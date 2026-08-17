import zxcvbn from 'zxcvbn'

export function getPasswordStrength(password) {
  if (!password || password === '—') {
    return { text: '—', cls: 'none', score: -1, bars: 0 }
  }
  try {
    const result = zxcvbn(password)
    const score = result.score
    if (score <= 1) return { text: 'Weak', cls: 'weak', score, bars: 1, warning: result.feedback?.warning }
    if (score === 2) return { text: 'Fair', cls: 'fair', score, bars: 2 }
    if (score === 3) return { text: 'Strong', cls: 'strong', score, bars: 3 }
    return { text: 'Very Strong', cls: 'very-strong', score, bars: 4 }
  } catch {
    return { text: 'Unknown', cls: 'none', score: 0, bars: 0 }
  }
}
