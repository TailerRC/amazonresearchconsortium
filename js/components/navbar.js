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

  // Apply translations to the newly loaded navbar
  if (window.i18n && typeof window.i18n.reapply === 'function') {
    window.i18n.reapply();
  }

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

  // Language switcher – single element, moved between desktop/mobile containers
  const langSelect = document.getElementById('custom-lang-desktop');
  const desktopSlot = document.querySelector('.nav__languages');
  const mobileSlot = document.getElementById('nav-menu-lang-slot');
  const currentLang = localStorage.getItem('i18n_lang') || 'en';

  // Move the single selector between containers based on viewport
  const mobileMediaQuery = window.matchMedia('(max-width: 800px)');

  function moveLangSelector() {
    if (!langSelect) return;
    if (mobileMediaQuery.matches && mobileSlot) {
      mobileSlot.appendChild(langSelect);
    } else if (desktopSlot) {
      desktopSlot.appendChild(langSelect);
    }
    // Close dropdown when moving
    langSelect.classList.remove('open');
  }

  moveLangSelector();
  mobileMediaQuery.addEventListener('change', moveLangSelector);

  // Helper: update custom dropdown display to match a language
  function updateLangSelectors(lang) {
    if (!langSelect) return;
    const valueSpan = langSelect.querySelector('.custom-lang-select__value');
    if (valueSpan) valueSpan.textContent = lang.toUpperCase();

    langSelect.querySelectorAll('.custom-lang-select__option').forEach((opt) => {
      opt.classList.toggle('selected', opt.dataset.value === lang);
    });
  }

  // Set current language on initial load
  updateLangSelectors(currentLang);

  // Init custom dropdown behavior
  if (langSelect) {
    const trigger = langSelect.querySelector('.custom-lang-select__trigger');
    const options = langSelect.querySelectorAll('.custom-lang-select__option');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelect.classList.toggle('open');
    });

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = opt.dataset.value;
        updateLangSelectors(lang);
        langSelect.classList.remove('open');

        if (window.i18n && typeof window.i18n.setLang === 'function') {
          window.i18n.setLang(lang);
        }
      });
    });
  }

  // Close custom dropdown when clicking outside
  document.addEventListener('click', () => {
    langSelect?.classList.remove('open');
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