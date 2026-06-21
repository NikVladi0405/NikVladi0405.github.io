document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');
    const storyStack = document.getElementById('storyStack');
    const slide = document.querySelector('.slide');
    const regularContent = document.querySelector('.regular-content');

    const SLIDE_HEIGHT = window.innerHeight;
    storyStack.style.height = SLIDE_HEIGHT + 'px';

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

        if (progress >= 1) {
            document.body.style.backgroundColor = '#fefafc';
        } else {
            document.body.style.backgroundColor = '#fdf7f2';
        }
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
            slide.style.transform = 'translateX(0)';
            document.body.style.backgroundColor = '#fdf7f2';

            // Запускаем частицы для золотой надписи
            startGoldenParticles();
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

    // Волшебные частицы для липкой надписи
    function startGoldenParticles() {
        const goldenContainer = document.getElementById('goldenParticles');
        if (!goldenContainer) return;
        function createGoldenParticle() {
            const p = document.createElement('span');
            p.classList.add('golden-particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 3 + 3) + 's'; // 3-6s
            p.style.animationDelay = Math.random() * 2 + 's';
            const symbols = ['✦', '✧', '•', '·'];
            p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            p.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
            goldenContainer.appendChild(p);
            setTimeout(() => { if (p.parentNode) p.remove(); }, 6000);
        }
        setInterval(createGoldenParticle, 400);
        for (let i = 0; i < 10; i++) setTimeout(createGoldenParticle, i * 200);
    }
});