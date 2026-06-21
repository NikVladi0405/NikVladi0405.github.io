document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');

    const storySlidesContainer = document.querySelector('.story-slides');
    const slides = document.querySelectorAll('.slide');
    const regularContent = document.querySelector('.regular-content');

    let currentSlide = 0;
    let sliderActive = false;
    let transitionInProgress = false;
    let regularVisible = false;

    // Цвета фона для каждого слайда (нежные тона)
    const slideBackgrounds = [
        '#fefafc', // greeting
        '#fff5f7', // story-begin
        '#fdf7f2', // first-walk
        '#fefafc', // exam
        '#fff5f7', // proposal
        '#fdf7f2'  // always-together
    ];

    function activateSlider() {
        sliderActive = true;
        regularVisible = false;
        document.body.style.overflow = 'hidden';
        storySlidesContainer.style.display = 'block';
        regularContent.classList.remove('visible');
        // Показываем текущий слайд
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === currentSlide) slide.classList.add('active');
            else if (index < currentSlide) slide.classList.add('prev');
        });
        document.body.style.backgroundColor = slideBackgrounds[currentSlide];
    }

    function showRegularContent() {
        sliderActive = false;
        regularVisible = true;
        document.body.style.overflow = '';
        storySlidesContainer.style.display = 'none';
        regularContent.classList.add('visible');
        document.body.style.backgroundColor = '#fefafc';
    }

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

    function changeSlide(direction) {
        if (transitionInProgress || !sliderActive) return;
        const newSlide = currentSlide + direction;
        if (newSlide < 0 || newSlide >= slides.length) return;

        transitionInProgress = true;
        const current = slides[currentSlide];
        const next = slides[newSlide];

        if (direction > 0) {
            // уход влево, приход справа
            current.classList.remove('active');
            current.classList.add('prev');
            next.classList.remove('prev');
            next.classList.add('active');
        } else {
            // уход вправо, приход слева
            current.classList.remove('active');
            // Устанавливаем начальную позицию для анимации слева
            next.style.transition = 'none';
            next.classList.remove('prev');
            next.classList.add('active');
            next.style.transform = 'translateX(-100%)';
            // Запускаем анимацию
            requestAnimationFrame(() => {
                next.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease';
                next.style.transform = 'translateX(0)';
            });
            // Предыдущий слайд уходит вправо
            current.classList.add('prev');
            current.classList.remove('active');
        }

        currentSlide = newSlide;
        document.body.style.backgroundColor = slideBackgrounds[currentSlide];

        // Если дошли до последнего слайда и скроллим вниз — переход к обычной прокрутке
        if (currentSlide === slides.length - 1 && direction > 0) {
            setTimeout(() => {
                showRegularContent();
            }, 600);
        }

        setTimeout(() => {
            transitionInProgress = false;
        }, 600);
    }

    // Обработчик колеса
    function handleWheel(e) {
        if (!sliderActive) return;
        e.preventDefault();
        const delta = e.deltaY || e.deltaX || 0;
        if (delta > 0) {
            if (currentSlide === slides.length - 1) {
                showRegularContent();
            } else {
                changeSlide(1);
            }
        } else if (delta < 0) {
            changeSlide(-1);
        }
    }

    // Тач-события
    let touchStartY = 0;
    function handleTouchStart(e) {
        if (!sliderActive) return;
        touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
        if (!sliderActive || transitionInProgress) return;
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                if (currentSlide === slides.length - 1) showRegularContent();
                else changeSlide(1);
            } else {
                changeSlide(-1);
            }
            touchStartY = touchY;
        }
        e.preventDefault();
    }

    // Возврат к слайдеру при прокрутке вверх до самого верха
    window.addEventListener('scroll', () => {
        if (regularVisible && window.scrollY <= 5) {
            activateSlider();
        }
    });

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Таймер
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();
    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;
        document.getElementById('days').textContent = String(Math.max(Math.floor(distance/86400000),0)).padStart(3,'0');
        document.getElementById('hours').textContent = String(Math.max(Math.floor((distance%86400000)/3600000),0)).padStart(2,'0');
        document.getElementById('minutes').textContent = String(Math.max(Math.floor((distance%3600000)/60000),0)).padStart(2,'0');
        document.getElementById('seconds').textContent = String(Math.max(Math.floor((distance%60000)/1000),0)).padStart(2,'0');
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // Частицы интро
    const particlesContainer = document.getElementById('introParticles');
    if (particlesContainer) {
        function createParticle() {
            const p = document.createElement('span');
            p.classList.add('particle');
            p.style.left = Math.random()*100+'%';
            p.style.animationDuration = (Math.random()*4+4)+'s';
            p.style.animationDelay = Math.random()*3+'s';
            p.textContent = ['✦','✧','•','·'][Math.floor(Math.random()*4)];
            p.style.fontSize = (Math.random()*1+0.8)+'rem';
            particlesContainer.appendChild(p);
            setTimeout(() => { if(p.parentNode) p.remove(); }, 8000);
        }
        setInterval(createParticle, 300);
        for(let i=0;i<20;i++) setTimeout(createParticle, i*150);
    }

    // Фейерверки в предложении
    function startProposalFireworks() {
        const proposalSlide = document.getElementById('proposal');
        if (!proposalSlide) return;
        const heart = proposalSlide.querySelector('.proposal__heart');
        if (!heart) return;
        const container = heart.querySelector('.firework-particles');
        if (!container) return;
        setInterval(() => {
            const span = document.createElement('span');
            span.style.cssText = 'position:absolute;width:4px;height:4px;background:#d4af37;border-radius:50%;opacity:0;animation:fireworkBurst 2s ease-out forwards;left:50%;top:50%;';
            span.style.transform = `rotate(${Math.random()*360}deg) translateY(-20px)`;
            container.appendChild(span);
            setTimeout(() => span.remove(), 2000);
        }, 800);
    }
});