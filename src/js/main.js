document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');
    const storyStack = document.getElementById('storyStack');
    const slide = document.querySelector('.slide');

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
        if (slide) slide.style.transform = `translateX(${-progress * 100}%)`;
        document.body.style.backgroundColor = progress >= 1 ? '#fefafc' : '#fdf7f2';
    }

    window.addEventListener('scroll', () => { if (sliderActive) updateSlide(); });

    // Скролл-анимации
    const scrollElements = document.querySelectorAll('.regular-content .scroll-animate');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('revealed'), parseInt(delay));
                elementObserver.unobserve(el);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
    scrollElements.forEach(el => elementObserver.observe(el));

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const music = document.getElementById('bgMusic');
            if (music) { music.volume = 0.3; music.play().catch(() => {}); }
            intro.style.display = 'none';
            mainContent.style.display = 'block';
            sliderActive = true;
            if (slide) slide.style.transform = 'translateX(0)';
            document.body.style.backgroundColor = '#fdf7f2';
            startGoldenParticles();
            startMediaEffects();
            startVowsParticles();
            startProgramParticles();
            startLocationParticles();
            setTimeout(() => {
                document.querySelectorAll('.regular-content .scroll-animate').forEach(el => {
                    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('revealed');
                });
            }, 100);
        });
    }

    // Таймер
    const weddingDate = new Date('2027-07-27T15:00:00+03:00').getTime();
    function updateTimer() {
        const now = Date.now();
        const distance = weddingDate - now;
        const set = (id, val, pad) => { const el = document.getElementById(id); if (el) el.textContent = String(Math.max(val,0)).padStart(pad,'0'); };
        set('days', Math.floor(distance/86400000), 3);
        set('hours', Math.floor((distance%86400000)/3600000), 2);
        set('minutes', Math.floor((distance%3600000)/60000), 2);
        set('seconds', Math.floor((distance%60000)/1000), 2);
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // Частицы интро (уменьшено)
    const particlesContainer = document.getElementById('introParticles');
    if (particlesContainer) {
        function createParticle() {
            const p = document.createElement('span');
            p.className = 'particle';
            p.style.left = Math.random()*100+'%';
            p.style.animationDuration = (Math.random()*5+5)+'s';
            p.style.animationDelay = Math.random()*4+'s';
            p.textContent = ['✦','✧','·'][Math.floor(Math.random()*3)];
            p.style.fontSize = (Math.random()*0.8+0.6)+'rem';
            particlesContainer.appendChild(p);
            setTimeout(() => { if(p.parentNode) p.remove(); }, 8000);
        }
        setInterval(createParticle, 400);
        for(let i=0;i<15;i++) setTimeout(createParticle, i*200);
    }

    // Золотые частицы (уменьшено)
    function startGoldenParticles() {
        const goldenContainer = document.getElementById('goldenParticles');
        if (!goldenContainer) return;
        function create() {
            const p = document.createElement('span');
            p.className = 'golden-particle';
            p.style.left = Math.random()*100+'%';
            p.style.animationDuration = (Math.random()*4+4)+'s';
            p.style.animationDelay = Math.random()*3+'s';
            p.textContent = ['✦','✧','·'][Math.floor(Math.random()*3)];
            p.style.fontSize = (Math.random()*0.7+0.5)+'rem';
            goldenContainer.appendChild(p);
            setTimeout(() => { if(p.parentNode) p.remove(); }, 7000);
        }
        setInterval(create, 500);
        for(let i=0;i<8;i++) setTimeout(create, i*250);
    }

    // Медиа эффекты (уменьшено)
    function startMediaEffects() {
        const container = document.getElementById('mediaParticles');
        if (!container) return;
        setInterval(() => {
            for (let i=0;i<2;i++) {
                const f = document.createElement('span');
                f.className = 'media-firework';
                f.style.left = Math.random()*100+'%';
                f.style.top = Math.random()*100+'%';
                container.appendChild(f);
                setTimeout(() => f.remove(), 2500);
            }
        }, 800);
        setInterval(() => {
            for (let i=0;i<2;i++) {
                const c = document.createElement('div');
                c.className = 'media-circle';
                c.style.left = Math.random()*100+'%';
                c.style.top = Math.random()*100+'%';
                c.style.width = '25px'; c.style.height = '25px';
                container.appendChild(c);
                setTimeout(() => c.remove(), 3500);
            }
        }, 1500);
    }

    // Эффекты для слов
    function startVowsParticles() {
        const container = document.getElementById('vowsParticles');
        if (!container) return;
        setInterval(() => {
            const f = document.createElement('span');
            f.className = 'media-firework';
            f.style.left = Math.random()*100+'%';
            f.style.top = Math.random()*100+'%';
            container.appendChild(f);
            setTimeout(() => f.remove(), 2500);
        }, 1000);
    }

    // Эффекты для программы
    function startProgramParticles() {
        const container = document.getElementById('programParticles');
        if (!container) return;
        setInterval(() => {
            const f = document.createElement('span');
            f.className = 'media-firework';
            f.style.left = Math.random()*100+'%';
            f.style.top = Math.random()*100+'%';
            container.appendChild(f);
            setTimeout(() => f.remove(), 2500);
        }, 900);
    }

    // Эффекты для локации
    function startLocationParticles() {
        const container = document.getElementById('locationParticles');
        if (!container) return;
        setInterval(() => {
            const f = document.createElement('span');
            f.className = 'media-firework';
            f.style.left = Math.random()*100+'%';
            f.style.top = Math.random()*100+'%';
            container.appendChild(f);
            setTimeout(() => f.remove(), 2500);
        }, 1000);
    }
});