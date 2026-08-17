import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModuleDetails } from '../data/moduleDetails'
import { useAuth } from '../context/AuthContext'
import ModuleDetailsModal from './ModuleDetailsModal'

const DIFFICULTY_CLASS = {
  Beginner: 'diff-beginner',
  Easy: 'diff-easy',
  Medium: 'diff-medium',
}

export default function ModuleCard({ module }) {
  const navigate = useNavigate()
  const { visitedModules, completedLabs } = useAuth()
  const [showDetails, setShowDetails] = useState(false)
  const sections = getModuleDetails(module.id)

  const visited = visitedModules.includes(module.id)
  const completed = completedLabs.includes(module.id)
  const status = completed ? 'completed' : visited ? 'in-progress' : 'new'

  const openLab = () => {
    setShowDetails(false)
    navigate(module.path)
  }

  return (
    <>
      <div
        className={`module-card module-card--${status}`}
        style={{ '--card-accent': module.accent }}
      >
        <div className="module-card-accent-bar" />

        <div className="module-card-header">
          <span className="module-order">#{module.order}</span>
          <span className={`module-status module-status--${status}`}>
            {completed ? '✓ Done' : visited ? '▶ Started' : '● New'}
          </span>
        </div>

        <div className="module-card-top">
          <div className="module-icon-wrap">{module.icon}</div>
          <div className="module-meta-tags">
            <span className="module-badge">{module.badge}</span>
            <span className={`module-diff ${DIFFICULTY_CLASS[module.difficulty] || ''}`}>
              {module.difficulty}
            </span>
          </div>
        </div>

        <div className="module-name">{module.name}</div>
        <p className="module-learn">📌 {module.learn}</p>
        <div className="module-desc">{module.desc}</div>

        <div className="module-footer-info">
          <span>⏱ {module.duration}</span>
          <span>{module.category.replace('-', ' ')}</span>
        </div>

        <div className="module-card-actions">
          {sections.length > 0 && (
            <button type="button" className="module-details-btn" onClick={() => setShowDetails(true)}>
              ℹ️ Details
            </button>
          )}
          <button type="button" className="module-start-btn" onClick={openLab}>
            {completed ? 'Practice Again →' : visited ? 'Continue Lab →' : 'Start Lab →'}
          </button>
        </div>
      </div>

      {showDetails && (
        <ModuleDetailsModal
          module={module}
          sections={sections}
          onClose={() => setShowDetails(false)}
          onOpenLab={openLab}
        />
      )}
    </>
  )
}
