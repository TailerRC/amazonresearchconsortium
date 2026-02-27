const _partnersScript = document.currentScript;
async function loadPartners() {
  const base = _partnersScript.getAttribute('src').replace('js/components/partners.js', '');
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = base + 'css/components/partners.css';
  document.head.appendChild(link);

  // Load HTML
  const res = await fetch(base + 'components/partners.html');
  const html = await res.text();
  document.getElementById('partners').innerHTML = html;
}

loadPartners();
