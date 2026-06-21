document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');
    const storyStack = document.getElementById('storyStack');
    const slides = document.querySelectorAll('.slide');
    const regularContent = document.querySelector('.regular-content');

    const SLIDE_HEIGHT = window.innerHeight;
    const TOTAL_SLIDES = slides.length;
    const STACK_HEIGHT = SLIDE_HEIGHT * TOTAL_SLIDES;
    storyStack.style.height = STACK_HEIGHT + 'px';

    // Цвета фона для каждого слайда
    const slideBackgrounds = [
        '#fefafc', // greeting
        '#fff5f7', // story-begin
        '#fdf7f2', // first-walk
        '#fefafc', // exam
        '#fff5f7', // proposal
        '#fdf7f2'  // always-together
    ];

    let sliderActive = false;

    function updateSlides() {
        if (!sliderActive) return;
        const scrollY = window.scrollY;
        const stackTop = storyStack.offsetTop;
        const relativeScroll = scrollY - stackTop;

        if (relativeScroll < 0 || relativeScroll >= STACK_HEIGHT) return;

        const activeIndex = Math.min(Math.floor(relativeScroll / SLIDE_HEIGHT), TOTAL_SLIDES - 1);
        const progress = (relativeScroll % SLIDE_HEIGHT) / SLIDE_HEIGHT;

        // Обновляем каждый слайд
        slides.forEach((slide, index) => {
            if (index < activeIndex) {
                slide.style.transform = 'translateX(-100%)';
            } else if (index === activeIndex) {
                // Уходит влево
                slide.style.transform = `translateX(${-progress * 100}%)`;
            } else if (index === activeIndex + 1) {
                // Выезжает справа
                slide.style.transform = `translateX(${100 - progress * 100}%)`;
            } else {
                slide.style.transform = 'translateX(100%)';
            }
        });

        // Обновляем фон
        const currentBg = slideBackgrounds[activeIndex];
        const nextBg = slideBackgrounds[Math.min(activeIndex + 1, TOTAL_SLIDES - 1)];
        document.body.style.backgroundColor = interpolateColor(currentBg, nextBg, progress);
    }

    // Простая интерполяция цвета (HEX)
    function interpolateColor(color1, color2, factor) {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        return `rgb(${r},${g},${b})`;
    }
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r:255,g:255,b:255};
    }

    window.addEventListener('scroll', () => {
        if (sliderActive) updateSlides();
    });

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const music = document.getElementById('bgMusic');
            if (music) {
                music.volume = 0.3;
                music.play().catch(() => {});
            }

            intro.style.display = 'none';
            mainContent.style.display = 'block';

            // Инициализируем слайды
            sliderActive = true;
            // Позиционируем слайды
            slides.forEach((slide, index) => {
                if (index === 0) slide.style.transform = 'translateX(0)';
                else slide.style.transform = 'translateX(100%)';
            });
            document.body.style.backgroundColor = slideBackgrounds[0];
            startProposalFireworks();
        });
    }

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