import { getPasswordStrength } from '../utils/passwordStrength'

export default function PasswordStrengthBox({
  password,
  showText = true,
  compact = false,
  variant = 'full',
}) {
  if (!password || password === '—') {
    if (variant === 'password') return <span className="pw-strength-empty">—</span>
    if (variant === 'strength') return <span className="pw-strength-empty">—</span>
    return <span className="pw-strength-box pw-strength-box--empty">—</span>
  }

  const strength = getPasswordStrength(password)

  if (variant === 'password') {
    return <code className="pw-cell">{password}</code>
  }

  if (variant === 'strength') {
    return (
      <span className={`pw-strength-inline pw-strength-inline--${strength.cls}`}>
        <span className="pw-strength-bars">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`pw-strength-bar ${i < strength.bars ? `on s${strength.score}` : ''}`} />
          ))}
        </span>
        {showText && (
          <span className={`pw-strength-label strength-${strength.cls}`}>{strength.text}</span>
        )}
      </span>
    )
  }

  return (
    <div className={`pw-strength-box pw-strength-box--${strength.cls} ${compact ? 'pw-strength-box--compact' : ''}`}>
      <code className="pw-strength-value">{password}</code>
      <div className="pw-strength-meta">
        <div className="pw-strength-bars">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`pw-strength-bar ${i < strength.bars ? `on s${strength.score}` : ''}`} />
          ))}
        </div>
        {showText && (
          <span className={`pw-strength-label strength-${strength.cls}`}>{strength.text}</span>
        )}
      </div>
    </div>
  )
}
