import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { computeScore, getEarnedBadges } from '../data/badges'
import { TRAINER } from '../data/trainer'
import { validateStudentCredentials } from '../utils/studentAuth'
import { safeSetItem, safeGetItem } from '../utils/storage'

const AuthContext = createContext(null)

const SESSION_KEY = 'cybersec-session'
const STUDENTS_KEY = 'cybersec-students'
const THEME_KEY = 'cybersec-theme'

const defaultBootcamp = {
  day1: {
    introCybersecurity: false,
    attackMethods: false,
    threatLandscape: false,
    cyberIntelligence: false,
    cyberStrategy: false,
  },
  day2: {
    targetedIndustries: false,
    coreSecurityIntelligence: false,
    protectOrganization: false,
    enterpriseSecurity: false,
    attackTaxonomy: false,
  },
  day3: {
    urlPhishingDefense: false,
    digitalFootprint: false,
    networkDefense: false,
    handsOnProject: false,
    sessionComplete: false,
  },
}

function defaultStudentData(name) {
  return {
    name,
    bootcamp: defaultBootcamp,
    visitedModules: [],
    completedLabs: [],
    ctfFlags: [],
    ctfHints: {},
    lastLogin: new Date().toISOString(),
  }
}

function normalizeStudentData(raw, name) {
  const base = defaultStudentData(name)
  if (!raw || typeof raw !== 'object') return base
  return {
    ...base,
    ...raw,
    name: raw.name || name,
    bootcamp: {
      day1: { ...base.bootcamp.day1, ...(raw.bootcamp?.day1 || {}) },
      day2: { ...base.bootcamp.day2, ...(raw.bootcamp?.day2 || {}) },
      day3: { ...base.bootcamp.day3, ...(raw.bootcamp?.day3 || {}) },
    },
    visitedModules: Array.isArray(raw.visitedModules) ? raw.visitedModules : [],
    completedLabs: Array.isArray(raw.completedLabs) ? raw.completedLabs : [],
    ctfFlags: Array.isArray(raw.ctfFlags) ? raw.ctfFlags : [],
    ctfHints: raw.ctfHints && typeof raw.ctfHints === 'object' ? raw.ctfHints : {},
  }
}

function loadStudentData(session) {
  if (session?.type !== 'student' || !session.username) return null
  const students = loadStudents()
  return normalizeStudentData(students[session.username], session.name)
}

