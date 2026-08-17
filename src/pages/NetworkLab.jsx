import { useState, useCallback } from 'react'
import PageShell from '../components/PageShell'
import LabVisualDemo from '../components/LabVisualDemo'
import { useAuth } from '../context/AuthContext'
import { useLabSettings } from '../context/LabSettingsContext'
import { getModuleDetails } from '../data/moduleDetails'
import { PACKETS, PACKET_INSIGHT } from '../data/networkData'

export default function NetworkLab() {
  const { markModuleVisited, completeLab } = useAuth()
  const { narratePhase } = useLabSettings()
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [phase, setPhaseRaw] = useState('idle')
  const [demoStarted, setDemoStarted] = useState(false)

  const setPhase = useCallback((p) => {
    setPhaseRaw(p)
    narratePhase('network', p)
  }, [narratePhase])

  const suspicious = PACKETS.find((p) => p.suspicious)

  const startDemo = () => {
    setDemoStarted(true)
    markModuleVisited('network')
    setPhase('capture')
    setTimeout(() => setPhase('analyze'), 1200)
  }

  const handleSelect = (pkt) => {
    if (!demoStarted || answered) return
    setSelected(pkt.id)
    setAnswered(true)
    if (pkt.suspicious) {
      setPhase('suspicious')
      completeLab('network')
      setTimeout(() => setPhase('done'), 1000)
    } else {
      setPhase('analyze')
    }
  }

  return (
    <PageShell
      labId="network"
      icon="🌐"
      title="Network Analysis"
      description="Watch packet capture animation, then find suspicious traffic in the simulated Wireshark view."
      detailsSections={getModuleDetails('network')}
      steps={['Capture', 'Analyze', 'Identify']}
      currentStep={answered ? 2 : demoStarted ? 1 : 0}
    >
      <div className="lab-grid lab-grid-single">
        <div className="lab-main">
          <LabVisualDemo
            labId="network"
            phase={phase}
            meta={{ highlightId: answered && suspicious ? suspicious.id : null }}
          />

          {!demoStarted && (
            <div className="panel-actions">
              <button type="button" className="btn btn-primary" onClick={startDemo}>▶ Start Capture Demo</button>
            </div>
          )}

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Packet Capture — training_capture.pcap</div>
              <span className="panel-meta">{demoStarted ? '847 packets · live sim' : 'Wireshark Sim'}</span>
            </div>
            <p className="field-hint" style={{ marginBottom: '1rem' }}>
              {demoStarted
                ? 'Most suspicious packet click pannunga — unusual port / repeated connections paarunga.'
                : 'Start Capture Demo click pannunga — animation + voice narration sync aagum.'}
            </p>
            <div className="table-wrap">
              <table className="scan-table packet-table">
                <thead>
                  <tr><th>#</th><th>Time</th><th>Source</th><th>Destination</th><th>Proto</th><th>Info</th></tr>
                </thead>
                <tbody>
                  {PACKETS.map((p) => (
                    <tr
                      key={p.id}
                      className={`packet-row ${!demoStarted ? 'disabled' : ''} ${selected === p.id ? 'selected' : ''} ${answered && p.suspicious ? 'highlight-row' : ''} ${answered && selected === p.id && !p.suspicious ? 'wrong-row' : ''}`}
                      onClick={() => handleSelect(p)}
                    >
                      <td>{p.id}</td>
                      <td>{p.time}</td>
                      <td><code>{p.src}</code></td>
                      <td><code>{p.dst}</code></td>
                      <td>{p.proto}</td>
                      <td>{p.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {answered && (
              <div className={`feedback ${PACKETS.find((p) => p.id === selected)?.suspicious ? 'success' : 'error'}`} style={{ marginTop: '1rem' }}>
                {PACKETS.find((p) => p.id === selected)?.suspicious ? PACKET_INSIGHT.correct : PACKET_INSIGHT.wrong}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
