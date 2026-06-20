/* ===== main.js ===== */
document.addEventListener('DOMContentLoaded', () => {

    // Таймер обратного отсчёта
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();

    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(Math.max(days, 0)).padStart(3, '0');
        document.getElementById('hours').textContent = String(Math.max(hours, 0)).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.max(minutes, 0)).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.max(seconds, 0)).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // Бургер-меню
    const burger = document.getElementById('burgerMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navClose = document.getElementById('navClose');

    burger.addEventListener('click', () => {
        navOverlay.classList.add('nav-overlay--active');
        burger.classList.add('burger-menu--hidden');
    });

    navClose.addEventListener('click', () => {
        navOverlay.classList.remove('nav-overlay--active');
        burger.classList.remove('burger-menu--hidden');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('nav-overlay--active');
            burger.classList.remove('burger-menu--hidden');
        });
    });

    // Плавный скролл для CTA
    document.getElementById('heroCta').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#rsvp').scrollIntoView({ behavior: 'smooth' });
    });

    // Появление секций при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section--visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section--hidden');
        observer.observe(section);
    });
    document.getElementById('hero').classList.add('section--visible');
});