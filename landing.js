(function () {
    'use strict';

    const splash = document.getElementById('splash');

    if (splash) {
   
        setTimeout(() => {
            splash.classList.add('hide');
            splash.addEventListener('animationend', () => {
                splash.style.display = 'none';

                checkReveals();
            }, { once: true });
        }, 3600);
    } else {
        checkReveals();
    }

    function checkReveals() {
        const items = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {

                    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx * 0.07) + 's';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        items.forEach(el => observer.observe(el));
    }

    if (!splash) {
        window.addEventListener('DOMContentLoaded', checkReveals);
    }

})();