// ==========================================
// GLOBALS & DOM ELEMENTS
// ==========================================
const clickScene = document.getElementById('scene');
const letterSection = document.getElementById('letterSection');
const musicBtn = document.getElementById('musicButton');
const audio = document.getElementById('bgMusic');
const closeLetterBtn = document.getElementById('closeLetterBtn');

// ==========================================
// CONFIGURATION & TIMELINE DATES (REAL MODE)
// ==========================================
// 1. Starts tracking the flower growth from today, June 26
const startDate = new Date("June 26, 2026 15:00:00").getTime(); 

// 2. Targets exactly Midnight (12:00 AM) when July 8 begins!
const targetDate = new Date("July 8, 2026 00:00:00").getTime(); 

const totalDuration = targetDate - startDate;

// ==========================================
// COUNTDOWN ENGINE
// ==========================================
function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    // Calculate overall percentage of time passed (from 0 to 1)
    let timePassed = now - startDate;
    let progress = timePassed / totalDuration;
    
    // Safety caps to keep progress accurate
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Apply the real-time progress to the lotus flower
    animateLotus(progress);

    // ==========================================
    // SHOW MUSIC BUTTON AT 10 SECONDS REMAINING
    // ==========================================
    if (timeRemaining <= 10000 && timeRemaining > 0) { 
        musicBtn.style.display = "block"; 
    }

    // EXACT MOMENT TIMER HITS ZERO:
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        daysElement.innerText = "00";
        hoursElement.innerText = "00";
        minutesElement.innerText = "00";
        secondsElement.innerText = "00";
        
        // 1. Force the flower to stand 100% wide open
        animateLotus(1);
        
        // 2. Change the screen text instantly
        document.querySelector(".subtitle").innerText = "The wait is over! Happy Birthday! 🎉";
        document.getElementById("clickText").innerText = "Your birthday message has bloomed... ✨";
        
        // 3. AUTOMATICALLY open the hidden letter section
        letterSection.style.visibility = 'visible';
        letterSection.style.opacity = '1';

        // 4. 🎉 START THE MUSIC AUTOMATICALLY! Also force button to show if it didn't
        musicBtn.style.display = "block";
        audio.play().catch(err => console.log("Audio autoplay prevented: waiting for click."));
        musicBtn.innerText = "♥"; 
        
        return;
    }

    // Standard live time conversions
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Pad single digits with a leading zero
    daysElement.innerText = days < 10 ? "0" + days : days;
    hoursElement.innerText = hours < 10 ? "0" + hours : hours;
    minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
    secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;
}

// ==========================================
// REAL-TIME LOTUS ENGINE
// ==========================================
function animateLotus(progress) {
    const petals = document.querySelectorAll('.petal');
    const core = document.querySelector('.center-core');

    let currentScale = 0.1 + (progress * 0.9);
    
    let currentOpacity = progress * 4; 
    if (currentOpacity > 1) currentOpacity = 1;

    petals.forEach((petal) => {
        let targetRot = parseFloat(getComputedStyle(petal).getPropertyValue('--target-rot')) || 0;
        let currentRot = targetRot * progress;

        petal.style.opacity = currentOpacity;
        petal.style.transform = `translate(-50%, -100%) scale(${currentScale}) rotate(${currentRot}deg)`;
    });

    if (core) {
        core.style.transform = `scale(${progress})`;
    }
}

// Start tracking immediately
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// ==========================================
// SECURE SCENE & MUSIC INTERACTIONS
// ==========================================
clickScene.addEventListener('click', () => {
    const now = new Date().getTime();
    
    if (targetDate - now <= 0) {
        letterSection.style.visibility = 'visible';
        letterSection.style.opacity = '1';
    } else {
        alert("No peeking! You have to wait until your birthday! 💖");
    }
});

// Music toggle engine
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (audio.paused) {
        audio.play().catch(err => console.log("Audio awaiting interaction gesture"));
        musicBtn.innerText = "♥";
    } else {
        audio.pause();
        musicBtn.innerText = "♪";
    }
});

// ==========================================
// CLOSE LETTER ENGINE
// ==========================================
closeLetterBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    
    letterSection.style.opacity = '0';
    
    setTimeout(() => {
        letterSection.style.visibility = 'hidden';
    }, 500); 
});

// ==========================================
// BROWSER AUDIO UNLOCKER 
// ==========================================
let audioPrimed = false;

document.addEventListener('click', () => {
    if (!audioPrimed) {
        audio.play().then(() => {
            audio.pause();
            audioPrimed = true;
            console.log("Audio framework ready for deployment.");
        }).catch(err => {
            console.log("Awaiting user gesture context.");
        });
    }
}, { once: true });