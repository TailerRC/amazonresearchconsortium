const _navbarScript = document.currentScript;
async function loadNavbar() {
  const base = _navbarScript.getAttribute('src').replace('js/components/navbar.js', '');
  
  const faFiles = [
    'assets/fontawesome/css/fontawesome.css',
    'assets/fontawesome/css/brands.css',
    'assets/fontawesome/css/solid.css',
    'assets/fontawesome/css/sharp-thin.css',
    'assets/fontawesome/css/sharp-duotone-thin.css',
  ];
  faFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + file;
    document.head.appendChild(link);
  });
  
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
  const navOverlay = document.getElementById('nav-overlay');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show-menu');
      navOverlay?.classList.toggle('visible');
      navToggle.classList.toggle('hidden');
    });
  }

  // Close menu when clicking overlay
  navOverlay?.addEventListener('click', () => {
    navMenu?.classList.remove('show-menu');
    navOverlay?.classList.remove('visible');
    navToggle?.classList.remove('hidden');
  });

  // Swipe to open/close menu
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!navMenu) return;

    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchStartX - touchCurrentX;
    const diffY = Math.abs(touchStartY - touchCurrentY);

    // Solo procesar si el movimiento es más horizontal que vertical
    if (diffY > 10 && diffY > diffX * 0.5) return;

    // Swipe izquierda (abrir menú)
    if (diffX > 50 && !navMenu.classList.contains('show-menu')) {
      navMenu.classList.add('show-menu');
      navOverlay?.classList.add('visible');
      navToggle?.classList.add('hidden');
    }
    // Swipe derecha (cerrar menú)
    else if (diffX < -50 && navMenu.classList.contains('show-menu')) {
      navMenu.classList.remove('show-menu');
      navOverlay?.classList.remove('visible');
      navToggle?.classList.remove('hidden');
    }
  }, { passive: true });

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
    navOverlay?.classList.remove('visible');
    navToggle?.classList.remove('hidden');
  });

  // Mobile search modal
  const mobileSearchBtn   = document.getElementById('nav-search-mobile-btn');
  const mobileSearchModal = document.getElementById('mobile-search-modal');
  const mobileSearchClose = document.getElementById('mobile-search-modal-close');
  const mobileOverlay     = document.getElementById('mobile-search-overlay');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  function openMobileSearch(e) {
    e.stopPropagation();
    mobileSearchModal?.classList.add('open');
    mobileSearchModal?.setAttribute('aria-hidden', 'false');
    setTimeout(() => mobileSearchInput?.focus(), 50);
  }

  function closeMobileSearch() {
    mobileSearchModal?.classList.remove('open');
    mobileSearchModal?.setAttribute('aria-hidden', 'true');
  }

  mobileSearchBtn?.addEventListener('click', openMobileSearch);
  mobileSearchClose?.addEventListener('click', closeMobileSearch);
  mobileOverlay?.addEventListener('click', closeMobileSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileSearch();
  });

  // Sticky nav: fix the blue bar once the header scrolls past the viewport
  const nav = document.querySelector('.nav');
  const siteHeader = document.querySelector('.site-header');

  // Insert a spacer after #navbar to avoid content jump when nav becomes fixed
  const spacer = document.createElement('div');
  spacer.className = 'nav-spacer';
  document.getElementById('navbar').after(spacer);

  function handleNavScroll() {
    const headerBottom = siteHeader ? siteHeader.getBoundingClientRect().bottom : 0;
    if (headerBottom <= 0) {
      nav?.classList.add('nav--fixed');
      spacer.classList.add('visible');
    } else {
      nav?.classList.remove('nav--fixed');
      spacer.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load
}

loadNavbar();