function loadStudents() {
  try {
    const raw = safeGetItem(STUDENTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStudents(students) {
  return safeSetItem(STUDENTS_KEY, JSON.stringify(students))
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [studentData, setStudentData] = useState(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY)
      const session = s ? JSON.parse(s) : null
      return loadStudentData(session)
    } catch {
      return null
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (session?.type === 'student' && session.username) {
      setStudentData(loadStudentData(session))
    } else {
      setStudentData(null)
    }
  }, [session])

  const persistStudent = useCallback(
    (updater) => {
      if (session?.type !== 'student' || !session.username) return
      setStudentData((prev) => {
        const stored = loadStudents()
        const base = normalizeStudentData(prev ?? stored[session.username], session.name)
        const next = typeof updater === 'function' ? updater(base) : { ...base, ...updater }
        stored[session.username] = { ...next, name: session.name, username: session.username, lastLogin: new Date().toISOString() }
        const saved = saveStudents(stored)
        if (!saved.ok) {
          console.error(saved.error)
          return base
        }
        return next
      })
    },
    [session]
  )

  const loginStudent = (username, password) => {
    const check = validateStudentCredentials(username, password)
    if (!check.ok) return check

    const students = loadStudents()
    if (!students[check.studentId]) students[check.studentId] = defaultStudentData(check.displayName)
    else {
      students[check.studentId].name = check.displayName
      students[check.studentId].lastLogin = new Date().toISOString()
    }
    const saved = saveStudents(students)
    if (!saved.ok) return saved

    const s = { type: 'student', name: check.displayName, username: check.studentId }
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    setSession(s)
    setStudentData(normalizeStudentData(students[check.studentId], check.displayName))
    return { ok: true }
  }

  const loginTrainer = (username, password) => {
    if (username === TRAINER.username && password === TRAINER.password) {
      const s = { type: 'trainer', name: TRAINER.name }
      localStorage.setItem(SESSION_KEY, JSON.stringify(s))
      setSession(s)
      return { ok: true }
    }
    return { ok: false, error: 'Invalid trainer credentials.' }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
    setStudentData(null)
  }

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const toggleTopic = (day, topic) => {
    persistStudent((prev) => ({
      ...prev,
      bootcamp: { ...prev.bootcamp, [day]: { ...prev.bootcamp[day], [topic]: !prev.bootcamp[day][topic] } },
    }))
  }

  const markModuleVisited = (moduleId) => {
    persistStudent((prev) => {
      const visited = prev.visitedModules ?? []
      return {
        ...prev,
        visitedModules: visited.includes(moduleId) ? visited : [...visited, moduleId],
      }
    })
  }

  const completeLab = (labId) => {
    persistStudent((prev) => {
      const completed = prev.completedLabs ?? []
      return {
        ...prev,
        completedLabs: completed.includes(labId) ? completed : [...completed, labId],
      }
    })
  }

  const addCtfFlag = (flagId) => {
    persistStudent((prev) => ({
      ...prev,
      ctfFlags: prev.ctfFlags.includes(flagId) ? prev.ctfFlags : [...prev.ctfFlags, flagId],
    }))
  }

  const unlockCtfHint = (challengeId) => {
    persistStudent((prev) => ({
      ...prev,
      ctfHints: { ...prev.ctfHints, [challengeId]: true },
    }))
  }

  const getDayProgress = (day) => {
    if (!studentData?.bootcamp?.[day]) return 0
    const topics = Object.values(studentData.bootcamp[day])
    return Math.round((topics.filter(Boolean).length / topics.length) * 100)
  }

  const getOverallProgress = () => {
    if (!studentData?.bootcamp) return 0
    const all = Object.values(studentData.bootcamp).flatMap((d) => Object.values(d))
    return Math.round((all.filter(Boolean).length / all.length) * 100)
  }

  const getScore = () => (studentData ? computeScore(studentData) : 0)
  const getBadges = () => (studentData ? getEarnedBadges(studentData) : [])

  const getLeaderboard = () => {
    const students = loadStudents()
    return Object.entries(students)
      .map(([username, data]) => ({
        username,
        name: data.name,
        score: computeScore(data),
        bootcamp: (() => {
          const all = Object.values(data.bootcamp || {}).flatMap((d) => Object.values(d))
          return all.length ? Math.round((all.filter(Boolean).length / all.length) * 100) : 0
        })(),
        badges: getEarnedBadges(data).length,
        ctf: data.ctfFlags?.length || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }

  const getAllStudents = () => {
    const students = loadStudents()
    return Object.entries(students).map(([username, data]) => ({
      username,
      ...data,
      score: computeScore(data),
      badges: getEarnedBadges(data),
    }))
  }

  const bootcamp = studentData?.bootcamp || defaultBootcamp
  const visitedModules = studentData?.visitedModules || []
  const completedLabs = studentData?.completedLabs || []
  const ctfFlags = studentData?.ctfFlags || []
  const ctfHints = studentData?.ctfHints || {}

  return (
    <AuthContext.Provider
      value={{
        session,
        isStudent: session?.type === 'student',
        isTrainer: session?.type === 'trainer',
        studentName: session?.name,
        rollNo: session?.username,
        username: session?.username,
        loginStudent,
        loginTrainer,
        logout,
        theme,
        toggleTheme,
        bootcamp,
        toggleTopic,
        getDayProgress,
        getOverallProgress,
        visitedModules,
        completedLabs,
        markModuleVisited,
        completeLab,
        ctfFlags,
        ctfHints,
        addCtfFlag,
        unlockCtfHint,
        getScore,
        getBadges,
        getLeaderboard,
        getAllStudents,
        trainer: TRAINER,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// backward compat alias
export const useProgress = useAuth
