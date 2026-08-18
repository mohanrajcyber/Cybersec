import { useMemo, useState } from 'react'
import {
  buildHttpRaw,
  buildHttpResponse,
  getEntryPath,
  parseRequestHeaders,
  parseRequestParams,
  enrichLogEntry,
} from '../utils/burpSuiteLog'

const PANEL_TABS = ['HTTP history', 'Options']
const DETAIL_TABS = ['Request', 'Response']
const REQ_SUBTABS = ['Raw', 'Params', 'Headers']

function statusClass(status) {
  if (status >= 200 && status < 300) return 's-2xx'
  if (status >= 300 && status < 400) return 's-3xx'
  if (status >= 400) return 's-4xx'
  return 's-2xx'
}

function formatLength(n) {
  if (!n) return '0'
  if (n >= 1024) return `${Math.round(n / 1024)}k`
  return String(n)
}

export default function BurpProxyPanel({
  logs,
  myLogs,
  selectedLog,
  onSelectLog,
  proxyOn,
  onClearHistory,
  username,
}) {
  const [panelTab, setPanelTab] = useState('HTTP history')
  const [detailTab, setDetailTab] = useState('Request')
  const [reqSubTab, setReqSubTab] = useState('Raw')
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const enrichedLogs = useMemo(() => logs.map(enrichLogEntry), [logs])

  const filteredLogs = useMemo(() => {
    let list = [...enrichedLogs].reverse()
    if (typeFilter === 'search') list = list.filter((l) => l.action === 'search')
    if (typeFilter === 'click') list = list.filter((l) => l.action === 'click')
    if (typeFilter === 'mine') list = list.filter((l) => l.studentUsername === username)
    if (filter.trim()) {
      const q = filter.toLowerCase()
      list = list.filter((l) =>
        getEntryPath(l).toLowerCase().includes(q)
        || l.query?.toLowerCase().includes(q)
        || l.target?.toLowerCase().includes(q)
        || l.host?.toLowerCase().includes(q)
      )
    }
    return list.slice(0, 60)
  }, [enrichedLogs, filter, typeFilter, username])

  const active = selectedLog ? enrichLogEntry(selectedLog) : null
  const params = active ? parseRequestParams(active) : []
  const headers = active ? parseRequestHeaders(active) : []

  const copyRaw = () => {
    if (!active) return
    const text = detailTab === 'Response' ? buildHttpResponse(active) : buildHttpRaw(active)
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="burp-proxy-panel burp-proxy-panel-v2">
      <div className="burp-proxy-head">
        <div className="burp-proxy-brand">
          <span>🔶 Burp Suite Professional</span>
          <span className="burp-proxy-edition">Community · Lab</span>
        </div>
        <span className="burp-proxy-count">{logs.length} total · {myLogs.length} yours</span>
      </div>

      <div className="burp-proxy-tabs">
        {PANEL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`burp-proxy-tab ${panelTab === tab ? 'active' : ''}`}
            onClick={() => setPanelTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {panelTab === 'HTTP history' && (
        <>
          <div className="burp-history-toolbar">
            <input
              type="search"
              className="burp-history-filter"
              placeholder="Filter history (URL, query, host)…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="burp-filter-chips">
              {[
                { id: 'all', label: 'All' },
                { id: 'search', label: 'Search' },
                { id: 'click', label: 'Clicks' },
                { id: 'mine', label: 'Mine' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`burp-filter-chip ${typeFilter === f.id ? 'active' : ''}`}
                  onClick={() => setTypeFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="burp-proxy-split burp-proxy-split-v2">
            <div className="burp-history-table-wrap">
              <div className="burp-history-table-head">
                <span>#</span>
                <span>Host</span>
                <span>M</span>
                <span>URL</span>
                <span>St</span>
                <span>Len</span>
                <span>Mime</span>
              </div>
              <div className="burp-history-list burp-history-list-v2">
                {filteredLogs.length === 0 && (
                  <p className="burp-empty">No traffic yet — search on Google to intercept requests</p>
                )}
                {filteredLogs.map((entry, idx) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`burp-history-row ${selectedLog?.id === entry.id ? 'active' : ''} action-${entry.action}`}
                    onClick={() => onSelectLog(entry)}
                  >
                    <span className="burp-h-idx">{filteredLogs.length - idx}</span>
                    <span className="burp-h-host" title={entry.host}>{entry.host?.replace('www.', '').slice(0, 12)}</span>
                    <span className="burp-h-method">{entry.method}</span>
                    <span className="burp-h-path" title={getEntryPath(entry)}>{getEntryPath(entry)}</span>
                    <span className={`burp-h-status ${statusClass(entry.status)}`}>{entry.status}</span>
                    <span className="burp-h-len">{formatLength(entry.length)}</span>
                    <span className="burp-h-mime">{entry.mime || 'HTML'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="burp-request-view burp-request-view-v2">
              {active ? (
                <>
                  <div className="burp-req-meta">
                    <span className={`burp-action-tag ${active.action}`}>{active.action}</span>
                    <strong>{active.studentName}</strong> · @{active.studentUsername}
                    <span className="burp-req-host"> · {active.host}</span>
                    <span className={`burp-h-status ${statusClass(active.status)}`}>{active.status}</span>
                    <button type="button" className="burp-copy-btn" onClick={copyRaw}>Copy</button>
                  </div>

                  <div className="burp-detail-tabs">
                    {DETAIL_TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={detailTab === tab ? 'active' : ''}
                        onClick={() => setDetailTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {detailTab === 'Request' && (
                    <>
                      <div className="burp-subtabs">
                        {REQ_SUBTABS.map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            className={reqSubTab === tab ? 'active' : ''}
                            onClick={() => setReqSubTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      {reqSubTab === 'Raw' && (
                        <pre className="burp-raw-http">{buildHttpRaw(active)}</pre>
                      )}
                      {reqSubTab === 'Params' && (
                        <table className="burp-kv-table">
                          <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
                          <tbody>
                            {params.length === 0 ? (
                              <tr><td colSpan={2} className="burp-empty-cell">No parameters</td></tr>
                            ) : params.map((p) => (
                              <tr key={p.name}><td>{p.name}</td><td><code>{p.value}</code></td></tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {reqSubTab === 'Headers' && (
                        <table className="burp-kv-table">
                          <thead><tr><th>Header</th><th>Value</th></tr></thead>
                          <tbody>
                            {headers.map((h) => (
                              <tr key={h.name} className={h.name.startsWith('X-ICT') ? 'highlight-row' : ''}>
                                <td>{h.name}</td><td>{h.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </>
                  )}

                  {detailTab === 'Response' && (
                    <pre className="burp-raw-http burp-raw-response">{buildHttpResponse(active)}</pre>
                  )}

                  {active.query && (
                    <div className="burp-highlight">
                      🔍 Search query captured: <code>{active.query}</code>
                    </div>
                  )}
                  {active.target && (
                    <div className="burp-highlight dim">Target: {active.target}</div>
                  )}
                </>
              ) : (
                <p className="burp-empty">Select a request to inspect Request / Response</p>
              )}
            </div>
          </div>
        </>
      )}

      {panelTab === 'Options' && (
        <div className="burp-options-panel">
          <h4>Proxy Options (Lab)</h4>
          <ul>
            <li><strong>Proxy logging:</strong> {proxyOn ? 'Enabled' : 'Paused'}</li>
            <li><strong>Capture search queries:</strong> Enabled</li>
            <li><strong>Log student header:</strong> X-ICT-Student</li>
            <li><strong>Target scope:</strong> *.google.com (simulated)</li>
          </ul>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClearHistory}>Clear HTTP history</button>
        </div>
      )}
    </div>
  )
}
