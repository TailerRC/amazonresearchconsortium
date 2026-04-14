document.addEventListener('DOMContentLoaded', () => {
    // Interactive Album functionality
    const mainImg = document.getElementById('mainAlbumImage');
    const thumbs = document.querySelectorAll('.album-thumb');
    const infoItems = document.querySelectorAll('.album-info-item');

    const imagePaths = [
        'assets/Images-Media2/Album1.png',
        'assets/Images-Media2/Album2.png',
        'assets/Images-Media2/Album3.jpg',
        'assets/Images-Media2/Album4.png'
    ];

    if (thumbs.length > 0 && mainImg) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                if (thumb.classList.contains('active')) return;

                // 1. Manage Active Class on Thumbs
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                const index = parseInt(thumb.getAttribute('data-index'), 10);
                
                // 2. Change Main Image
                mainImg.style.opacity = 0.5;
                setTimeout(() => {
                    mainImg.src = imagePaths[index];
                    mainImg.style.opacity = 1;
                }, 200);

                // 3. Switch Info Section 
                infoItems.forEach((item, i) => {
                    if (i === index) {
                        item.style.display = 'block';
                        // Keep active class for potential future CSS state hooks
                        item.classList.add('active'); 
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });
            });
        });
    }

    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Commitment Cards Carousel functionality
    let currentSlide = 0;
    const totalSlides = 3;
    const track = document.getElementById('commitmentTrack');
    const dots = document.querySelectorAll('#commitmentDots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Arrow button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide((currentSlide + 1) % totalSlides);
        });
    }
});
