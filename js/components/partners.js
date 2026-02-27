async function loadPartners() {
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/components/partners.css';
  document.head.appendChild(link);

  // Load HTML
  const res = await fetch('/components/partners.html');
  const html = await res.text();
  document.getElementById('partners').innerHTML = html;
}

loadPartners();
