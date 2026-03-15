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
      tabLabel: 'Malaria surveillance',
      title: 'Malaria Surveillance Dashboard: Spatial Malaria and Climatic Data (R Shiny)',
      badge: 'CLIMATE & HEALTH',
      tags: ['Malaria', 'Climate Data', 'Amazon'],
      desc: 'An interactive R Shiny dashboard for visualizing spatial malaria and climatic data. It supports epidemiological surveillance through maps, charts, and statistical analyses.',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#962323', gradTo: '#a93226',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-map',
      tabLabel: 'MalariaTracker',
      title: 'MalariaTracker: Visualizing Community Connections (ArcGIS)',
      badge: 'GEOGRAPHIC INFORMATION SYSTEMS',
      tags: ['Malaria', 'Connectivity', 'Spatial Analysis'],
      desc: 'Mapping malaria transmission networks across communities using ArcGIS spatial tools and geospatial analysis. It reveals geographic connectivity patterns and hotspot clusters to strengthen targeted public health interventions and support evidence-based decision-making.',
      image: 'assets/Images-Media/dashboard2.jpg',
      gradFrom: '#1a3f6e', gradTo: '#2471a3',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-cloud-sun-rain',
      tabLabel: 'Climate Forecasts',
      title: 'Climate Variability Forecasts',
      badge: 'CLIMATE',
      tags: ['Forecasting', 'El Niño', 'Weather Patterns'],
      desc: 'Subseasonal-to-seasonal climate projections for the Amazon region, supporting proactive public health and environmental management decisions.',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#2c3e50', gradTo: '#4a6fa5',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-water',
      tabLabel: 'Hydro Explorer',
      title: 'Hydrological Data Explorer',
      badge: 'ENVIRONMENT',
      tags: ['Hydrology', 'Rivers', 'Flood Risk'],
      desc: 'Visualize streamflow, precipitation, and flood extent across major Amazon river basins to assess environmental and community risk.',
      image: 'assets/Images-Media/dashboard1.jpg',
      gradFrom: '#154360', gradTo: '#1f618d',
      link: 'pages/ourwork/data.html'
    },
    {
      icon: 'fa-solid fa-tree',
      tabLabel: 'Deforestation Tracker',
      title: 'Deforestation Tracking Tool',
      badge: 'CONSERVATION',
      tags: ['Deforestation', 'Land Use', 'Satellite'],
      desc: 'Satellite-derived land cover change detection across the Amazon — quantifying deforestation rates and correlating them with health outcomes.',
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
