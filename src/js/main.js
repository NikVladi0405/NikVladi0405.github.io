document.addEventListener('DOMContentLoaded', () => {
    // ===== ОТКРЫТИЕ ПРИГЛАШЕНИЯ =====
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const music = document.getElementById('bgMusic');
            if (music) {
                music.volume = 0.3;
                music.play().catch(() => {});
            }

            intro.style.display = 'none';
            mainContent.style.display = 'block';
            // Плавная прокрутка к приветствию
            document.getElementById('greeting').scrollIntoView({ behavior: 'smooth' });

            // Запускаем фоновые фейерверки
            startBgFireworks();
            // Запускаем фейерверки в предложении
            startProposalFireworks();
        });
    }

    // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ =====
    const storyAnimateElements = document.querySelectorAll('.story-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    storyAnimateElements.forEach(el => observer.observe(el));

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

    // ===== ФОНОВЫЕ ФЕЙЕРВЕРКИ =====
    function startBgFireworks() {
        const container = document.getElementById('bgFireworks');
        if (!container) return;
        function createFirework() {
            const span = document.createElement('span');
            span.className = 'firework-bg';
            span.style.left = Math.random() * 100 + '%';
            span.style.top = Math.random() * 100 + '%';
            container.appendChild(span);
            setTimeout(() => span.remove(), 2000);
        }
        setInterval(createFirework, 500);
    }

    // ===== ФЕЙЕРВЕРКИ В ПРЕДЛОЖЕНИИ =====
    function startProposalFireworks() {
        const proposalSection = document.getElementById('proposal');
        if (!proposalSection) return;
        const heart = proposalSection.querySelector('.proposal__heart');
        if (!heart) return;
        const fireworkContainer = heart.querySelector('.firework-particles');
        function createProposalFirework() {
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
        setInterval(createProposalFirework, 800);
    }
});