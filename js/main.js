/* ==============================
   Data Carousel – Infinite Loop
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

  // Clone slides for infinite effect
  function cloneSlides() {
    // Remove old clones
    track.querySelectorAll('[data-clone]').forEach((el) => el.remove());

    // Clone last `slidesPerView` slides to the beginning
    for (let i = totalSlides - 1; i >= totalSlides - slidesPerView; i--) {
      const clone = slides[i].cloneNode(true);
      clone.setAttribute('data-clone', 'prepend');
      track.insertBefore(clone, track.firstChild);
    }

    // Clone first `slidesPerView` slides to the end
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

  function updateTrack(animate) {
    const offset = (currentIndex + slidesPerView) * getSlideWidth();
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${offset}%)`;
  }

  function goTo(index, animate = true) {
    currentIndex = index;
    updateTrack(animate);
    updateDots();
  }

  function next() {
    currentIndex++;
    updateTrack(true);
    updateDots();

    // If we've gone past the last real slide
    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        updateTrack(false);
        updateDots();
      }, 520);
    }
  }

  function prev() {
    currentIndex--;
    updateTrack(true);
    updateDots();

    // If we've gone before the first real slide
    if (currentIndex < 0) {
      setTimeout(() => {
        currentIndex = totalSlides - 1;
        updateTrack(false);
        updateDots();
      }, 520);
    }
  }

  // Dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = totalSlides - slidesPerView + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    const idx = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
    const maxIndex = totalSlides - slidesPerView;
    const clampedIdx = Math.min(idx, maxIndex);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === clampedIdx);
    });
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
