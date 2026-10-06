// ==========================================
// CONFIGURATION & PERSONALIZATION
// ==========================================
const CONFIG = {
    HER_NAME: "Partz!", // Change this to her actual name
    MY_NAME: "Asnairah, Your always partner in life",   
    
    // Open When messages
    openWhen: [
        {
            title: "💌 Open when you miss me",
            message: "I'm just a text or call away. I miss you too, more than you know. Go look at our old photos!"
        },
        {
            title: "💌 Open when you're having a bad day",
            message: "Take a deep breath. You are stronger than whatever is stressing you out. I believe in you, always."
        },
        {
            title: "💌 Open when you need a reminder that you're loved",
            message: "You are cherished, valued, and so important to me. Never doubt your worth."
        },
        {
            title: "💌 Open when you feel like giving up",
            message: "Rest if you must, but don't quit. You have come so far. I am always in your corner cheering for you."
        },
        {
            title: "💌 Open when you want to remember us",
            message: "Remember that time we couldn't stop laughing? That's my favorite version of us. More memories to come!"
        }
    ]
};

// ==========================================
// APP LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Personalization
    document.querySelectorAll('.her-name').forEach(el => el.textContent = CONFIG.HER_NAME);
    document.querySelectorAll('.my-name').forEach(el => el.textContent = CONFIG.MY_NAME);

    // 2. Render 'Open When' Cards
    const envelopeContainer = document.querySelector('.envelopes-container');
    CONFIG.openWhen.forEach(item => {
        const div = document.createElement('div');
        div.className = 'envelope';
        div.innerHTML = `
            <div class="envelope-title"><span>${item.title}</span> <span>🤍</span></div>
            <div class="envelope-message">${item.message}</div>
        `;
        div.addEventListener('click', () => div.classList.toggle('open'));
        envelopeContainer.appendChild(div);
    });

    // 3. Screen Navigation
    const screens = Array.from(document.querySelectorAll('.screen'));
    let currentScreenIndex = 0;

    function goToNextScreen() {
        if (currentScreenIndex < screens.length - 1) {
            screens[currentScreenIndex].classList.remove('active');
            screens[currentScreenIndex].classList.add('hidden');
            currentScreenIndex++;
            screens[currentScreenIndex].classList.remove('hidden');
            screens[currentScreenIndex].classList.add('active');
            window.scrollTo(0, 0);
            triggerFadeElements(screens[currentScreenIndex]);
        }
    }

    // Button Listeners for Navigation
    document.getElementById('btn-open').addEventListener('click', () => {
        goToNextScreen();
        setupScrollNavigation();
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
        location.reload(); // Simple replay
    });

    // 4. Scroll Intersections for Animations
    function triggerFadeElements(screen) {
        const elements = screen.querySelectorAll('.fade-element');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    }

    // 5. Scroll down to trigger next section naturally
    function setupScrollNavigation() {
        let isNavigating = false;
        window.addEventListener('wheel', (e) => handleScroll(e.deltaY), { passive: true });
        
        let touchStartY = 0;
        window.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY, { passive: true });
        window.addEventListener('touchend', e => {
            const touchEndY = e.changedTouches[0].screenY;
            handleScroll(touchStartY - touchEndY);
        }, { passive: true });

        function handleScroll(delta) {
            if (isNavigating) return;
            const currentSection = screens[currentScreenIndex];
            
            // If scrolled to bottom of current section, go next
            if (delta > 50 && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                isNavigating = true;
                setTimeout(() => { goToNextScreen(); isNavigating = false; }, 800);
            }
            // Optional: Scroll up to go back
            if (delta < -50 && window.scrollY <= 10 && currentScreenIndex > 1) {
                isNavigating = true;
                screens[currentScreenIndex].classList.remove('active');
                screens[currentScreenIndex].classList.add('hidden');
                currentScreenIndex--;
                screens[currentScreenIndex].classList.remove('hidden');
                screens[currentScreenIndex].classList.add('active');
                setTimeout(() => { isNavigating = false; }, 800);
            }
        }
    }

    // 6. Surprise Reveal Logic
    const btnSurprise = document.getElementById('btn-surprise');
    const surpriseText = document.getElementById('surprise-text');
    btnSurprise.addEventListener('click', () => {
        btnSurprise.style.display = 'none';
        surpriseText.classList.remove('hidden');
        
        const lines = surpriseText.querySelectorAll('.reveal-text');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
                createHeart(line);
                
                // If it's the last line, show the next screen after a delay
                if(index === lines.length - 1) {
                    setTimeout(goToNextScreen, 4000);
                }
            }, index * 2000); // 2 seconds between each line
        });
    });

    // 7. Music Controls
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.textContent = '♪ Play Music';
        } else {
            audio.play().catch(e => console.log("Audio play failed:", e));
            musicBtn.textContent = '|| Pause Music';
        }
        isPlaying = !isPlaying;
    });

    // 8. PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('Service Worker Registered'))
                .catch(err => console.log('Service Worker Error', err));
        });
    }

    // Helper: Falling Hearts
    function createHeart(parent) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '🤍';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = parent.getBoundingClientRect().top + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
    }
});