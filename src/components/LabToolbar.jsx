import { useLabSettings } from '../context/LabSettingsContext'

export default function LabToolbar({ labId }) {
  const {
    narrationMode,
    setNarrationMode,
    classMode,
    toggleClassMode,
    toggleFullscreen,
    isFullscreen,
    stopNarration,
    ttsSupported,
  } = useLabSettings()

  if (!labId) return null

  return (
    <div className="lab-toolbar">
      <div className="lab-toolbar-group">
        <span className="lab-toolbar-label">🔊 Voice</span>
        {['off', 'en', 'ta', 'both'].map((mode) => (
          <button
            key={mode}
            type="button"
            className={`lab-toolbar-btn ${narrationMode === mode ? 'active' : ''}`}
            onClick={() => setNarrationMode(mode)}
            title={ttsSupported ? undefined : 'TTS not supported in this browser'}
          >
            {mode === 'off' ? 'Mute' : mode === 'en' ? 'EN' : mode === 'ta' ? 'தமிழ்' : 'EN+TA'}
          </button>
        ))}
        {narrationMode !== 'off' && (
          <button type="button" className="lab-toolbar-btn" onClick={stopNarration}>Stop</button>
        )}
      </div>

      <div className="lab-toolbar-group">
        <span className="lab-toolbar-label">📽 Class</span>
        <button
          type="button"
          className={`lab-toolbar-btn ${classMode ? 'active' : ''}`}
          onClick={toggleClassMode}
        >
          {classMode ? 'Class Mode ON' : 'Class Mode'}
        </button>
        <button type="button" className="lab-toolbar-btn" onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  )
}
