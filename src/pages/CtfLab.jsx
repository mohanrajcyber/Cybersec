import { useState, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'
import { CTF_CHALLENGES } from '../data/ctfData'

export default function CtfLab() {
  const { markModuleVisited, completeLab, ctfFlags, ctfHints, addCtfFlag, unlockCtfHint } = useAuth()
  const { narratePhase } = useLabSettings()
  const [inputs, setInputs] = useState({})
  const [feedback, setFeedback] = useState({})
  const [phase, setPhaseRaw] = useState('idle')

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('ctf', p)
  }, [narratePhase])

  const handleSubmit = (ch) => {
    markModuleVisited('ctf')
    setPhase('challenge')
    const val = (inputs[ch.id] || '').trim()
    if (val.toLowerCase() === ch.answer.toLowerCase()) {
      addCtfFlag(ch.id)
      setFeedback((f) => ({ ...f, [ch.id]: 'success' }))
      setPhase('flag')
      if (ctfFlags.length + 1 >= CTF_CHALLENGES.length) {
        completeLab('ctf')
        setTimeout(() => setPhase('done'), 600)
      }
    } else {
      setFeedback((f) => ({ ...f, [ch.id]: 'error' }))
    }
  }

  const handleHint = (ch) => {
    unlockCtfHint(ch.id)
    setPhase('hint')
  }

  return (
    <PageShell
      labId="ctf"
      icon="🏆"
      title="Mini CTF"
      description="Capture flags with animated progress + voice narration. Format: ICT{your_answer}"
      detailsSections={getModuleDetails('ctf')}
      steps={['Challenge 1', 'Challenge 2', 'Challenge 3']}
      currentStep={Math.min(ctfFlags.length, 2)}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo
            labId="ctf"
            phase={ctfFlags.length >= CTF_CHALLENGES.length ? 'done' : phase}
            meta={{ solved: ctfFlags.length, total: CTF_CHALLENGES.length }}
          />

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Flags Captured</div>
              <span className="status-pill status-open">{ctfFlags.length} / {CTF_CHALLENGES.length}</span>
            </div>
          </div>

          {CTF_CHALLENGES.map((ch, i) => {
            const solved = ctfFlags.includes(ch.id)
            const hintShown = ctfHints[ch.id]
            return (
              <div key={ch.id} className="panel ctf-challenge">
                <div className="panel-header">
                  <div className="panel-title">Challenge {i + 1}: {ch.title}</div>
                  {solved && <span className="status-pill status-open">Solved ✓</span>}
                </div>
                <p className="field-hint">{ch.hint}</p>
                {!solved && (
                  <>
                    <div className="ctf-input-row">
                      <input
                        className="field-input field-mono"
                        placeholder="ICT{...}"
                        value={inputs[ch.id] || ''}
                        onChange={(e) => setInputs({ ...inputs, [ch.id]: e.target.value })}
                        onFocus={() => setPhase('challenge')}
                      />
                      <button type="button" className="btn btn-primary" onClick={() => handleSubmit(ch)}>Submit</button>
                    </div>
                    {!hintShown ? (
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleHint(ch)}>💡 Unlock Hint</button>
                    ) : (
                      <p className="ctf-hint-text">💡 {ch.hintText}</p>
                    )}
                  </>
                )}
                {feedback[ch.id] === 'error' && !solved && (
                  <div className="feedback error" style={{ marginTop: '0.75rem' }}>Incorrect flag. Try again or unlock the hint.</div>
                )}
                {solved && <div className="feedback success" style={{ marginTop: '0.75rem' }}>Flag accepted: {ch.answer}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </PageShell>
  )
}
