document.addEventListener('DOMContentLoaded', () => {
    const mobileBreakpoint = 768; // in pixels
    function isMobile() {
        return window.innerWidth <= mobileBreakpoint;
    }


    const profileImg = document.getElementById('profileImg');
    const initialScale = 1; // Original size
    const finalScale = isMobile() ? 0.8 : 0.2;
    const maxScroll = 300;   // Scroll distance in pixels after which scaling stops

    function resizeProfileImage() {
        const scrollY = window.scrollY || window.pageYOffset;
        let scaleFactor = initialScale - ((initialScale - finalScale) * (scrollY / maxScroll));
        scaleFactor = Math.max(finalScale, Math.min(initialScale, scaleFactor));
        profileImg.style.transform = `scale(${scaleFactor})`;


        // Optionally, adjust opacity for a fading effect
        if (isMobile()) {
            const opacityFactor = 1 - ((initialScale - scaleFactor) / (initialScale - finalScale)) * 0.5; // Fade by 50%
            profileImg.style.opacity = `${opacityFactor}`;
        }
    }
    resizeProfileImage();
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                resizeProfileImage();
                ticking = false;
            });
            ticking = true;
        }
    });


    if (profileImg) {
        // Define the scroll threshold (e.g., 200px)
        const scrollThreshold = 200;
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        // Add click event listener
        profileImg.addEventListener('click', scrollToTop);
        profileImg.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                scrollToTop();
            }
        });
    }
});
