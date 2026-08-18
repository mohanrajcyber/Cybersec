import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'

const raw = 'public/google-real-home.raw.html'
const out = 'public/google-real-home.html'

if (!existsSync(raw)) {
  console.error('Missing', raw, '- run curl first')
  process.exit(1)
}

let html = readFileSync(raw, 'utf8')
const base = '<base href="https://www.google.com/">'
const bridge = `<script>(function(){var P=window.parent!==window?window.parent:null;function s(t,d){P&&P.postMessage(Object.assign({source:"cybersec-google",type:t},d||{}),"*");}function w(){s("page_load",{url:"https://www.google.com/"});document.querySelectorAll("form").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var i=f.querySelector('[name="q"]')||f.querySelector("textarea");var q=i?String(i.value||"").trim():"";if(q)s("search",{query:q,url:"https://www.google.com/search?q="+encodeURIComponent(q)});},true);});document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest("a,button");if(!el)return;var l=(el.getAttribute("aria-label")||el.textContent||"").trim().slice(0,80);var h=el.href||"";if(l||h)s("click",{target:l,url:h||"/"});},true);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",w):w();})();</script>`

if (!html.includes('<base ')) {
  html = html.replace(/<head([^>]*)>/i, `<head$1>${base}`)
}
html = html.replace(/<\/body>/i, `${bridge}</body>`)

writeFileSync(out, html, 'utf8')
unlinkSync(raw)
console.log(`Wrote ${out} (${html.length} bytes)`)
