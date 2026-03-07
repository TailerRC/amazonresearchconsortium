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

  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show-menu');
      navToggle.closest('.nav__data')?.classList.toggle('show-icon');
    });
  }

  // Dropdown toggle logic
  document.querySelectorAll('.dropdown__item > .nav__link').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = trigger.closest('.dropdown__item');
      const isOpen = parent.classList.contains('open');

      // Close all other dropdowns
      document.querySelectorAll('.dropdown__item.open').forEach((item) => {
        item.classList.remove('open');
      });

      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // Close dropdowns and mobile menu when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown__item.open').forEach((item) => {
      item.classList.remove('open');
    });
    navMenu?.classList.remove('show-menu');
    navToggle?.closest('.nav__data')?.classList.remove('show-icon');
  });
}

loadNavbar();