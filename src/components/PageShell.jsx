import { Link } from 'react-router-dom'
import { useState } from 'react'
import DetailsGrid from './DetailsGrid'
import LabToolbar from './LabToolbar'

export default function PageShell({
  icon,
  title,
  description,
  badge,
  badgeVariant = 'safe',
  steps = [],
  currentStep = 0,
  detailsSections = [],
  labId,
  compactHeader = false,
  children,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className={`page-shell ${labId ? 'page-shell--lab' : ''} ${compactHeader ? 'page-shell--compact' : ''}`}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{title}</span>
      </nav>

      {!compactHeader && (
      <div className="lab-banner">
        <div className="lab-banner-content">
          <div className="lab-banner-icon">{icon}</div>
          <div className="lab-banner-body">
            <h1 className="lab-banner-title">{title}</h1>
            <p className="lab-banner-desc">{description}</p>
            <div className="lab-banner-actions">
              {badge && (
                <span className={`lab-badge lab-badge--${badgeVariant}`}>{badge}</span>
              )}
              {detailsSections.length > 0 && (
                <button
                  type="button"
                  className={`btn-details ${detailsOpen ? 'open' : ''}`}
                  onClick={() => setDetailsOpen(!detailsOpen)}
                >
                  {detailsOpen ? '▲ Hide Details' : 'ℹ️ Details — Learn About This Lab'}
                </button>
              )}
            </div>
          </div>
        </div>

        {detailsOpen && detailsSections.length > 0 && (
          <div className="lab-details-panel animate-in">
            <DetailsGrid sections={detailsSections} />
          </div>
        )}
      </div>
      )}

      {labId && <LabToolbar labId={labId} />}

      {steps.length > 0 && (
        <div className="step-tracker">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`step-item ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}
            >
              <div className="step-dot">{i < currentStep ? '✓' : i + 1}</div>
              <span className="step-label">{step}</span>
              {i < steps.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      )}

      <div className="page-content">{children}</div>
    </div>
  )
}
