import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getSimLab } from '../data/simLabs'
import { getModuleDetails } from '../data/moduleDetails'
import { UrlScannerView, FootprintView, BreachView, ScamView, WifiView } from '../components/SimLabInteractive'

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function md5Sim(text) {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(8, '0') + '… (simulated MD5 fingerprint)'
}

function QuizPanel({ config, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const opts = config.options || config.challenge?.options

  const submit = (id) => {
    if (done) return
    setSelected(id)
    setDone(true)
    const correct = id === (config.correctId || opts?.find((o) => o.correct)?.id)
    if (correct) onComplete()
  }

  const correctId = config.correctId || opts?.find((o) => o.correct)?.id

  return (
    <div className="panel">
      {config.scenario && <p className="sim-scenario">{config.scenario}</p>}
      <div className="challenge-question">{config.question}</div>
      <div className="challenge-options">
        {opts?.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`challenge-option ${done ? (o.id === correctId ? 'correct' : selected === o.id ? 'incorrect' : '') : ''}`}
            onClick={() => submit(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {done && <div className={`feedback ${selected === correctId ? 'success' : 'error'}`}>{config.explain}</div>}
    </div>
  )
}

export default function SimLab() {
  const { labId } = useParams()
  const config = getSimLab(labId)
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [phase, setPhaseRaw] = useState('idle')
  const visitedRef = useRef(false)

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase(labId, p === 'idle' ? 'idle' : p === 'done' ? 'done' : 'analyze')
  }, [labId, narratePhase])

  useEffect(() => {
    if (!visitedRef.current && config) {
      visitedRef.current = true
      queueMicrotask(() => markModuleVisited(labId))
    }
  }, [config, labId, markModuleVisited])

  const finish = useCallback(() => {
    setPhase('done')
    completeLab(labId)
  }, [labId, completeLab, setPhase])

  if (!config) return <Navigate to="/" replace />

  const details = getModuleDetails(labId)
  const steps = config.steps || ['Learn', 'Practice', 'Complete']

  return (
    <PageShell
      labId={labId}
      icon={config.icon}
      title={config.name}
      description={config.desc}
      detailsSections={details}
      steps={steps}
      currentStep={phase === 'done' ? steps.length - 1 : 1}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo labId={labId} phase={phase === 'idle' ? 'idle' : phase === 'done' ? 'strong' : 'analyze'} meta={{ strength: phase === 'done' ? 3 : 1, label: phase === 'done' ? 'Complete' : 'Learning' }} />

          {config.type === 'terminal' && (
            <TerminalView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'encode' && (
            <EncodeView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'drag-rules' && (
            <DragRulesView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'drag-order' && (
            <DragOrderView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'log-select' && (
            <LogSelectView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'timeline' && (
            <TimelineView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'checklist' && (
            <ChecklistView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'cve' && (
            <CveView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'match' && (
            <MatchView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'quiz' && (
            <QuizPanel config={config} onComplete={() => { setPhase('done'); finish() }} />
          )}
          {config.type === 'url-scanner' && (
            <UrlScannerView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'footprint' && (
            <FootprintView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'breach' && (
            <BreachView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'scam' && (
            <ScamView config={config} setPhase={setPhase} onComplete={finish} />
          )}
          {config.type === 'wifi' && (
            <WifiView config={config} setPhase={setPhase} onComplete={finish} />
          )}
        </div>
      </div>
    </PageShell>
  )
}

function TerminalView({ config, setPhase, onComplete }) {
  const [idx, setIdx] = useState(-1)
  const [done, setDone] = useState(false)
  const cmds = config.commands || []

  const run = (i) => {
    setPhase('analyze')
    setIdx(i)
    if (i >= cmds.length - 1) setDone(true)
  }

  return (
    <>
      <div className="panel">
        <div className="panel-title">Command Reference — click to run</div>
        <div className="cmd-grid">
          {cmds.map((c, i) => (
            <button key={c.cmd} type="button" className={`cmd-chip ${idx >= i ? 'ran' : ''}`} onClick={() => run(i)}>
              <code>{c.cmd}</code>
              <small>{c.hint}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="terminal terminal-pro">
          <div className="terminal-body">
            <div className="terminal-line terminal-line--cmd"><span className="prompt">$</span> student@ict-lab</div>
            {idx >= 0 && cmds.slice(0, idx + 1).map((c) => (
              <div key={c.cmd}>
                <div className="terminal-line terminal-line--cmd"><span className="prompt">$</span> {c.cmd}</div>
                <div className="terminal-line terminal-line--success">{c.out}</div>
                <div className="terminal-line terminal-line--hint">→ {c.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {done && config.challenge && (
        <QuizPanel config={config.challenge} onComplete={onComplete} />
      )}
    </>
  )
}

function EncodeView({ config, setPhase, onComplete }) {
  const [text, setText] = useState('')
  const [hashes, setHashes] = useState(null)

  const analyze = async (val) => {
    setText(val)
    if (!val) { setHashes(null); return }
    setPhase('analyze')
    const sha = await sha256(val)
    setHashes({
      md5: md5Sim(val),
      sha256: sha.slice(0, 32) + '…',
      b64: btoa(unescape(encodeURIComponent(val))),
    })
  }

  return (
    <>
      <div className="panel">
        <div className="panel-title">Enter text to transform</div>
        <input className="field-input field-mono" value={text} onChange={(e) => analyze(e.target.value)} placeholder="Type message..." />
        {hashes && (
          <div className="hash-output">
            <div><strong>MD5 (sim):</strong> <code>{hashes.md5}</code></div>
            <div><strong>SHA-256:</strong> <code>{hashes.sha256}</code></div>
            <div><strong>Base64:</strong> <code>{hashes.b64}</code></div>
          </div>
        )}
      </div>
      {config.challenge && text && (
        <QuizPanel config={config.challenge} onComplete={onComplete} />
      )}
    </>
  )
}

function DragRulesView({ config, setPhase, onComplete }) {
  const [order, setOrder] = useState(() => [...config.rules].sort(() => Math.random() - 0.5))
  const [checked, setChecked] = useState(false)
  const correctOrder = [...config.rules].sort((a, b) => a.order - b.order)
  const correct = order.every((r, i) => r.id === correctOrder[i]?.id)

  return (
    <div className="panel">
      <p className="sim-scenario">{config.scenario}</p>
      <p className="field-hint">Drag rules into correct priority (top = first match)</p>
      <div className="ir-drag-list">
        {order.map((r, i) => (
          <div
            key={r.id}
            className={`ir-drag-item ${checked ? (config.rules.find((x) => x.id === r.id)?.order === i + 1 ? 'correct' : 'incorrect') : ''}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('idx', i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = +e.dataTransfer.getData('idx')
              const next = [...order]
              const [item] = next.splice(from, 1)
              next.splice(i, 0, item)
              setOrder(next)
              setChecked(false)
              setPhase('analyze')
            }}
          >
            <span className="ir-drag-handle">⠿</span>
            <strong>{i + 1}. {r.label}</strong>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => { setChecked(true); if (correct) onComplete() }}>
        Check Rules
      </button>
      {checked && <div className={`feedback ${correct ? 'success' : 'error'}`}>{config.explain}</div>}
    </div>
  )
}

function DragOrderView({ config, setPhase, onComplete }) {
  const [order, setOrder] = useState(() => [...config.items].sort(() => Math.random() - 0.5))
  const [checked, setChecked] = useState(false)
  const correct = order.every((item, i) => item.id === config.items[i]?.id)

  return (
    <div className="panel">
      <p className="field-hint">Drag into correct order</p>
      <div className="ir-drag-list">
        {order.map((item, i) => (
          <div
            key={item.id}
            className={`ir-drag-item ${checked ? (item.id === config.items[i]?.id ? 'correct' : 'incorrect') : ''}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('idx', i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = +e.dataTransfer.getData('idx')
              const next = [...order]
              const [x] = next.splice(from, 1)
              next.splice(i, 0, x)
              setOrder(next)
              setChecked(false)
              setPhase('analyze')
            }}
          >
            <span className="ir-drag-handle">⠿</span>
            <div><strong>{i + 1}. {item.label}</strong></div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => { setChecked(true); if (correct) onComplete() }}>
        Check Order
      </button>
      {checked && <div className={`feedback ${correct ? 'success' : 'error'}`}>{config.explain}</div>}
    </div>
  )
}

function LogSelectView({ config, setPhase, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const correctId = config.options?.find((o) => o.correct)?.id

  const pick = (id) => {
    if (done) return
    setSelected(id)
    setDone(true)
    setPhase('analyze')
    if (id === correctId) onComplete()
  }

  return (
    <div className="panel">
      <div className="panel-title">{config.question}</div>
      <div className="table-wrap">
        <table className="scan-table">
          <thead><tr><th>Source</th><th>Event</th><th>Alert</th></tr></thead>
          <tbody>
            {config.logs?.map((l) => (
              <tr key={l.id} className={`packet-row ${l.alert ? 'highlight-row' : ''}`}>
                <td>{l.src}</td>
                <td>{l.msg}</td>
                <td>{l.alert ? '⚠' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="challenge-options" style={{ marginTop: '1rem' }}>
        {config.options?.map((o) => (
          <button key={o.id} type="button" className={`challenge-option ${done ? (o.correct ? 'correct' : selected === o.id ? 'incorrect' : '') : ''}`} onClick={() => pick(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      {done && <div className={`feedback ${selected === correctId ? 'success' : 'error'}`}>{config.explain}</div>}
    </div>
  )
}

function TimelineView({ config, setPhase, onComplete }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">Forensic Timeline</div>
        {config.events?.map((e) => (
          <div key={e.time} className={`timeline-event ${e.suspicious ? 'suspicious' : ''}`}>
            <span className="timeline-time">{e.time}</span>
            <span>{e.event}</span>
            {e.suspicious && <span className="status-pill status-danger">Suspicious</span>}
          </div>
        ))}
      </div>
      <QuizPanel config={config} onComplete={() => { setPhase('done'); onComplete() }} />
    </>
  )
}

function ChecklistView({ config, setPhase, onComplete }) {
  const [checked, setChecked] = useState({})
  const required = config.items?.filter((i) => i.required) || []
  const allRequired = required.every((i) => checked[i.id])

  return (
    <div className="panel">
      <div className="panel-title">Complete the checklist</div>
      {config.items?.map((item) => (
        <label key={item.id} className="checklist-row">
          <input type="checkbox" checked={!!checked[item.id]} onChange={() => { setChecked((c) => ({ ...c, [item.id]: !c[item.id] })); setPhase('analyze') }} />
          <span>{item.label} {!item.required && <em>(optional)</em>}</span>
        </label>
      ))}
      <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={!allRequired} onClick={onComplete}>
        Submit Checklist
      </button>
      {allRequired && <p className="field-hint">{config.explain}</p>}
    </div>
  )
}

function CveView({ config, setPhase, onComplete }) {
  const c = config.cve
  return (
    <>
      <div className="panel cve-card">
        <div className="panel-header">
          <div className="panel-title">{c.id}</div>
          <span className="status-pill status-danger">CVSS {c.score}</span>
        </div>
        <p><strong>Vector:</strong> {c.vector}</p>
        <p>{c.desc}</p>
      </div>
      <QuizPanel config={config} onComplete={() => { setPhase('done'); onComplete() }} />
    </>
  )
}

function MatchView({ config, setPhase, onComplete }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">Tool Reference</div>
        <div className="match-grid">
          {config.pairs?.map((p) => (
            <div key={p.id} className="match-item">
              <strong>{p.tool}</strong>
              <span>{p.use}</span>
            </div>
          ))}
        </div>
      </div>
      <QuizPanel config={config} onComplete={() => { setPhase('done'); onComplete() }} />
    </>
  )
}
