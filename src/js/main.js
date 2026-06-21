document.addEventListener('DOMContentLoaded', () => {
    // ===== ОТКРЫТИЕ ПРИГЛАШЕНИЯ =====
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');

    const storySlider = document.getElementById('storySlider');
    const slides = document.querySelectorAll('#storySlider .slide');
    const regularContent = document.querySelector('.regular-content');
    let currentSlide = 0;
    let sliderActive = false;
    let transitionInProgress = false;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const music = document.getElementById('bgMusic');
            if (music) {
                music.volume = 0.3;
                music.play().catch(() => {});
            }

            intro.style.display = 'none';
            mainContent.style.display = 'block';

            // Инициализация слайдера
            sliderActive = true;
            document.body.style.overflow = 'hidden';
            storySlider.style.display = 'block';
            // Делаем первый слайд активным
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                if (index === 0) slide.classList.add('active');
            });
            currentSlide = 0;

            // Запускаем фейерверки в предложении
            startProposalFireworks();
        });
    }

    // Функция смены слайда
    function changeSlide(direction) {
        if (transitionInProgress || !sliderActive) return;
        const newSlide = currentSlide + direction;
        if (newSlide < 0 || newSlide >= slides.length) return;

        transitionInProgress = true;

        const current = slides[currentSlide];
        const next = slides[newSlide];

        // Направление: 1 - вперёд, -1 - назад
        if (direction > 0) {
            current.classList.add('leave-left');
            next.classList.add('enter-right', 'active');
            current.classList.remove('active');
        } else {
            current.classList.add('leave-right');
            next.classList.add('enter-left', 'active');
            current.classList.remove('active');
        }

        currentSlide = newSlide;

        // После завершения анимации убираем классы
        setTimeout(() => {
            current.classList.remove('leave-left', 'leave-right');
            next.classList.remove('enter-left', 'enter-right');
            // Убираем активность с остальных
            slides.forEach((slide, index) => {
                if (index !== currentSlide) slide.classList.remove('active');
            });
            transitionInProgress = false;

            // Если дошли до последнего слайда (proposal) и пытаемся скроллить дальше - завершаем слайдер
            if (currentSlide === slides.length - 1) {
                // Разрешаем завершить при следующем скролле вниз
            }
        }, 600); // Должно совпадать с длительностью transition
    }

    // Обработчик скролла колесиком
    function handleWheel(e) {
        if (!sliderActive) return;
        e.preventDefault();
        const delta = e.deltaY || e.deltaX || e.wheelDelta || -e.detail;
        if (delta > 0) {
            if (currentSlide === slides.length - 1) {
                finishSlider();
            } else {
                changeSlide(1);
            }
        } else if (delta < 0) {
            if (currentSlide > 0) {
                changeSlide(-1);
            }
        }
    }

    // Обработчики тач-событий для мобильных
    let touchStartY = 0;
    function handleTouchStart(e) {
        if (!sliderActive) return;
        touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
        if (!sliderActive) return;
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        if (Math.abs(diff) > 30) {
            if (diff > 0) {
                if (currentSlide === slides.length - 1) {
                    finishSlider();
                } else {
                    changeSlide(1);
                }
            } else if (diff < 0) {
                if (currentSlide > 0) {
                    changeSlide(-1);
                }
            }
            touchStartY = touchY;
        }
        e.preventDefault();
    }

    function finishSlider() {
        sliderActive = false;
        storySlider.style.display = 'none';
        document.body.style.overflow = '';
        // Активируем видимые скролл-анимации
        regularContent.querySelectorAll('.scroll-animate').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('revealed');
            }
        });
        // Запускаем IntersectionObserver для дальнейших анимаций
        elementObserverCallback();
    }

    // Навешиваем обработчики
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

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

    function elementObserverCallback() {
        scrollElements.forEach(el => elementObserver.observe(el));
    }
    elementObserverCallback();

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
});