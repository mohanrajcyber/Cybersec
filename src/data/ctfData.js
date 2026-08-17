export const CTF_CHALLENGES = [
  {
    id: 'port',
    title: 'Port Puzzle',
    hint: 'Which port does HTTPS use? Format: ICT{number}',
    answer: 'ICT{443}',
    hintText: 'HTTPS = Hypertext Transfer Protocol Secure. Check IANA well-known ports.',
  },
  {
    id: 'base64',
    title: 'Decode the Message',
    hint: 'Decode: VGVsbG8gQ3liZXIgU3R1ZGVudCE=',
    answer: 'ICT{Hello_Cyber_Student}',
    hintText: 'This is Base64 encoding. Use an online decoder or Python: import base64',
  },
  {
    id: 'hash',
    title: 'Security Term',
    hint: 'What does CIA stand for in security? (one word — Confidentiality\'s partner)',
    answer: 'ICT{Integrity}',
    hintText: 'CIA Triad: Confidentiality, ___, Availability',
  },
]
