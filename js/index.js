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
      icon: 'fa-solid fa-chart-area',
      tabLabel: 'Case Rate Explorer',
      title: 'Case Rate vs LDAS Exploration',
      badge: 'CLIMATE & HEALTH',
      tags: ['Malaria', 'Climate Data', 'Amazon'],
      desc: 'Interactively explore the relationship between malaria case rates and NASA Land Data Assimilation System (LDAS) variables across Amazon-basin countries.',
      gradFrom: '#0d4f5c', gradTo: '#1a7a8c',
      bars: [60, 85, 45, 70, 55, 90, 40, 75],
      link: '#'
    },
    {
      icon: 'fa-solid fa-mosquito',
      tabLabel: 'Malaria Surveillance',
      title: 'Malaria Surveillance Dashboard',
      badge: 'HEALTH MONITORING',
      tags: ['Malaria', 'Surveillance', 'Latin America'],
      desc: 'Real-time and historical malaria incidence tracking across Ecuador, Peru, and Brazil — informing rapid response and targeted intervention strategies.',
      gradFrom: '#6b1a1a', gradTo: '#a93226',
      bars: [30, 70, 95, 50, 80, 35, 60, 85],
      link: '#'
    },
    {
      icon: 'fa-solid fa-clock-rotate-left',
      tabLabel: 'Lag Time Correlation',
      title: 'Lag Time Case Rate–LDAS Correlation',
      badge: 'STATISTICAL ANALYSIS',
      tags: ['Lag Analysis', 'LDAS', 'Forecasting'],
      desc: 'Quantify how environmental changes precede shifts in malaria burden using time-lagged cross-correlation analysis across Amazonian regions.',
      gradFrom: '#1a3f6e', gradTo: '#2471a3',
      bars: [75, 40, 85, 55, 70, 90, 45, 65],
      link: '#'
    },
    {
      icon: 'fa-solid fa-cloud-sun-rain',
      tabLabel: 'Climate Forecasts',
      title: 'Climate Variability Forecasts',
      badge: 'CLIMATE',
      tags: ['Forecasting', 'El Niño', 'Weather Patterns'],
      desc: 'Subseasonal-to-seasonal climate projections for the Amazon region, supporting proactive public health and environmental management decisions.',
      gradFrom: '#2c3e50', gradTo: '#4a6fa5',
      bars: [50, 65, 80, 35, 75, 55, 90, 45],
      link: '#'
    },
    {
      icon: 'fa-solid fa-water',
      tabLabel: 'Hydro Explorer',
      title: 'Hydrological Data Explorer',
      badge: 'ENVIRONMENT',
      tags: ['Hydrology', 'Rivers', 'Flood Risk'],
      desc: 'Visualize streamflow, precipitation, and flood extent across major Amazon river basins to assess environmental and community risk.',
      gradFrom: '#154360', gradTo: '#1f618d',
      bars: [85, 55, 70, 40, 90, 60, 75, 50],
      link: '#'
    },
    {
      icon: 'fa-solid fa-tree',
      tabLabel: 'Deforestation Tracker',
      title: 'Deforestation Tracking Tool',
      badge: 'CONSERVATION',
      tags: ['Deforestation', 'Land Use', 'Satellite'],
      desc: 'Satellite-derived land cover change detection across the Amazon — quantifying deforestation rates and correlating them with health outcomes.',
      gradFrom: '#1a4a2e', gradTo: '#1e8449',
      bars: [40, 80, 55, 90, 35, 70, 85, 50],
      link: '#'
    },
    {
      icon: 'fa-solid fa-flask-vial',
      tabLabel: 'Mercury Exposure',
      title: 'Mercury Exposure Analysis',
      badge: 'ENVIRONMENTAL HEALTH',
      tags: ['Mercury', 'ASGM', 'Community Health'],
      desc: 'Map artisanal gold mining sites and analyze mercury contamination spread through watersheds and its impact on community health outcomes.',
      gradFrom: '#4a1a5e', gradTo: '#7d3c98',
      bars: [65, 45, 80, 70, 30, 95, 50, 75],
      link: '#'
    },
    {
      icon: 'fa-solid fa-heart-pulse',
      tabLabel: 'One Health Risk',
      title: 'One Health Risk Dashboard',
      badge: 'ONE HEALTH',
      tags: ['One Health', 'Risk Index', 'Multi-Hazard'],
      desc: 'An integrated risk framework combining climate, ecological, and health indicators to identify vulnerable communities across Latin America.',
      gradFrom: '#00264a', gradTo: '#14505c',
      bars: [70, 85, 50, 65, 90, 40, 75, 55],
      link: '#'
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

  function buildBars(bars) {
    return bars.map(h => `<div class="dpc-bar" style="--h: ${h}%"></div>`).join('');
  }

  function renderDashboard(d) {
    previewEl.style.background = `linear-gradient(135deg, ${d.gradFrom}, ${d.gradTo})`;
    iconEl.className = `${d.icon} data-preview-icon`;
    labelEl.textContent = d.title.toUpperCase();
    chartEl.innerHTML = buildBars(d.bars);
    badgeEl.textContent = d.badge;
    titleEl.textContent = d.title;
    descEl.textContent = d.desc;
    tagsEl.innerHTML = d.tags.map(t => `<span class="data-spot-tag">${t}</span>`).join('');
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
    btn.innerHTML = `<i class="${d.icon}"></i><span>${d.tabLabel}</span>`;
    btn.addEventListener('click', () => activate(i));
    tabsContainer.appendChild(btn);
  });

  renderDashboard(dashboards[0]);
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
