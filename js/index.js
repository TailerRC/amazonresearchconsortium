/* ==============================
   Hero Carousel – 3 slides
   ============================== */
(function () {
  const heroTrack = document.getElementById('heroCarousel');
  if (!heroTrack) return;

  const heroSlides = heroTrack.querySelectorAll('.hero-slide').length;
  const heroDots = document.querySelectorAll('#heroDots .hero-dot');
  let heroIndex = 0;
  let heroTimer;

  function goToHero(index) {
    heroIndex = (index + heroSlides) % heroSlides;
    heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
    heroDots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
  }

  heroDots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(heroTimer);
    goToHero(i);
    startHeroAutoplay();
  }));

  function startHeroAutoplay() {
    heroTimer = setInterval(() => goToHero(heroIndex + 1), 5000);
  }

  startHeroAutoplay();
})();

/* ==============================
   Data Hub – Dashboard Spotlight
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('dataTabs');
  if (!tabsContainer) return;

  const dashboards = [
    {
      icon: 'fa-solid fa-mosquito-net',
      tabLabel: 'dashboard.tab1',
      title: 'dashboard.title1',
      badge: 'dashboard.badge1',
      tags: ['dashboard.tag1a', 'dashboard.tag1b', 'dashboard.tag1c'],
      desc: 'dashboard.desc1',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#962323', gradTo: '#a93226',
      link: 'https://usfq.shinyapps.io/Malaria_Ecuador/'
    },
    {
      icon: 'fa-solid fa-map',
      tabLabel: 'dashboard.tab2',
      title: 'dashboard.title2',
      badge: 'dashboard.badge2',
      tags: ['dashboard.tag2a', 'dashboard.tag2b', 'dashboard.tag2c'],
      desc: 'dashboard.desc2',
      image: 'assets/Images-Media/dashboard2.jpg',
      gradFrom: '#1a3f6e', gradTo: '#2471a3',
      link: 'https://experience.arcgis.com/experience/779365e587f34fb3b2f2e11e024c5974/page/Inicio/'
    },
    {
      icon: 'fa-solid fa-cloud-sun-rain',
      tabLabel: 'dashboard.tab3',
      title: 'dashboard.title3',
      badge: 'dashboard.badge3',
      tags: ['dashboard.tag3a', 'dashboard.tag3b', 'dashboard.tag3c'],
      desc: 'dashboard.desc3',
      image: 'assets/Images-Media/dashboard3.jpg',
      gradFrom: '#2c3e50', gradTo: '#4a6fa5',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-water',
      tabLabel: 'dashboard.tab4',
      title: 'dashboard.title4',
      badge: 'dashboard.badge4',
      tags: ['dashboard.tag4a', 'dashboard.tag4b', 'dashboard.tag4c'],
      desc: 'dashboard.desc4',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#154360', gradTo: '#1f618d',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-tree',
      tabLabel: 'dashboard.tab5',
      title: 'dashboard.title5',
      badge: 'dashboard.badge5',
      tags: ['dashboard.tag5a', 'dashboard.tag5b', 'dashboard.tag5c'],
      desc: 'dashboard.desc5',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#1a4a2e', gradTo: '#1e8449',
      link: 'pages/ourwork/data.html'
    }
  ];

  const previewEl  = document.getElementById('dataPreview');
  const infoEl     = document.getElementById('dataInfo');
  const iconEl     = document.getElementById('dataPreviewIcon');
  const labelEl    = document.getElementById('dataPreviewLabel');
  const chartEl    = document.getElementById('dataPreviewChart');
  const badgeEl    = document.getElementById('dataBadge');
  const titleEl    = document.getElementById('dataSpotTitle');
  const descEl     = document.getElementById('dataSpotDesc');
  const tagsEl     = document.getElementById('dataSpotTags');
  const btnEl      = document.getElementById('dataViewBtn');

  let activeIndex = 0;

  // Función helper para resolver claves de traducción
  function t(key) {
    return window.i18n?.t?.(key) || key;
  }

  function buildBars(bars) {
    return bars.map(h => `<div class="dpc-bar" style="--h: ${h}%"></div>`).join('');
  }

  function renderDashboard(d) {
    // Get the preview-top bar element
    const previewTopEl = previewEl.querySelector('.data-preview-top');
    
    // Set gradient color to the top bar (separator)
    if (previewTopEl) {
      previewTopEl.style.background = `linear-gradient(90deg, ${d.gradFrom}, ${d.gradTo})`;
    }
    
    // Set image as background directly on preview
    previewEl.style.backgroundImage = `url('${d.image}')`;
    
    // Clear icon and chart
    iconEl.className = 'data-preview-icon';
    iconEl.style.display = 'none';
    labelEl.style.display = 'none';
    chartEl.innerHTML = '';
    
    // Resolver las claves de traducción
    badgeEl.textContent = t(d.badge);
    titleEl.textContent = t(d.title);
    descEl.textContent = t(d.desc);
    tagsEl.innerHTML = d.tags.map(tagKey => `<span class="data-spot-tag">${t(tagKey)}</span>`).join('');
    btnEl.href = d.link;
  }

  function activate(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    tabsContainer.querySelectorAll('.data-tab').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    previewEl.classList.add('data-fading');
    infoEl.classList.add('data-fading');
    setTimeout(() => {
      renderDashboard(dashboards[index]);
      previewEl.classList.remove('data-fading');
      infoEl.classList.remove('data-fading');
    }, 210);
  }

  dashboards.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'data-tab' + (i === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.innerHTML = `<i class="${d.icon}"></i><span>${t(d.tabLabel)}</span>`;
    btn.addEventListener('click', () => activate(i));
    tabsContainer.appendChild(btn);
  });

  renderDashboard(dashboards[0]);

  // Re-aplicar traducciones cuando el idioma cambia
  document.addEventListener('i18n:changed', () => {
    // Actualizar los tabs
    dashboards.forEach((d, i) => {
      const btn = tabsContainer.querySelectorAll('.data-tab')[i];
      if (btn) {
        const span = btn.querySelector('span');
        if (span) span.textContent = t(d.tabLabel);
      }
    });
    // Actualizar el contenido del dashboard activo
    renderDashboard(dashboards[activeIndex]);
  });
});

/* ==============================
   Flip Cards – Mission Section
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
});
