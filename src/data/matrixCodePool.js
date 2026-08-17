/** Code fragments for MatrixRain — multi-language + security / hacking context */

export const CODE_SYMBOLS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}[]();=<>/\\|&^%#@_$+-*~:.'\"`,!?"

export const CODE_FRAGMENTS = [
  // Python
  'import os', 'import sys', 'def scan():', 'print("ok")', 'if __name__', 'socket.connect',
  'subprocess.run', 'requests.get', 'hashlib.sha256', 'pickle.loads', 'try: except',
  'lambda x:', 'class Exploit', 'for i in range', 'while True:', 'pip install',
  // JavaScript / TypeScript
  'const hack', 'let payload', 'async function', 'await fetch', 'document.get',
  'JSON.parse', 'localStorage', '=> { return', "require('net')", 'console.log',
  'export default', 'npm run', 'node -e', 'eval(atob',
  // SQL
  'SELECT * FROM', 'DROP TABLE', 'UNION SELECT', 'OR 1=1--', 'INSERT INTO',
  'UPDATE users', 'DELETE FROM', 'WHERE id=', 'GROUP BY', 'INFORMATION_SCHEMA',
  // Bash / Linux
  'sudo nmap', 'chmod 777', 'grep -r', 'curl -X POST', 'ssh root@', 'cat /etc/passwd',
  'netstat -an', 'tcpdump -i', 'whoami', 'id -u', 'ls -la', 'wget http', 'bash -i',
  // Hacking tools
  'nmap -sS', 'nmap -sV', 'msfconsole', 'hydra -l', 'hashcat -m', 'sqlmap -u',
  'burpsuite', 'wireshark', 'aircrack-ng', 'john --wordlist', 'metasploit', 'nikto -h',
  'gobuster dir', 'ffuf -u', 'responder', 'bloodhound', 'mimikatz', 'enum4linux',
  // Crypto / security
  '0xDEADBEEF', '0xFF00FF', 'CVE-2024-', 'AES-256-GCM', 'RSA-2048', 'SHA256(',
  'MD5 hash', 'base64_decode', 'XSS payload', 'SQL injection', 'CSRF token',
  'JWT decode', 'phishing URL', 'malware.exe', 'ransomware', 'privilege esc',
  // Network
  '192.168.1.1', '10.0.0.1', 'TCP SYN', 'DNS query', 'HTTP/1.1 200', 'TLS 1.3',
  'port 443', 'port 22', 'ping -c 4', 'traceroute', 'ARP spoof', 'MITM attack',
  'IPv6 ::1', 'UDP flood', 'packet sniff',
  // C / C++
  '#include <stdio', 'int main(){', 'printf("%s', 'malloc(size', 'strcpy(buf',
  'void *ptr', 'sizeof(int)', 'return 0;',
  // Java
  'public static', 'void main(String', 'System.out', 'new Thread', 'Runtime.exec',
  // Rust / Go / PHP
  'fn main() {', 'mut payload', 'impl Scan', 'package main', 'func hack()',
  '<?php $_GET', 'echo shell_exec', 'unsafe {',
  // HTML / web
  '<script>', 'onerror=', 'document.cookie', 'window.location', 'fetch("/api',
  // Misc real code patterns
  'password123', 'admin:admin', 'root:toor', 'flag{CTF_', 'ssh-keygen', 'openssl enc',
  'python3 -c', 'gcc -o exploit', 'chmod +x', './exploit', 'nc -lvnp', 'msfvenom -p',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomSymbol() {
  return CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)]
}

export function randomFragment() {
  return pick(CODE_FRAGMENTS)
}

/** Next character for a column stream (cycles through a code fragment) */
export function nextStreamChar(stream, index) {
  if (!stream || stream.length === 0) return randomSymbol()
  return stream[index % stream.length]
}

export function freshColumnStream() {
  // ~72% real code snippets, ~28% random symbol rain
  if (Math.random() < 0.72) {
    const fragment = randomFragment()
    return { text: fragment, index: Math.floor(Math.random() * fragment.length) }
  }
  return { text: '', index: 0, symbolsOnly: true }
}
