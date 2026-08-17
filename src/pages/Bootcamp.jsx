import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import {
  bootcampDays,
  ICT_SESSION,
  ciaTriadContent,
  threatsContent,
} from '../data/bootcampData'
import { strategyContent, industriesContent } from '../data/sessionPlan'
import { useAuth } from '../context/AuthContext'

const INFO_MAP = {
  cyberStrategy: strategyContent,
  threatLandscape: threatsContent,
  coreSecurityIntelligence: ciaTriadContent,
  targetedIndustries: industriesContent,
}

export default function Bootcamp() {
  const navigate = useNavigate()
  const { bootcamp, toggleTopic, getDayProgress, getOverallProgress } = useAuth()
  const [expandedDay, setExpandedDay] = useState('day1')
  const [infoPanel, setInfoPanel] = useState(null)

  const overall = getOverallProgress()

  const handleTopicClick = (dayId, topic) => {
    toggleTopic(dayId, topic.key)
    if (topic.link) {
      navigate(topic.link)
    } else if (INFO_MAP[topic.key]) {
      setInfoPanel(INFO_MAP[topic.key])
    }
  }

  return (
    <PageShell
      icon="🎓"
      title="ICT Academy · 3-Day Session Plan"
      description={`${ICT_SESSION.program} — ${ICT_SESSION.course} at ${ICT_SESSION.venue}`}
      compactHeader
    >
      <div className="ict-session-banner panel">
        <div className="ict-session-badge">✅ ICT Approved · Batch {ICT_SESSION.batchId}</div>
        <h2>{ICT_SESSION.program}</h2>
        <p className="ict-session-sub">{ICT_SESSION.initiative}</p>
        <div className="ict-session-meta">
          <span>📅 {ICT_SESSION.displayDates}</span>
          <span>🏫 {ICT_SESSION.venue}</span>
          <span>👨‍🏫 {ICT_SESSION.trainer} · {ICT_SESSION.vendor}</span>
          <span>⏱ {ICT_SESSION.allocatedHours}h allocated · 5h/day</span>
        </div>
        <p className="field-hint ict-session-note">
          Topics below match the official ICT Academy session plan. Click each sub-topic — open the linked lab for hands-on practice with Mohan Raj.
        </p>
      </div>

      <div className="overall-progress bootcamp-overall-progress">
        <div className="progress-label">
          <span>Session Progress</span>
          <span>{overall}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="day-cards">
        {bootcampDays.map((day) => {
          const progress = getDayProgress(day.id)
          const isExpanded = expandedDay === day.id

          return (
            <div key={day.id} className={`day-card animate-in ${isExpanded ? 'active' : ''}`}>
              <div className="day-card-header" onClick={() => setExpandedDay(isExpanded ? null : day.id)}>
                <div>
                  <h2>
                    <span className="day-number">{day.label.split('—')[0].trim()}</span>
                    {day.icon} {day.label.split('—')[1]?.trim()}
                  </h2>
                  <p className="day-ict-topic">{day.ictTopic}</p>
                  <p className="day-ict-meta">{day.date} · {day.methodology} · {day.hours}h</p>
                </div>
                <span className="day-progress-text">{progress}%</span>
              </div>

              {isExpanded && (
                <div className="day-topics">
                  {day.topics.map((topic) => {
                    const done = bootcamp[day.id]?.[topic.key]
                    return (
                      <div
                        key={topic.key}
                        className={`topic-item ${done ? 'completed' : ''}`}
                        onClick={() => handleTopicClick(day.id, topic)}
                      >
                        <div className="topic-checkbox">{done && '✓'}</div>
                        <span className="topic-name">{topic.name}</span>
                        {topic.link ? (
                          <span className="topic-link">Hands-on Lab →</span>
                        ) : (
                          <span className="topic-link">Read & Mark →</span>
                        )}
                      </div>
                    )
                  })}
                  <div style={{ padding: '0.75rem 1.5rem' }}>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {infoPanel && (
        <div className="panel animate-in" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="panel-title" style={{ marginBottom: 0 }}>{infoPanel.title}</div>
            <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setInfoPanel(null)}>
              Close
            </button>
          </div>
          {infoPanel.sections.map((s) => (
            <div key={s.heading} className="edu-section why" style={{ marginBottom: '1rem' }}>
              <h4>{s.heading}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
