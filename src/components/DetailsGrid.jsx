export default function DetailsGrid({ sections }) {
  if (!sections?.length) return null

  return (
    <div className="lab-details-grid">
      {sections.map((section) => (
        <div key={section.id} className={`detail-card detail-card--${section.type}`}>
          <div className="detail-card-head">
            {section.icon && <div className="detail-card-icon">{section.icon}</div>}
            <h3 className="detail-card-title">{section.title}</h3>
          </div>
          <p className="detail-card-text">{section.content}</p>
        </div>
      ))}
    </div>
  )
}
