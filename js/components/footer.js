const _footerScript = document.currentScript;
async function loadFooter() {
  const base = _footerScript.getAttribute('src').replace('js/components/footer.js', '');
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = base + 'css/components/footer.css';
  document.head.appendChild(link);

  // Load HTML
  const res = await fetch(base + 'components/footer.html');
  const html = await res.text();
  document.getElementById('footer').innerHTML = html;
}

loadFooter();
