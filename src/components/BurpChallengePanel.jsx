import { useCallback, useEffect, useState } from 'react'
import {
  BURP_CHALLENGE_TASKS,
  verifyTaskAction,
  verifyTaskAnswer,
} from '../data/burpChallengeTasks'
import {
  getChallengeProgress,
  isChallengeComplete,
  markTaskComplete,
} from '../utils/burpChallengeProgress'

export default function BurpChallengePanel({
  myLogs,
  username,
  studentName,
  onAllComplete,
}) {
  const [progress, setProgress] = useState(() => getChallengeProgress(username))
  const [answers, setAnswers] = useState({ task2: '', task3: '' })
  const [selectedOption, setSelectedOption] = useState({ task2: '' })
  const [feedback, setFeedback] = useState({})
  const [expanded, setExpanded] = useState(true)

  const refresh = useCallback(() => {
    setProgress(getChallengeProgress(username))
  }, [username])

  useEffect(() => {
    refresh()
    const handler = (e) => {
      if (!e.detail?.username || e.detail.username === username) refresh()
    }
    window.addEventListener('burp-challenge-update', handler)
    return () => window.removeEventListener('burp-challenge-update', handler)
  }, [username, refresh])

  useEffect(() => {
    if (isChallengeComplete(username)) onAllComplete?.()
  }, [progress, username, onAllComplete])

  const doneCount = [progress.task1, progress.task2, progress.task3].filter(Boolean).length
  const allDone = doneCount === 3

  const handleSubmit = (task) => {
    if (progress[task.id]) return

    const actionOk = verifyTaskAction(task.id, myLogs)
    if (!actionOk) {
      setFeedback((f) => ({
        ...f,
        [task.id]: {
          type: 'error',
          text: task.id === 'task1'
            ? 'No search GET found yet — search on Google first, then check HTTP history.'
            : task.id === 'task2'
              ? 'Navigate to https://www.google.com/search?q=test in the address bar first.'
              : 'Click the ⚠️ suspicious Auxilium login link in search results first.',
        },
      }))
      return
    }

    if (task.needsAnswer) {
      const answer = task.id === 'task2' ? selectedOption.task2 : answers.task3
      if (!answer?.trim()) {
        setFeedback((f) => ({ ...f, [task.id]: { type: 'error', text: 'Answer select/type pannunga before submit.' } }))
        return
      }
      if (!verifyTaskAnswer(task.id, answer)) {
        setFeedback((f) => ({
          ...f,
          [task.id]: {
            type: 'error',
            text: task.id === 'task2'
              ? 'Wrong answer — Params tab-la q parameter enna change aachu nu paathu try again.'
              : 'Wrong host — HTTP history Host column-la exact domain type pannunga.',
          },
        }))
        return
      }
    }

    markTaskComplete(username, studentName, task.id)
    setFeedback((f) => ({ ...f, [task.id]: { type: 'success', text: '✓ Correct! Task completed.' } }))
    refresh()
  }

  return (
    <section className="burp-challenge-panel">
      <button
        type="button"
        className="burp-challenge-head"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="burp-challenge-head-left">
          <span className="burp-challenge-badge">Challenge Mode</span>
          <strong>Burp Proxy — 3 Tasks</strong>
          <span className="burp-challenge-progress">{doneCount}/3 completed</span>
        </div>
        <span className="burp-challenge-toggle">{expanded ? '▾ Hide' : '▸ Show guide'}</span>
      </button>

      {allDone && (
        <div className="burp-challenge-done-banner">
          🎉 All 3 tasks completed! You understand HTTP capture, URL parameters, and suspicious hosts.
        </div>
      )}

      {expanded && (
        <div className="burp-challenge-grid">
          {BURP_CHALLENGE_TASKS.map((task, idx) => {
            const done = progress[task.id]
            const fb = feedback[task.id]

            return (
              <article
                key={task.id}
                className={`burp-challenge-card ${done ? 'done' : ''}`}
              >
                <header className="burp-challenge-card-head">
                  <span className="burp-challenge-num">{idx + 1}</span>
                  <div>
                    <h3>{task.title}</h3>
                    <p className="burp-challenge-ta">{task.titleTa}</p>
                  </div>
                  {done && <span className="burp-challenge-check">✓ Done</span>}
                </header>

                <ol className="burp-challenge-steps">
                  {task.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>

                <p className="burp-challenge-hint">💡 {task.hint}</p>

                {task.needsAnswer && !done && (
                  <div className="burp-challenge-answer">
                    <p className="burp-challenge-question">{task.question}</p>
                    {task.options ? (
                      <div className="burp-challenge-options">
                        {task.options.map((opt) => (
                          <label key={opt.id} className="burp-challenge-option">
                            <input
                              type="radio"
                              name={`${task.id}-answer`}
                              value={opt.id}
                              checked={selectedOption.task2 === opt.id}
                              onChange={() => setSelectedOption((s) => ({ ...s, task2: opt.id }))}
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="burp-challenge-input"
                        placeholder={task.answerPlaceholder}
                        value={answers.task3}
                        onChange={(e) => setAnswers((a) => ({ ...a, task3: e.target.value }))}
                        spellCheck={false}
                      />
                    )}
                  </div>
                )}

                {fb && (
                  <p className={`burp-challenge-feedback ${fb.type}`}>{fb.text}</p>
                )}

                {!done && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm burp-challenge-submit"
                    onClick={() => handleSubmit(task)}
                  >
                    {task.submitLabel}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
