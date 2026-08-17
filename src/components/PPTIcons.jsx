const S = 48

export function PPTIcon({ name, size = S, className = '' }) {
  const props = { width: size, height: size, className: `ppt-svg-icon ${className}`, viewBox: '0 0 48 48', fill: 'none' }
  switch (name) {
    case 'shield':
      return (
        <svg {...props}><path d="M24 4L8 10v12c0 10 6.5 18.5 16 22 9.5-3.5 16-12 16-22V10L24 4z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.12)"/><path d="M18 24l4 4 8-8" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"/></svg>
      )
    case 'lock':
      return (
        <svg {...props}><rect x="12" y="20" width="24" height="20" rx="3" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M16 20v-4a8 8 0 0116 0v4" stroke="#00ff88" strokeWidth="2"/><circle cx="24" cy="30" r="3" fill="#00ff88"/></svg>
      )
    case 'network':
      return (
        <svg {...props}><circle cx="24" cy="10" r="5" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.15)"/><circle cx="10" cy="36" r="5" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.15)"/><circle cx="38" cy="36" r="5" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.15)"/><path d="M24 15v8M24 23l-10 8M24 23l10 8" stroke="#00ff88" strokeWidth="2"/></svg>
      )
    case 'server':
      return (
        <svg {...props}><rect x="10" y="8" width="28" height="10" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><rect x="10" y="22" width="28" height="10" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><rect x="10" y="36" width="28" height="6" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><circle cx="16" cy="13" r="2" fill="#00ff88"/><circle cx="16" cy="27" r="2" fill="#00ff88"/></svg>
      )
    case 'router':
      return (
        <svg {...props}><rect x="8" y="22" width="32" height="14" rx="3" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M14 22v-6a10 10 0 0120 0v6" stroke="#00ff88" strokeWidth="2"/><circle cx="18" cy="29" r="2" fill="#00ff88"/><circle cx="24" cy="29" r="2" fill="#00ff88"/><circle cx="30" cy="29" r="2" fill="#00ff88"/></svg>
      )
    case 'globe':
      return (
        <svg {...props}><circle cx="24" cy="24" r="18" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.08)"/><ellipse cx="24" cy="24" rx="8" ry="18" stroke="#00ff88" strokeWidth="1.5"/><path d="M6 24h36M8 14h32M8 34h32" stroke="#00ff88" strokeWidth="1.5"/></svg>
      )
    case 'linux':
      return (
        <svg {...props}><circle cx="24" cy="26" r="14" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><circle cx="19" cy="22" r="2" fill="#00ff88"/><circle cx="29" cy="22" r="2" fill="#00ff88"/><path d="M18 30c2 3 10 3 12 0" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/><path d="M24 12v-4M18 8l-2-3M30 8l2-3" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/></svg>
      )
    case 'vm':
      return (
        <svg {...props}><rect x="6" y="10" width="36" height="28" rx="3" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.06)"/><rect x="12" y="16" width="24" height="16" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.15)"/><path d="M20 24h8M24 20v8" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/></svg>
      )
    case 'terminal':
      return (
        <svg {...props}><rect x="6" y="8" width="36" height="32" rx="3" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.08)"/><path d="M12 18l6 4-6 4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 26h14" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/></svg>
      )
    case 'firewall':
      return (
        <svg {...props}><path d="M24 6l14 6v10c0 9-6 16-14 20-8-4-14-11-14-20V12l14-6z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M16 22h16M16 28h10" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round"/></svg>
      )
    case 'cloud':
      return (
        <svg {...props}><path d="M16 34h20a8 8 0 000-16 10 10 0 00-19.5-2A6 6 0 0016 34z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.12)"/></svg>
      )
    case 'mobile':
      return (
        <svg {...props}><rect x="16" y="6" width="16" height="36" rx="3" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><circle cx="24" cy="36" r="2" fill="#00ff88"/></svg>
      )
    case 'threat':
      return (
        <svg {...props}><path d="M24 8l16 28H8L24 8z" stroke="#ff6b6b" strokeWidth="2" fill="rgba(255,80,80,.12)"/><path d="M24 18v10M24 32v2" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round"/></svg>
      )
    case 'career':
      return (
        <svg {...props}><rect x="8" y="18" width="32" height="22" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M16 18v-4a8 8 0 0116 0v4" stroke="#00ff88" strokeWidth="2"/><path d="M18 28h12M18 33h8" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/></svg>
      )
    case 'target':
      return (
        <svg {...props}><circle cx="24" cy="24" r="18" stroke="#00ff88" strokeWidth="2"/><circle cx="24" cy="24" r="11" stroke="#00ff88" strokeWidth="2"/><circle cx="24" cy="24" r="4" fill="#00ff88"/></svg>
      )
    case 'laptop':
      return (
        <svg {...props}><rect x="10" y="12" width="28" height="18" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M6 34h36l-3-6H9l-3 6z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.06)"/></svg>
      )
    case 'dns':
      return (
        <svg {...props}><rect x="8" y="10" width="14" height="28" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><rect x="26" y="10" width="14" height="28" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><path d="M22 18h4M22 24h4M22 30h4" stroke="#00ff88" strokeWidth="2"/></svg>
      )
    case 'port':
      return (
        <svg {...props}><rect x="10" y="8" width="28" height="32" rx="2" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.08)"/><rect x="18" y="18" width="12" height="16" rx="1" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.2)"/></svg>
      )
    case 'bank':
      return (
        <svg {...props}><path d="M8 20h32l-16-10L8 20z" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/><rect x="10" y="20" width="6" height="14" stroke="#00ff88" strokeWidth="2"/><rect x="21" y="20" width="6" height="14" stroke="#00ff88" strokeWidth="2"/><rect x="32" y="20" width="6" height="14" stroke="#00ff88" strokeWidth="2"/><path d="M6 36h36" stroke="#00ff88" strokeWidth="2"/></svg>
      )
    default:
      return (
        <svg {...props}><circle cx="24" cy="24" r="16" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,.1)"/></svg>
      )
  }
}

export function PPTHeroVisual({ name }) {
  return (
    <div className="ppt-hero-visual">
      <div className="ppt-hero-visual-ring ppt-hero-visual-ring--1" />
      <div className="ppt-hero-visual-ring ppt-hero-visual-ring--2" />
      <PPTIcon name={name} size={88} />
    </div>
  )
}

export function PPTShowcaseImage({ name }) {
  return (
    <div className="ppt-showcase-art">
      <div className="ppt-showcase-art-glow" />
      <PPTIcon name={name} size={120} />
      <div className="ppt-showcase-art-lines">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="ppt-art-line" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}
