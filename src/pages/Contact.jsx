import { TRAINER } from '../data/trainer'

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>About the Trainer</h1>
        <p>IBM Adult Learner 2026-27 · ICT Academy approved session at Auxilium College</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card main">
          <div className="contact-avatar">MR</div>
          <h2>{TRAINER.name}</h2>
          <p className="contact-title">{TRAINER.title}</p>
          <p className="contact-summary">{TRAINER.summary}</p>

          <div className="contact-links">
            <a href={`mailto:${TRAINER.email}`} className="contact-link">📧 {TRAINER.email}</a>
            <a href={`https://wa.me/${TRAINER.whatsapp}`} target="_blank" rel="noreferrer" className="contact-link">📱 {TRAINER.phone} ({TRAINER.phoneNote})</a>
            <span className="contact-link">📍 {TRAINER.location}</span>
            <a href={TRAINER.linkedin} target="_blank" rel="noreferrer" className="contact-link">🔗 LinkedIn Profile</a>
          </div>
        </div>

        <div className="contact-card">
          <h3>Certifications</h3>
          <ul className="contact-list">
            {TRAINER.certifications.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div className="contact-card">
          <h3>Current ICT Session</h3>
          <ul className="contact-list">
            <li><strong>Program:</strong> {TRAINER.program}</li>
            <li><strong>Batch:</strong> {TRAINER.batchId}</li>
            <li><strong>Venue:</strong> {TRAINER.venue}</li>
            <li><strong>Vendor:</strong> {TRAINER.vendor}</li>
            <li><strong>Dates:</strong> 19 – 21 Aug 2026</li>
            <li><strong>Course:</strong> Cyber Security (Technical Module)</li>
          </ul>
        </div>

        <div className="contact-card">
          <h3>Teaching Experience</h3>
          <ul className="contact-list">
            <li>SRM University — Cybersecurity Workshops</li>
            <li>Sathyabama University — Web Security Labs</li>
            <li>AVS Engineering College — Network Security Training</li>
            <li>ICT Academy — Hands-on Cyber Labs</li>
            <li>200+ students trained across multiple batches</li>
          </ul>
        </div>

        <div className="contact-card">
          <h3>Core Skills</h3>
          <div className="skill-tags">
            {['OWASP Top 10', 'Nmap', 'Wireshark', 'Burp Suite', 'SOC/SIEM', 'Python', 'Incident Response', 'Phishing Analysis', 'Network Security'].map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h3>Platform Info</h3>
          <p className="contact-summary">
            CyberSec Arena is a safe, simulated training environment. All labs run locally in your browser —
            no real scanning, exploitation, or network activity occurs. Designed for college-level cybersecurity education.
          </p>
        </div>
      </div>
    </div>
  )
}
