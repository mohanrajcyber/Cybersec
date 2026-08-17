import { useState, useCallback, useEffect } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'
import { IR_STEPS, IR_SCENARIO } from '../data/irData'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function IncidentResponseLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [pool, setPool] = useState(() => shuffle(IR_STEPS))
  const [dragIdx, setDragIdx] = useState(null)
  const [checked, setChecked] = useState(false)
  const [phase, setPhaseRaw] = useState('scenario')

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('ir', p)
  }, [narratePhase])

  useEffect(() => {
    narratePhase('ir', 'scenario')
  }, [narratePhase])

  const correct = pool.every((s, i) => s.id === IR_STEPS[i].id)
  const orderProgress = pool.filter((s, i) => s.id === IR_STEPS[i].id).length - 1

  const onDragStart = (i) => {
    setDragIdx(i)
    setPhase('order')
  }
  const onDragOver = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const next = [...pool]
    const [item] = next.splice(dragIdx, 1)
    next.splice(i, 0, item)
    setPool(next)
    setDragIdx(i)
    setChecked(false)
  }
  const onDrop = () => setDragIdx(null)

  const handleCheck = () => {
    markModuleVisited('ir')
    setChecked(true)
    setPhase('verify')
    if (correct) {
      completeLab('ir')
      setTimeout(() => setPhase('done'), 800)
    }
  }

  const handleReset = () => {
    setPool(shuffle(IR_STEPS))
    setChecked(false)
    setPhase('order')
  }

  return (
    <PageShell
      labId="ir"
      icon="🚨"
      title="Incident Response Lab"
      description="Animated IR lifecycle demo + drag-drop ordering with voice narration."
      detailsSections={getModuleDetails('ir')}
      steps={['Scenario', 'Order Steps', 'Verify']}
      currentStep={checked ? (correct ? 2 : 1) : 1}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo
            labId="ir"
            phase={phase}
            meta={{ irSteps: IR_STEPS.map((s) => s.label), orderProgress: Math.max(0, orderProgress) }}
          />

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Scenario</div>
              <span className="status-pill status-danger">High Severity</span>
            </div>
            <h3 className="ir-scenario-title">{IR_SCENARIO.title}</h3>
            <p className="field-hint">{IR_SCENARIO.description}</p>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Drag to Order — Detect → Contain → Eradicate → Recover</div>
            </div>
            <div className="ir-drag-list">
              {pool.map((step, i) => (
                <div
                  key={step.id}
                  className={`ir-drag-item ${checked ? (step.id === IR_STEPS[i].id ? 'correct' : 'incorrect') : ''}`}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                >
                  <span className="ir-drag-handle">⠿</span>
                  <div>
                    <strong>{i + 1}. {step.label}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-actions" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
              <button type="button" className="btn btn-primary" onClick={handleCheck}>Check Order</button>
              <button type="button" className="btn btn-outline" onClick={handleReset}>Shuffle Again</button>
            </div>
            {checked && (
              <div className={`feedback ${correct ? 'success' : 'error'}`}>
                {correct ? (
                  <><strong>Correct!</strong> Detect → Contain → Eradicate → Recover is the standard IR lifecycle.</>
                ) : (
                  <><strong>Not quite.</strong> First identify, then stop spread, remove threat, restore operations.</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
