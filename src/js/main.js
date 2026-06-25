document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');
    const storyStack = document.getElementById('storyStack');
    const slide = document.querySelector('.slide');
    const regularContent = document.querySelector('.regular-content');

    const SLIDE_HEIGHT = window.innerHeight;
    if (storyStack) storyStack.style.height = SLIDE_HEIGHT + 'px';

    let sliderActive = false;

    function updateSlide() {
        if (!sliderActive) return;
        const scrollY = window.scrollY;
        const stackTop = storyStack.offsetTop;
        let relativeScroll = scrollY - stackTop;

        if (relativeScroll < 0) relativeScroll = 0;
        if (relativeScroll > SLIDE_HEIGHT) relativeScroll = SLIDE_HEIGHT;

        const progress = relativeScroll / SLIDE_HEIGHT;
        slide.style.transform = `translateX(${-progress * 100}%)`;

        document.body.style.backgroundColor = progress >= 1 ? '#fefafc' : '#fdf7f2';
    }

    window.addEventListener('scroll', () => {
        if (sliderActive) updateSlide();
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

            sliderActive = true;
            if (slide) slide.style.transform = 'translateX(0)';
            document.body.style.backgroundColor = '#fdf7f2';

            startGoldenParticles();
            startMediaEffects();
            startProposalFireworks();
        });
    }

    // Таймер
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();
    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        if (daysEl) daysEl.textContent = String(Math.max(Math.floor(distance/86400000),0)).padStart(3,'0');
        if (hoursEl) hoursEl.textContent = String(Math.max(Math.floor((distance%86400000)/3600000),0)).padStart(2,'0');
        if (minutesEl) minutesEl.textContent = String(Math.max(Math.floor((distance%3600000)/60000),0)).padStart(2,'0');
        if (secondsEl) secondsEl.textContent = String(Math.max(Math.floor((distance%60000)/1000),0)).padStart(2,'0');
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // Улучшенные частицы интро
    const particlesContainer = document.getElementById('introParticles');
    if (particlesContainer) {
        function createParticle() {
            const p = document.createElement('span');
            const types = ['particle', 'particle star', 'particle spark', 'particle ring-particle'];
            p.className = types[Math.floor(Math.random() * types.length)];
            p.style.left = Math.random()*100+'%';
            p.style.animationDuration = (Math.random()*4+4)+'s';
            p.style.animationDelay = Math.random()*3+'s';
            if (p.classList.contains('ring-particle')) {
                p.textContent = '';
            } else {
                p.textContent = ['✦','✧','•','·','✶','✷'][Math.floor(Math.random()*6)];
            }
            p.style.fontSize = (Math.random()*1+0.8)+'rem';
            particlesContainer.appendChild(p);
            setTimeout(() => { if(p.parentNode) p.remove(); }, 8000);
        }
        setInterval(createParticle, 200);
        for(let i=0;i<30;i++) setTimeout(createParticle, i*100);
    }

    // Улучшенные частицы для липкой надписи
    function startGoldenParticles() {
        const goldenContainer = document.getElementById('goldenParticles');
        if (!goldenContainer) return;
        function createGoldenParticle() {
            const p = document.createElement('span');
            const isSparkle = Math.random() > 0.7;
            p.className = isSparkle ? 'golden-particle sparkle' : 'golden-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 3 + 3) + 's';
            p.style.animationDelay = Math.random() * 2 + 's';
            p.textContent = ['✦', '✧', '•', '·', '✶', '✷'][Math.floor(Math.random() * 6)];
            p.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
            goldenContainer.appendChild(p);
            setTimeout(() => { if (p.parentNode) p.remove(); }, 6000);
        }
        setInterval(createGoldenParticle, 300);
        for (let i = 0; i < 15; i++) setTimeout(createGoldenParticle, i * 150);
    }

    // Магические эффекты для секции "МЫ ЕСТЬ ДРУГ У ДРУГА"
    function startMediaEffects() {
        const container = document.getElementById('mediaParticles');
        if (!container) return;

        // Множественные фейерверки
        setInterval(() => {
            for (let i = 0; i < 4; i++) {
                const firework = document.createElement('span');
                firework.className = 'media-firework';
                firework.style.left = Math.random() * 100 + '%';
                firework.style.top = Math.random() * 100 + '%';
                firework.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(firework);
                setTimeout(() => firework.remove(), 2000);
            }
        }, 500);

        // Расширяющиеся круги
        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                const circle = document.createElement('div');
                circle.className = 'media-circle';
                circle.style.left = Math.random() * 100 + '%';
                circle.style.top = Math.random() * 100 + '%';
                circle.style.width = '30px';
                circle.style.height = '30px';
                circle.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(circle);
                setTimeout(() => circle.remove(), 3000);
            }
        }, 1000);

        // Мини-салюты
        setInterval(() => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('span');
                particle.className = 'media-firework';
                particle.style.left = x + '%';
                particle.style.top = y + '%';
                particle.style.animationDuration = '1.5s';
                particle.style.transform = `rotate(${i * 36}deg) translateY(-15px)`;
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 1500);
            }
        }, 2000);
    }

    // Фейерверки в предложении
    function startProposalFireworks() {
        const proposalSlide = document.getElementById('proposal');
        if (!proposalSlide) return;
        const heart = proposalSlide.querySelector('.proposal__heart');
        if (!heart) return;
        const fireworkContainer = heart.querySelector('.firework-particles');
        if (!fireworkContainer) return;
        
        function createProposalFirework() {
            const span = document.createElement('span');
            span.style.cssText = 'position:absolute;width:4px;height:4px;background:#d4af37;border-radius:50%;opacity:0;animation:fireworkBurst 2s ease-out forwards;left:50%;top:50%;';
            span.style.transform = `rotate(${Math.random()*360}deg) translateY(-20px)`;
            fireworkContainer.appendChild(span);
            setTimeout(() => span.remove(), 2000);
        }
        setInterval(createProposalFirework, 600);
    }

    // Добавляем свечение вокруг имён в интро
    const namesWrapper = document.querySelector('.intro__names');
    if (namesWrapper) {
        namesWrapper.parentElement.classList.add('intro__names-wrapper');
        const glow = document.createElement('div');
        glow.className = 'intro__names-glow';
        namesWrapper.parentElement.appendChild(glow);
    }
});