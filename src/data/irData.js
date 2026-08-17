export const IR_STEPS = [
  { id: 'detect', label: 'Detect', desc: 'Identify the security incident through alerts, logs, or user reports.' },
  { id: 'contain', label: 'Contain', desc: 'Isolate affected systems to prevent spread — block IPs, disable accounts, segment network.' },
  { id: 'eradicate', label: 'Eradicate', desc: 'Remove the threat — delete malware, patch vulnerabilities, revoke compromised credentials.' },
  { id: 'recover', label: 'Recover', desc: 'Restore systems from clean backups, verify integrity, and return to normal operations.' },
]

export const IR_SCENARIO = {
  title: 'Simulated Ransomware Alert',
  description: 'Multiple workstations showing encrypted files. SOC alert: suspicious outbound traffic to unknown IP. Your task: arrange the incident response steps in the correct order.',
}
