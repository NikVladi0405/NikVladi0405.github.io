document.addEventListener('DOMContentLoaded', () => {
    // ===== ОТКРЫТИЕ ПРИГЛАШЕНИЯ + МУЗЫКА =====
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // ЗАПУСК МУЗЫКИ
            const music = document.getElementById('bgMusic');
            if (music) {
                music.volume = 0.3;
                music.play().catch(err => console.log('Музыка не заиграла:', err));
            }

            intro.style.display = 'none';
            mainContent.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                document.querySelectorAll('.scroll-animate').forEach(el => {
                    if (el.getBoundingClientRect().top < window.innerHeight) {
                        el.classList.add('revealed');
                    }
                });
            }, 100);
        });
    }

    // ===== ТАЙМЕР =====
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();
    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('days').textContent = String(Math.max(days,0)).padStart(3,'0');
        document.getElementById('hours').textContent = String(Math.max(hours,0)).padStart(2,'0');
        document.getElementById('minutes').textContent = String(Math.max(minutes,0)).padStart(2,'0');
        document.getElementById('seconds').textContent = String(Math.max(seconds,0)).padStart(2,'0');
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // ===== СКРОЛЛ-АНИМАЦИИ =====
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => {
                    el.classList.add('revealed');
                }, parseInt(delay));
                elementObserver.unobserve(el);
            }
        });
    }, { threshold: 0.25 });

    scrollElements.forEach(el => elementObserver.observe(el));

    // ===== ГЕНЕРАТОР ЗОЛОТЫХ ЧАСТИЦ НА ИНТРО =====
    const particlesContainer = document.getElementById('introParticles');
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            const symbols = ['✦','✧','•','·','✶','✷'];
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
            particlesContainer.appendChild(particle);
            setTimeout(() => { if (particle.parentNode) particle.remove(); }, 8000);
        }
        setInterval(createParticle, 300);
        for (let i=0; i<20; i++) setTimeout(createParticle, i*150);
    }

    // ===== ФЕЙЕРВЕРКИ В ПРЕДЛОЖЕНИИ =====
    const heart = document.querySelector('.proposal__heart');
    if (heart) {
        const fireworkContainer = heart.querySelector('.firework-particles');
        function createFirework() {
            const span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.width = '4px';
            span.style.height = '4px';
            span.style.background = '#d4af37';
            span.style.borderRadius = '50%';
            span.style.opacity = '0';
            span.style.animation = 'fireworkBurst 2s ease-out forwards';
            span.style.left = '50%';
            span.style.top = '50%';
            span.style.transform = `rotate(${Math.random()*360}deg) translateY(-20px)`;
            fireworkContainer.appendChild(span);
            setTimeout(() => span.remove(), 2000);
        }
        setInterval(createFirework, 800);
    }
});