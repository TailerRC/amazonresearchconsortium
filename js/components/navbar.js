const _navbarScript = document.currentScript;
async function loadNavbar() {
  const base = _navbarScript.getAttribute('src').replace('js/components/navbar.js', '');
  // Loaded CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = base + 'css/components/navbar.css';
  document.head.appendChild(link);

  // This part is for loading the HTML content of the navbar
  const res = await fetch(base + 'components/navbar.html');
  const html = await res.text();
  document.getElementById('navbar').innerHTML = html;

  // Dropdown toggle logic
  document.querySelectorAll('.has-dropdown > button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-item');
      const isOpen = parent.classList.contains('open');

      // Close all other dropdowns
      document.querySelectorAll('.nav-item.open').forEach((item) => {
        item.classList.remove('open');
      });

      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-item.open').forEach((item) => {
      item.classList.remove('open');
    });
  });
}

loadNavbar();