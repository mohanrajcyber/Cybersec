import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { speakBilingual, stopSpeech, preloadVoices, isTTSSupported } from '../utils/tts'
import { getLabSpeech } from '../data/labVizConfig'

const LabSettingsContext = createContext(null)

const NARRATION_KEY = 'cybersec-narration'
const CLASS_MODE_KEY = 'cybersec-class-mode'

export function LabSettingsProvider({ children }) {
  const [narrationMode, setNarrationModeState] = useState(
    () => localStorage.getItem(NARRATION_KEY) || 'en'
  )
  const [classMode, setClassModeState] = useState(
    () => localStorage.getItem(CLASS_MODE_KEY) === 'true'
  )
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    preloadVoices()
    localStorage.setItem(NARRATION_KEY, narrationMode)
  }, [narrationMode])

  useEffect(() => {
    localStorage.setItem(CLASS_MODE_KEY, String(classMode))
    document.body.classList.toggle('class-mode', classMode)
  }, [classMode])

  useEffect(() => {
    document.body.classList.toggle('class-mode-fs', isFullscreen)
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const setNarrationMode = useCallback((mode) => {
    if (mode === 'off') stopSpeech()
    setNarrationModeState(mode)
  }, [])

  const toggleClassMode = useCallback(() => setClassModeState((v) => !v), [])

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } catch {
      setClassModeState(true)
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    setIsFullscreen(false)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await exitFullscreen()
    else await enterFullscreen()
  }, [enterFullscreen, exitFullscreen])

  const narratePhase = useCallback(
    (labId, phase) => {
      if (narrationMode === 'off') return
      const { en, ta } = getLabSpeech(labId, phase)
      speakBilingual(en, ta, narrationMode)
    },
    [narrationMode]
  )

  const stopNarration = useCallback(() => stopSpeech(), [])

  return (
    <LabSettingsContext.Provider
      value={{
        narrationMode,
        setNarrationMode,
        classMode,
        toggleClassMode,
        setClassMode: setClassModeState,
        isFullscreen,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
        narratePhase,
        stopNarration,
        ttsSupported: isTTSSupported(),
      }}
    >
      {children}
    </LabSettingsContext.Provider>
  )
}

export function useLabSettings() {
  const ctx = useContext(LabSettingsContext)
  if (!ctx) throw new Error('useLabSettings must be used within LabSettingsProvider')
  return ctx
}
