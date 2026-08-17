import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import WarRoomStudentVictimScreen, {
  getAttackerTool,
  getScenarioTheory,
} from './WarRoomStudentVictimScreen'


function ts() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

export default function WarRoomStudentSim({ scenario, onClose, onComplete }) {
  const { studentName, isStudent } = useAuth()
  const displayName = isStudent && studentName ? studentName : 'Student'

  const [simStarted, setSimStarted] = useState(false)
  const [stepIdx, setStepIdx] = useState(-1)
  const [logs, setLogs] = useState([`[INFO] ${scenario.title} kit loaded — simulation only`])
  const [feedback, setFeedback] = useState(null)
  const [badCount, setBadCount] = useState(0)
  const [done, setDone] = useState(false)
  const [victimState, setVictimState] = useState('idle')
  const [waitingChoice, setWaitingChoice] = useState(false)
  const logEndRef = useRef(null)
  const badCountRef = useRef(0)

  const tool = getAttackerTool(scenario.scene, scenario)
  const theory = getScenarioTheory(scenario)
  const totalSteps = scenario.steps.length

  const addLog = useCallback((text, cls = '') => {
    setLogs((prev) => [...prev, { text: `[${ts()}] ${text}`, cls }])
  }, [])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    badCountRef.current = badCount
  }, [badCount])

  const finish = useCallback(() => {
    setDone(true)
    setVictimState(badCountRef.current === 0 ? 'safe' : 'compromised')
    onComplete?.(scenario.id, badCountRef.current === 0)
  }, [onComplete, scenario.id])

  const advanceStep = useCallback((fromIdx) => {
    const next = fromIdx + 1
    if (next >= totalSteps) {
      finish()
      return
    }
    setStepIdx(next)
    setFeedback(null)
    setWaitingChoice(false)
  }, [totalSteps, finish])

  const launchAttack = () => {
    if (simStarted) return
    setSimStarted(true)
    setVictimState('active')
    addLog(`Launching: ${tool.action}`, 'attack')
    setStepIdx(0)
  }

  useEffect(() => {
    if (!simStarted || stepIdx < 0 || waitingChoice || feedback || done) return
    const step = scenario.steps[stepIdx]
    if (!step) return

    if (step.type === 'log') {
      addLog(step.text, step.who || 'attack')
      const t = setTimeout(() => advanceStep(stepIdx), 1600)
      return () => clearTimeout(t)
    }

    if (step.type === 'visual') {
      setVictimState('active')
      const t = setTimeout(() => advanceStep(stepIdx), 1800)
      return () => clearTimeout(t)
    }

    if (step.type === 'choice' || step.type === 'defend') {
      setWaitingChoice(true)
    }
  }, [simStarted, stepIdx, waitingChoice, feedback, done, scenario.steps, addLog, advanceStep])

  const pickChoice = (opt) => {
    if (!waitingChoice || feedback) return
    if (opt.bad) {
      setBadCount((c) => c + 1)
      setVictimState('compromised')
    } else {
      setVictimState('safe')
    }
    setFeedback({ text: opt.feedback, bad: opt.bad })
    addLog(opt.feedback, opt.bad ? 'bad' : 'good')
    setWaitingChoice(false)
  }

  const continueAfterFeedback = () => {
    advanceStep(stepIdx)
  }

  const resetDemo = () => {
    setSimStarted(false)
    setStepIdx(-1)
    setLogs([`[INFO] ${scenario.title} kit loaded — simulation only`])
    setFeedback(null)
    setBadCount(0)
    badCountRef.current = 0
    setDone(false)
    setVictimState('idle')
    setWaitingChoice(false)
  }

  const currentStep = scenario.steps[stepIdx]
  const stepLabel = done
    ? (badCount === 0 ? 'Defended ✓' : 'Compromised ✗')
    : !simStarted
      ? 'Setup'
      : currentStep?.type === 'defend'
        ? 'Defend'
        : currentStep?.type === 'choice'
          ? 'Your Choice'
          : currentStep?.type === 'visual'
            ? 'Victim'
            : 'Attack'

  const progressPct = done
    ? 100
    : !simStarted
      ? 0
      : Math.round(((stepIdx + 1) / totalSteps) * 100)

  const flowActive = (n) => simStarted && progressPct >= n

  return (
    <div className="war-student-sim-overlay war-student-sim-full" role="dialog" aria-modal="true">
      <div className="war-student-sim-full-wrap" style={{ '--sim-accent': scenario.accent }}>
        <section className="war-phonehack-section war-student-sim-section">
          <div className="war-phish-header">
            <div>
              <h2>
                {scenario.icon} #{scenario.num} {scenario.title.toUpperCase()}
              </h2>
              <p>{scenario.tag} simulation · {displayName} tries · ICT Academy Lab</p>
            </div>
            <div className="war-phish-header-actions">
              <span className="war-phonehack-step-badge">Step: {stepLabel}</span>
              <button type="button" className="war-btn war-btn-reset" onClick={resetDemo}>Reset Demo</button>
              <button type="button" className="war-student-sim-close-full" onClick={onClose} aria-label="Close">✕ Close</button>
            </div>
          </div>

          <div className="war-phish-theory">
            {theory.map((t) => (
              <div key={t.id} className={`war-phish-theory-card ${t.id}`}>
                <span className="war-phish-theory-icon">{t.icon}</span>
                <strong>{t.title}</strong>
                <p>{t.text}</p>
              </div>
            ))}
          </div>

          <div className="war-phish-stage">
            <div className="war-phish-pc">
              <div className="war-phish-pc-title">💻 ATTACKER PC — {tool.kit}</div>
              <div className="war-phish-pc-screen war-phonehack-pc">
                <div className="war-phish-pc-bar">
                  <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                  <span>root@attacker:~ — Lab simulation only</span>
                </div>
                <div className="war-phish-pc-body">
                  <div className="war-phish-tool">
                    <label>{tool.kit}</label>
                    <div className="war-phish-field">
                      <span>Target</span>
                      <input type="text" readOnly value={displayName} />
                    </div>
                    <div className="war-phish-field">
                      <span>Payload</span>
                      <code>{tool.payload}</code>
                    </div>
                    <button
                      type="button"
                      className="war-phonehack-send-btn war-student-launch-btn"
                      onClick={launchAttack}
                      disabled={simStarted}
                    >
                      {simStarted ? '⚡ Attack Running…' : `🚀 ${tool.action}`}
                    </button>
                  </div>

                  <div className="war-phish-attacker-log">
                    <div className="war-sub-title">Attack Console</div>
                    <div className="war-phish-log-scroll">
                      {logs.map((line, i) => (
                        <p
                          key={i}
                          className={
                            typeof line === 'string'
                              ? ''
                              : line.cls === 'attack' || line.cls === 'attacker'
                                ? 'stolen'
                                : line.cls === 'bad'
                                  ? 'stolen'
                                  : line.cls === 'good'
                                    ? 'safe'
                                    : ''
                          }
                        >
                          {typeof line === 'string' ? line : line.text}
                        </p>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>

                  {simStarted && currentStep?.type === 'defend' && waitingChoice && !feedback && (
                    <div className="war-student-defender-panel">
                      <div className="war-sub-title">🛡️ DEFENDER — Your Action</div>
                      <p className="war-student-defender-prompt">{currentStep.prompt}</p>
                      <div className="war-student-defender-choices">
                        {currentStep.options.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            className={`war-student-choice defend ${opt.bad ? 'risky' : ''}`}
                            onClick={() => pickChoice(opt)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="war-phish-flow">
              <div className={`war-phish-arrow ${flowActive(25) ? 'active' : ''}`}>Attack →</div>
              <div className={`war-phish-arrow ${flowActive(50) ? 'active' : ''}`}>Victim →</div>
              <div className={`war-phish-arrow ${flowActive(75) ? 'active' : ''}`}>Result →</div>
              <div className="war-phish-progress">
                <div style={{ height: `${progressPct}%` }} />
              </div>
            </div>

            <div className="war-student-victim-wrap">
              <WarRoomStudentVictimScreen
                scene={scenario.scene}
                viewState={done ? (badCount === 0 ? 'safe' : 'compromised') : victimState}
                displayName={displayName}
                simStarted={simStarted}
              />

              {!done && simStarted && currentStep?.type === 'choice' && waitingChoice && !feedback && (
                <div className="war-student-victim-choices-overlay">
                  <p className="war-student-sim-prompt">{currentStep.prompt}</p>
                  <div className="war-student-sim-choices">
                    {currentStep.options.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        className="war-student-choice"
                        onClick={() => pickChoice(opt)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {feedback && !done && (
                <div className={`war-student-victim-feedback ${feedback.bad ? 'bad' : 'good'}`}>
                  <p>{feedback.text}</p>
                  <button type="button" className="war-btn war-btn-start" onClick={continueAfterFeedback}>
                    Continue →
                  </button>
                </div>
              )}

              {done && (
                <div className={`war-student-sim-result-full ${badCount === 0 ? 'safe' : 'bad'}`}>
                  <span className="war-student-result-icon">{badCount === 0 ? '🏆' : '⚠️'}</span>
                  <strong>{badCount === 0 ? 'Well Defended!' : 'Attack Partially Succeeded'}</strong>
                  <p>{scenario.lesson}</p>
                  <button type="button" className="war-btn war-btn-start" onClick={onClose}>
                    Back to All 15 Scenarios
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="war-phish-ethics">
            ⚖️ Simulation only — {scenario.title} · Trainer: Mohan Raj · ICT Academy
          </p>
        </section>
      </div>
    </div>
  )
}
