import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { generateCertificate } from '../utils/certificate'

export default function LeaderboardPage() {
  const { getLeaderboard, username } = useAuth()
  const board = getLeaderboard()
  const medals = ['🥇', '🥈', '🥉']
  const myRank = board.findIndex((s) => s.username === username)

  return (
    <div className="leaderboard-page">
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link><span className="breadcrumb-sep">/</span><span>Leaderboard</span>
      </nav>
      <h1 className="page-heading">🏆 Leaderboard</h1>
      <p className="page-sub">Top performers across bootcamp, labs, and CTF challenges</p>

      {myRank >= 0 && (
        <p className="field-hint lb-my-rank">Your rank: <strong>#{myRank + 1}</strong> of {board.length}</p>
      )}

      <div className="panel">
        {board.length === 0 ? (
          <p className="field-hint">No scores yet. Complete labs to appear here!</p>
        ) : (
          <div className="leaderboard-list">
            {board.map((s, i) => (
              <div key={s.username} className={`leaderboard-row ${s.username === username ? 'me' : ''}`}>
                <span className="lb-rank">{medals[i] || `#${i + 1}`}</span>
                <div className="lb-info">
                  <strong>{s.name}</strong>
                  <span className="lb-roll">@{s.username}</span>
                </div>
                <div className="lb-stats">
                  <span>{s.score}% overall</span>
                  <span>{s.badges} badges</span>
                  <span>{s.ctf} CTF flags</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function CertificateButton() {
  const { getOverallProgress, studentName, username, isStudent } = useAuth()
  const progress = getOverallProgress()

  if (!isStudent) return null

  const handleDownload = () => {
    if (progress < 100) return
    generateCertificate({ studentName, username })
  }

  return (
    <button
      type="button"
      className={`btn ${progress >= 100 ? 'btn-primary' : 'btn-outline'}`}
      onClick={handleDownload}
      disabled={progress < 100}
      title={progress >= 100 ? `Complete bootcamp (${progress}%) to unlock` : 'Download certificate'}
    >
      {progress >= 100 ? '🎓 Download Certificate' : `🎓 Certificate (${progress}%)`}
    </button>
  )
}
