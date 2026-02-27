async function loadFooter() {
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/components/footer.css';
  document.head.appendChild(link);

  // Load HTML
  const res = await fetch('/components/footer.html');
  const html = await res.text();
  document.getElementById('footer').innerHTML = html;
}

loadFooter();
