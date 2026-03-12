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
   Data Carousel – Page by Section (3 per page)
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('dataCarousel');
  if (!track) return;

  const slides = Array.from(track.children);
  const totalSlides = slides.length; // 8
  const dotsContainer = document.getElementById('carouselDots');
  const leftArrow = track.closest('.carousel').querySelector('.carousel-arrow--left');
  const rightArrow = track.closest('.carousel').querySelector('.carousel-arrow--right');

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();

  // Clone one full page at each end for infinite effect
  function cloneSlides() {
    track.querySelectorAll('[data-clone]').forEach((el) => el.remove());

    // Clone last page to beginning (reversed insertion keeps order)
    for (let i = totalSlides - 1; i >= totalSlides - slidesPerView; i--) {
      const clone = slides[i].cloneNode(true);
      clone.setAttribute('data-clone', 'prepend');
      track.insertBefore(clone, track.firstChild);
    }

    // Clone first page to end
    for (let i = 0; i < slidesPerView; i++) {
      const clone = slides[i].cloneNode(true);
      clone.setAttribute('data-clone', 'append');
      track.appendChild(clone);
    }
  }

  function getSlidesPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getSlideWidth() {
    return 100 / slidesPerView;
  }

  function getTotalPages() {
    return Math.ceil(totalSlides / slidesPerView);
  }

  function updateTrack(animate) {
    const offset = (currentIndex + slidesPerView) * getSlideWidth();
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${offset}%)`;
  }

  // pageIndex is 0-based page number
  function goTo(pageIndex, animate = true) {
    currentIndex = pageIndex * slidesPerView;
    updateTrack(animate);
    updateDots();
  }

  function next() {
    currentIndex += slidesPerView;
    updateTrack(true);
    updateDots();

    // Past the last real page → jump back to first
    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        updateTrack(false);
        updateDots();
      }, 520);
    }
  }

  function prev() {
    currentIndex -= slidesPerView;
    updateTrack(true);
    updateDots();

    // Before the first page → jump to last page
    if (currentIndex < 0) {
      const lastPageStart = (getTotalPages() - 1) * slidesPerView;
      setTimeout(() => {
        currentIndex = lastPageStart;
        updateTrack(false);
        updateDots();
      }, 520);
    }
  }

  // One dot per page (section)
  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = getTotalPages();
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to section ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    const totalPages = getTotalPages();
    const rawPage = currentIndex / slidesPerView;
    const activePage = Math.min(Math.max(Math.round(rawPage), 0), totalPages - 1);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === activePage));
  }

  // Events
  rightArrow.addEventListener('click', next);
  leftArrow.addEventListener('click', prev);

  // Responsive
  function init() {
    slidesPerView = getSlidesPerView();
    currentIndex = 0;
    cloneSlides();
    createDots();
    updateTrack(false);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
});
