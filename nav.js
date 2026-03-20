(function () {
    'use strict';

    const nav = document.getElementById('mainNav');
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('mobileMenu');

    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            menu.classList.toggle('open');
        });

        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                burger.classList.remove('open');
                menu.classList.remove('open');
            });
        });
    }
})();