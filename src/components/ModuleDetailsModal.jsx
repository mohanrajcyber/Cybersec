import DetailsGrid from './DetailsGrid'

export default function ModuleDetailsModal({ module, sections, onClose, onOpenLab }) {
  if (!module) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-panel animate-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">{module.icon}</div>
            <div>
              <h2 id="modal-title" className="modal-title">{module.name}</h2>
              <p className="modal-desc">{module.desc}</p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <DetailsGrid sections={sections} />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenLab}>
            Open Lab →
          </button>
        </div>
      </div>
    </div>
  )
}
