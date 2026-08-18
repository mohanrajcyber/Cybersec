/**
 * Fetches real Google homepage HTML and prepares it for same-origin iframe use.
 * Run: node scripts/prepare-google-html.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/google-real-home.html')

const BRIDGE = `
<!-- CyberSec Arena — Burp Lab bridge (injected) -->
<script>
(function(){
  var PARENT = window.parent !== window ? window.parent : null;
  function send(type, data) {
    if (!PARENT) return;
    PARENT.postMessage(Object.assign({ source: 'cybersec-google', type: type }, data || {}), '*');
  }
  function wire() {
    send('page_load', { url: 'https://www.google.com/', title: document.title });
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var input = form.querySelector('[name="q"]') || form.querySelector('textarea[name="q"]') || form.querySelector('input[type="text"]');
        var q = input ? String(input.value || '').trim() : '';
        if (!q) return;
        send('search', { query: q, url: 'https://www.google.com/search?q=' + encodeURIComponent(q) });
      }, true);
    });
    document.addEventListener('click', function(e) {
      var el = e.target.closest ? e.target.closest('a,button') : null;
      if (!el) return;
      var label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80);
      var href = el.href || el.getAttribute('href') || '';
      if (label || href) send('click', { target: label, url: href || '/' });
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
</script>
`

const BASE_TAG = '<base href="https://www.google.com/">'

async function main() {
  const res = await fetch('https://www.google.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  let html = await res.text()

  if (!html.includes('<base ')) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>${BASE_TAG}`)
  }
  html = html.replace(/<\/body>/i, `${BRIDGE}</body>`)

  writeFileSync(outPath, html, 'utf8')
  console.log(`Wrote ${outPath} (${html.length} bytes)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
