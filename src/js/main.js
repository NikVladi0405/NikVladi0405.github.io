/* ===== main.js ===== */
document.addEventListener('DOMContentLoaded', () => {

    // ===== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА =====
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

    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ CTA-КНОПКИ =====
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#rsvp');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
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

    // Hero сразу делаем видимым
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
            
            // Случайная позиция по горизонтали
            particle.style.left = Math.random() * 100 + '%';
            
            // Случайная длительность анимации (4-8 секунд)
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            // Случайная задержка перед стартом
            particle.style.animationDelay = Math.random() * 3 + 's';
            
            // Случайный символ: звёздочки разных видов
            const symbols = ['✦', '✧', '•', '·', '✶', '✷'];
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            
            // Случайный размер
            particle.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
            
            particlesContainer.appendChild(particle);
            
            // Удаляем частицу после завершения анимации
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        }
        
        // Запускаем создание частиц каждые 300 мс
        setInterval(createParticle, 300);
        
        // Создаём первые 20 частиц сразу
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 150);
        }
    }

    // ===== ПАРАЛЛАКС ДЛЯ ИМЁН (ОПЦИОНАЛЬНО) =====
    const hero = document.querySelector('.hero');
    const namesWrapper = document.querySelector('.hero__names-wrapper');
    const overlay = document.querySelector('.hero__overlay');
    
    if (hero && namesWrapper && overlay) {
        hero.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.clientX) / 50;
            const yAxis = (window.innerHeight / 2 - e.clientY) / 50;
            namesWrapper.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
            overlay.style.transform = `translate(${xAxis * 0.5}px, ${yAxis * 0.5}px)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            namesWrapper.style.transform = 'translate(0, 0)';
            overlay.style.transform = 'translate(0, 0)';
        });
    }

});