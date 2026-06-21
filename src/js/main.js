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
    let regularVisible = false;
    let touchHandled = false; // чтобы не листать дважды за один свайп

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
            startProposalFireworks();
        });
    }

    function activateSlider() {
        sliderActive = true;
        regularVisible = false;
        document.body.style.overflow = 'hidden';
        storySlider.style.display = 'block';
        regularContent.style.display = 'none';

        // показываем текущий слайд (последний, если возвращаемся)
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'leave-left', 'leave-right', 'enter-left', 'enter-right');
            if (index === currentSlide) slide.classList.add('active');
        });

        // плавно скроллим к слайдеру
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showRegularContent() {
        sliderActive = false;
        regularVisible = true;
        document.body.style.overflow = '';
        storySlider.style.display = 'none';
        regularContent.style.display = 'block';

        // активируем скролл-анимации
        regularContent.querySelectorAll('.scroll-animate').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('revealed');
            }
        });
    }

    // Смена слайда с защитой от двойного срабатывания
    function changeSlide(direction) {
        if (transitionInProgress || !sliderActive) return;
        const newSlide = currentSlide + direction;
        if (newSlide < 0 || newSlide >= slides.length) return;

        transitionInProgress = true;
        touchHandled = true; // блокируем повторные touchmove

        const current = slides[currentSlide];
        const next = slides[newSlide];

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

        setTimeout(() => {
            current.classList.remove('leave-left', 'leave-right');
            next.classList.remove('enter-left', 'enter-right');
            slides.forEach((slide, index) => {
                if (index !== currentSlide) slide.classList.remove('active');
            });
            transitionInProgress = false;
            touchHandled = false;
        }, 600);
    }

    // Обработчик колеса (ПК)
    function handleWheel(e) {
        if (!sliderActive) return;
        e.preventDefault();
        const delta = e.deltaY || e.deltaX || e.wheelDelta || -e.detail;
        if (delta > 0) {
            if (currentSlide === slides.length - 1) {
                showRegularContent();
            } else {
                changeSlide(1);
            }
        } else if (delta < 0) {
            if (currentSlide > 0) {
                changeSlide(-1);
            }
        }
    }

    // Тач-события (телефон)
    let touchStartY = 0;
    function handleTouchStart(e) {
        if (!sliderActive) return;
        touchStartY = e.touches[0].clientY;
        touchHandled = false; // новый жест — можно листать
    }

    function handleTouchMove(e) {
        if (!sliderActive || touchHandled) return;
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        if (Math.abs(diff) > 40) { // порог чуть выше для надёжности
            if (diff > 0) {
                if (currentSlide === slides.length - 1) {
                    showRegularContent();
                } else {
                    changeSlide(1);
                }
            } else if (diff < 0) {
                if (currentSlide > 0) {
                    changeSlide(-1);
                }
            }
            touchStartY = touchY;
            e.preventDefault();
        }
    }

    // Возврат к слайдеру, когда доскроллили до самого верха
    window.addEventListener('scroll', () => {
        if (regularVisible && window.scrollY <= 5) {
            // небольшой запас, чтобы не дёргалось
            activateSlider();
        }
    });

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

    scrollElements.forEach(el => elementObserver.observe(el));

    // ===== ГЕНЕРАТОР ЗОЛОТЫХ ЧАСТИЦ =====
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