(function () {
    const track = document.querySelector('.carousel__track');
    const slides = Array.from(track.children);
    const dots = Array.from(document.querySelectorAll('.carousel__dot'));
    const btnLeft = document.querySelector('.carousel__btn--left');
    const btnRight = document.querySelector('.carousel__btn--right');
    let current = 0;
    let autoTimer;

    function goTo(index) {
        slides[current].classList.remove('is-selected');
        dots[current].classList.remove('is-active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('is-selected');
        dots[current].classList.add('is-active');
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    btnLeft.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    btnRight.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    resetTimer();
})();
