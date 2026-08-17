import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../context/AuthContext'
import { safeGetItem, safeSetItem } from '../utils/storage'

const CHECKLIST_KEY = 'cybersec-vm-checklist'

const ITEMS = [
  { id: 'vmware', label: 'VMware Workstation / VirtualBox installed', day: 2 },
  { id: 'iso', label: 'Kali Linux or Ubuntu ISO downloaded', day: 2 },
  { id: 'vm-create', label: 'Virtual machine created (4GB RAM, 40GB disk)', day: 2 },
  { id: 'kali-boot', label: 'Kali / Linux VM boots successfully', day: 2 },
  { id: 'terminal', label: 'Terminal opens — tried ls, pwd, cd commands', day: 2 },
  { id: 'network', label: 'VM has internet connection (ping google.com)', day: 2 },
  { id: 'snapshot', label: 'VM snapshot taken before lab experiments', day: 2 },
  { id: 'nmap', label: 'Nmap installed or available in VM', day: 2 },
  { id: 'wireshark', label: 'Wireshark installed for packet capture', day: 2 },
  { id: 'shared', label: 'Understand: never attack real systems without permission', day: 2 },
]

function loadChecklist(username) {
  try {
    const all = JSON.parse(safeGetItem(CHECKLIST_KEY) || '{}')
    return all[username] || {}
  } catch {
    return {}
  }
}

function saveChecklist(username, data) {
  try {
    const all = JSON.parse(safeGetItem(CHECKLIST_KEY) || '{}')
    all[username] = data
    safeSetItem(CHECKLIST_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

export default function VmChecklist() {
  const { session } = useAuth()
  const username = session?.username || 'guest'
  const [checked, setChecked] = useState(() => loadChecklist(username))

  useEffect(() => {
    setChecked(loadChecklist(username))
  }, [username])

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveChecklist(username, next)
      return next
    })
  }

  const done = ITEMS.filter((i) => checked[i.id]).length
  const pct = Math.round((done / ITEMS.length) * 100)

  return (
    <PageShell
      labId="vm-checklist"
      icon="🖥️"
      title="VMware & Linux Lab Checklist"
      description="Bootcamp Day 2 hands-on setup tracker — mark each step as you complete it."
      steps={['Install', 'Configure', 'Verify']}
      currentStep={pct >= 100 ? 2 : pct >= 50 ? 1 : 0}
    >
      <div className="lab-grid lab-grid-single">
        <div className="panel vm-checklist-progress">
          <div className="vm-progress-bar"><div style={{ width: `${pct}%` }} /></div>
          <strong>{done}/{ITEMS.length} complete ({pct}%)</strong>
          <p className="field-hint">Complete all items before Day 2 hands-on labs</p>
        </div>
        <div className="panel">
          <div className="panel-title">Day 2 Setup Checklist</div>
          {ITEMS.map((item) => (
            <label key={item.id} className="checklist-row">
              <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <div className="panel">
          <div className="panel-title">Related Labs</div>
          <div className="sim-chip-row">
            <Link to="/lab/linux" className="info-example-chip">🐧 Linux Commands Lab</Link>
            <Link to="/recon" className="info-example-chip">🕵️ Recon Lab</Link>
            <Link to="/bootcamp" className="info-example-chip">📚 Bootcamp Day 2</Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
