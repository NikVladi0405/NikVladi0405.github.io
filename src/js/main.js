/* ===== main.js ===== */
document.addEventListener('DOMContentLoaded', () => {

    // ===== ТАЙМЕР =====
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();

    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(Math.max(days, 0)).padStart(3, '0');
        if (hoursEl) hoursEl.textContent = String(Math.max(hours, 0)).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(Math.max(minutes, 0)).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(Math.max(seconds, 0)).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // ===== БУРГЕР-МЕНЮ =====
    const burger = document.getElementById('burgerMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navClose = document.getElementById('navClose');

    if (burger && navOverlay && navClose) {
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
    }

    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ CTA =====
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#rsvp');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ===== ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ =====
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

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.classList.add('section--visible');
        heroSection.classList.remove('section--hidden');
    }

    // ===== ГЕНЕРАТОР ЗОЛОТЫХ ЧАСТИЦ =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            const symbols = ['✦', '✧', '•', '·', '✶', '✷'];
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
            particlesContainer.appendChild(particle);
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 8000);
        }
        setInterval(createParticle, 300);
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 150);
        }
    }

    // ===== ЭФФЕКТ ПИШУЩЕЙ МАШИНКИ ДЛЯ ЭПИГРАФА =====
    const epigraphEl = document.getElementById('timerEpigraph');
    if (epigraphEl) {
        const fullText = 'Самое долгое ожидание — это путь друг к другу';
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < fullText.length) {
                epigraphEl.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 60 + Math.random() * 40);
            }
        }
        
        const timerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    timerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        timerObserver.observe(document.getElementById('timer'));
    }
});