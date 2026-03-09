(function () {
  const script = document.currentScript;
  const base = script.getAttribute('src').replace('js/components/scroll-to-top.js', '');

  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = base + 'css/components/scroll-to-top.css';
  document.head.appendChild(link);

  // Inject button
  const btn = document.createElement('button');
  btn.id = 'scroll-to-top-btn';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  document.body.appendChild(btn);

  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
