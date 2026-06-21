document.addEventListener('DOMContentLoaded', () => {
    // ===== ОТКРЫТИЕ ПРИГЛАШЕНИЯ =====
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');

    const storySlider = document.getElementById('storySlider');
    const slides = document.querySelectorAll('#storySlider .slide');
    const regularContent = document.querySelector('.regular-content');

    // Параметры горизонтальной ленты
    const maxTranslate = (slides.length - 1) * window.innerWidth;
    let currentTranslate = 0;
    let sliderActive = false;
    let regularVisible = false;

    // Фейерверки
    let fireworkInterval;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const music = document.getElementById('bgMusic');
            if (music) {
                music.volume = 0.3;
                music.play().catch(() => {});
            }

            intro.style.display = 'none';
            mainContent.style.display = 'block';

            activateSlider();
            startSliderFireworks();
        });
    }

    function activateSlider() {
        sliderActive = true;
        regularVisible = false;
        document.body.style.overflow = 'hidden';
        storySlider.style.display = 'flex';
        regularContent.style.display = 'none';
        // Устанавливаем позицию
        storySlider.style.transition = 'none';
        storySlider.style.transform = `translateX(-${currentTranslate}px)`;
    }

    function showRegularContent() {
        sliderActive = false;
        regularVisible = true;
        document.body.style.overflow = '';
        storySlider.style.display = 'none';
        regularContent.style.display = 'block';
        stopSliderFireworks();

        // Активируем видимые анимации
        regularContent.querySelectorAll('.scroll-animate').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('revealed');
            }
        });
    }

    // Горизонтальное перемещение
    function moveSlider(deltaX) {
        if (!sliderActive) return;
        currentTranslate = Math.max(0, Math.min(maxTranslate, currentTranslate + deltaX));
        storySlider.style.transform = `translateX(-${currentTranslate}px)`;

        // Если дошли до последнего слайда и продолжаем двигаться вправо — показываем регулярный контент
        if (currentTranslate >= maxTranslate && deltaX > 0) {
            showRegularContent();
        }
    }

    // Обработчик колеса (ПК)
    function handleWheel(e) {
        if (!sliderActive) return;
        e.preventDefault();
        const delta = e.deltaY || e.deltaX || 0;
        moveSlider(delta);
    }

    // Тач-события (телефон)
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTranslate = 0;

    function handleTouchStart(e) {
        if (!sliderActive) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastTranslate = currentTranslate;
    }

    function handleTouchMove(e) {
        if (!sliderActive) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchStartX - touchX;
        const diffY = touchStartY - touchY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
            currentTranslate = Math.max(0, Math.min(maxTranslate, lastTranslate + diffX));
            storySlider.style.transform = `translateX(-${currentTranslate}px)`;
        }
    }

    function handleTouchEnd(e) {
        if (!sliderActive) return;
        if (currentTranslate >= maxTranslate && lastTranslate < maxTranslate) {
            showRegularContent();
        }
    }

    // Возврат к слайдеру при прокрутке вверх до самого верха
    window.addEventListener('scroll', () => {
        if (regularVisible && window.scrollY <= 5) {
            activateSlider();
            startSliderFireworks();
        }
    });

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    // ===== ФЕЙЕРВЕРКИ ВНУТРИ СЛАЙДЕРА =====
    function createFireworkParticle(x, y) {
        const particle = document.createElement('span');
        particle.className = 'firework-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        storySlider.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }

    function randomFirework() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createFireworkParticle(x, y);
    }

    function startSliderFireworks() {
        stopSliderFireworks();
        fireworkInterval = setInterval(randomFirework, 600);
    }

    function stopSliderFireworks() {
        clearInterval(fireworkInterval);
        document.querySelectorAll('.firework-particle').forEach(p => p.remove());
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

    // ===== СКРОЛЛ-АНИМАЦИИ для обычных секций =====
    const scrollElements = document.querySelectorAll('.regular-content .scroll-animate');
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

    // ===== ФЕЙЕРВЕРКИ В ПРЕДЛОЖЕНИИ (СЕРДЕЧКО) =====
    function startProposalFireworks() {
        const proposalSlide = document.getElementById('proposal');
        if (!proposalSlide) return;
        const heart = proposalSlide.querySelector('.proposal__heart');
        if (!heart) return;
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
    startProposalFireworks();
});