/** Burp Suite Proxy Lab — 3 guided challenge tasks for students */

export const SUSPICIOUS_HOST = 'secure-auxilium-login.xyz'
export const SUSPICIOUS_URL = `https://${SUSPICIOUS_HOST}/signin?session=expired`

export const BURP_CHALLENGE_TASKS = [
  {
    id: 'task1',
    title: 'Capture a Google Search (GET)',
    titleTa: 'Google Search GET request capture pannunga',
    steps: [
      'Left side Google-la oru word search pannunga (e.g. cyber security, vijay).',
      'Right side Burp panel → HTTP history tab open irukkanum.',
      'Proxy INTERCEPT ON irukkanum (toolbar-la orange dot).',
      'Table-la oru row varum — Method column-la GET, URL-la /search?q=... paathu confirm pannunga.',
      'Ready-aa irundha Submit click pannunga.',
    ],
    hint: 'Search pannumbodhu GET /search?q=... request HTTP history-la log aagum.',
    submitLabel: 'Submit Task 1',
    needsAnswer: false,
  },
  {
    id: 'task2',
    title: 'Edit URL — ?q=test parameter',
    titleTa: 'Address bar-la URL edit pannunga',
    steps: [
      'Browser address bar-la type pannunga: https://www.google.com/search?q=test',
      'Enter press pannunga — Google results load aagum.',
      'Burp HTTP history-la latest GET request select pannunga.',
      'Request tab → Params sub-tab open pannunga — q = test paathu confirm pannunga.',
      'Kelaa question-ku answer select pannitu Submit pannunga.',
    ],
    hint: 'URL-la ?q=test add pannumbodhu enna parameter change aachu nu think pannunga.',
    submitLabel: 'Submit Task 2',
    needsAnswer: true,
    question: 'What changed when you edited the URL to ?q=test?',
    options: [
      { id: 'q', label: 'The search query parameter (q) changed to "test"' },
      { id: 'post', label: 'The HTTP method changed from GET to POST' },
      { id: 'host', label: 'The Host header changed to mail.google.com' },
      { id: 'cookie', label: 'The browser deleted all cookies' },
    ],
    correctOption: 'q',
  },
  {
    id: 'task3',
    title: 'Suspicious link — find the Host',
    titleTa: 'Suspicious link click pannitu Host identify pannunga',
    steps: [
      'Google-la search pannunga (any word).',
      'Results-la ⚠️ orange border irukura "Auxilium College — Student Portal Login" link click pannunga.',
      'Burp HTTP history-la new row varum — Host column paathunga.',
      'Host name type pannitu Submit pannunga (e.g. secure-auxilium-login.xyz).',
    ],
    hint: 'Phishing sites often use fake domains that look official but differ slightly.',
    submitLabel: 'Submit Task 3',
    needsAnswer: true,
    question: 'What is the Host name shown in HTTP History for the suspicious link?',
    answerPlaceholder: 'e.g. secure-auxilium-login.xyz',
  },
]

export function verifyTask1Action(myLogs) {
  return myLogs.some((l) => l.action === 'search' && l.method === 'GET')
}

export function verifyTask2Action(myLogs) {
  return myLogs.some(
    (l) => l.action === 'search' && String(l.query || '').toLowerCase() === 'test',
  )
}

export function verifyTask2Answer(optionId) {
  return optionId === 'q'
}

export function verifyTask3Action(myLogs) {
  return myLogs.some(
    (l) => l.host?.includes('secure-auxilium-login') || l.host?.includes('auxilium-login'),
  )
}

export function verifyTask3Answer(raw) {
  const a = String(raw || '').toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  return a === SUSPICIOUS_HOST || a.includes('secure-auxilium-login')
}

export function verifyTaskAction(taskId, myLogs) {
  if (taskId === 'task1') return verifyTask1Action(myLogs)
  if (taskId === 'task2') return verifyTask2Action(myLogs)
  if (taskId === 'task3') return verifyTask3Action(myLogs)
  return false
}

export function verifyTaskAnswer(taskId, answer) {
  if (taskId === 'task2') return verifyTask2Answer(answer)
  if (taskId === 'task3') return verifyTask3Answer(answer)
  return true
}
