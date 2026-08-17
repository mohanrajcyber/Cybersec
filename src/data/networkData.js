export const PACKETS = [
  { id: 1, time: '09:14:02', src: '192.168.1.10', dst: '8.8.8.8', proto: 'DNS', info: 'Standard DNS query — google.com', suspicious: false },
  { id: 2, time: '09:14:15', src: '192.168.1.105', dst: '185.220.101.45', proto: 'TCP', info: 'SYN to port 4444 — 0 bytes payload', suspicious: true },
  { id: 3, time: '09:14:16', src: '192.168.1.22', dst: '192.168.1.1', proto: 'HTTP', info: 'GET /index.html — 200 OK', suspicious: false },
  { id: 4, time: '09:15:01', src: '192.168.1.105', dst: '185.220.101.45', proto: 'TCP', info: 'SYN to port 4444 — beacon interval 60s', suspicious: true },
  { id: 5, time: '09:15:30', src: '192.168.1.50', dst: '142.250.80.46', proto: 'HTTPS', info: 'TLS handshake — youtube.com', suspicious: false },
  { id: 6, time: '09:16:01', src: '192.168.1.105', dst: '185.220.101.45', proto: 'TCP', info: 'SYN to port 4444 — repeated callback', suspicious: true },
]

export const PACKET_INSIGHT = {
  correct: 'Correct! Packets #2, #4, #6 show a C2 beacon pattern — internal host 192.168.1.105 connecting to 185.220.101.45:4444 every ~60 seconds. This is classic command-and-control behavior.',
  wrong: 'Not the most suspicious. Look for repeated outbound connections to non-standard ports from internal hosts.',
}
