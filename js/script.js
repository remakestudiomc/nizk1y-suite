class PhotoSlider {
    constructor() {
        this.sliderTrack = document.getElementById('sliderTrack');
        this.sliderContainer = document.querySelector('.slider-container');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentIndex = 0;
        this.totalImages = 5;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        this.autoSlideEnabled = true;
        this.userInteracted = false;
        this.autoSlideInterval = null;
        this.autoSlideTimeout = null;
        
        this.init();
    }
    
    init() {
        this.sliderContainer.addEventListener('mousedown', this.handleStart.bind(this));
        this.sliderContainer.addEventListener('mousemove', this.handleMove.bind(this));
        this.sliderContainer.addEventListener('mouseup', this.handleEnd.bind(this));
        this.sliderContainer.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        this.sliderContainer.addEventListener('touchstart', this.handleStart.bind(this));
        this.sliderContainer.addEventListener('touchmove', this.handleMove.bind(this));
        this.sliderContainer.addEventListener('touchend', this.handleEnd.bind(this));
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.sliderContainer.addEventListener('contextmenu', e => e.preventDefault());
        
        this.startAutoSlide();
        
        this.sliderContainer.addEventListener('mouseenter', () => {
            if (!this.userInteracted) this.pauseAutoSlide();
        });
        this.sliderContainer.addEventListener('mouseleave', () => {
            if (!this.userInteracted) this.resumeAutoSlide();
        });
        
        this.updateSliderPosition();
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getEventX(e);
        this.sliderTrack.style.transition = 'none';
        this.disableAutoSlide();
        
        e.preventDefault();
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = this.getEventX(e);
        const diffX = this.currentX - this.startX;
        
        const resistance = this.getResistance(diffX);
        const translateX = (-this.currentIndex * 20) + (diffX * resistance / window.innerWidth * 20);
        
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const diffX = this.currentX - this.startX;
        
        if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0 && this.currentIndex > 0) {
                this.currentIndex--;
            } else if (diffX < 0 && this.currentIndex < this.totalImages - 1) {
                this.currentIndex++;
            } else if (diffX < 0 && this.currentIndex === this.totalImages - 1) {
                this.currentIndex = 0;
            } else if (diffX > 0 && this.currentIndex === 0) {
                this.currentIndex = this.totalImages - 1;
            }
        }
        
        this.updateSliderPosition();
        this.resetAutoSlideTimer();
    }
    
    getEventX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    getResistance(diffX) {
        const isAtStart = this.currentIndex === 0 && diffX > 0;
        const isAtEnd = this.currentIndex === this.totalImages - 1 && diffX < 0;
        
        if (isAtStart || isAtEnd) {
            return 0.3;
        }
        return 1;
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSliderPosition();
        this.disableAutoSlide();
        this.resetAutoSlideTimer();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const translateX = -this.currentIndex * 20;
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;

        this.updateIndicators();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoSlide() {
        if (!this.autoSlideEnabled) return;
        
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            if (!this.isDragging && this.autoSlideEnabled && !this.userInteracted) {
                this.nextSlide();
            }
        }, 4000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    pauseAutoSlide() {
        this.stopAutoSlide();
    }
    
    resumeAutoSlide() {
        if (!this.userInteracted) {
            this.startAutoSlide();
        }
    }
    
    disableAutoSlide() {
        this.autoSlideEnabled = false;
        this.userInteracted = true;
        this.stopAutoSlide();
        
        this.resetAutoSlideTimer();
    }
    
    resetAutoSlideTimer() {
        if (this.autoSlideTimeout) {
            clearTimeout(this.autoSlideTimeout);
        }
        
        this.autoSlideTimeout = setTimeout(() => {
            this.autoSlideEnabled = true;
            this.userInteracted = false;
            this.startAutoSlide();
        }, 10000);
    }
}

class CurrencyConverter {
    constructor() {
        this.rublesInput = document.getElementById('rubles');
        this.centimetersInput = document.getElementById('centimeters');
        this.converterIcon = document.getElementById('converterIcon');
        this.converterButton = document.querySelector('.converter-icon');
        this.rate = 30;
        
        this.init();
    }
    
    init() {
        this.rublesInput.addEventListener('input', this.convertFromRubles.bind(this));
        this.centimetersInput.addEventListener('input', this.convertFromCentimeters.bind(this));
        this.converterButton.addEventListener('click', this.openSwapLink.bind(this));
        
        this.rublesInput.addEventListener('keypress', this.validateInput.bind(this));
        this.centimetersInput.addEventListener('keypress', this.validateInput.bind(this));
        
        this.rublesInput.addEventListener('focus', this.onInputFocus.bind(this));
        this.rublesInput.addEventListener('blur', this.onInputBlur.bind(this));
        this.centimetersInput.addEventListener('focus', this.onInputFocus.bind(this));
        this.centimetersInput.addEventListener('blur', this.onInputBlur.bind(this));
    }
    
    openSwapLink() {
        window.open('https://www.youtube.com/watch?v=abzVY9aUZIU', '_blank', 'noopener,noreferrer');
    }
    
    convertFromRubles() {
        const rubles = parseFloat(this.rublesInput.value) || 0;
        const centimeters = rubles * this.rate;
        this.centimetersInput.value = centimeters === 0 ? '' : Math.round(centimeters);
        this.animateConverter();
    }
    
    convertFromCentimeters() {
        const centimeters = parseFloat(this.centimetersInput.value) || 0;
        const rubles = centimeters / this.rate;
        this.rublesInput.value = rubles === 0 ? '' : Math.round(rubles * 100) / 100;
        this.animateConverter();
    }
    
    animateConverter() {
        this.converterIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.converterIcon.style.transform = 'scale(1)';
        }, 150);
    }
    
    validateInput(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9.]/.test(char)) {
            e.preventDefault();
        }
    }
    
    onInputFocus(e) {
        e.target.style.transform = 'scale(1.02)';
        e.target.style.borderColor = '#7743D4';
    }
    
    onInputBlur(e) {
        e.target.style.transform = 'scale(1)';
        e.target.style.borderColor = '#FFF';
    }
}

class AudioPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.playBtn = document.getElementById('playBtn');
        this.playIcon = document.getElementById('playIcon');
        this.progress = document.getElementById('progress');
        this.curTime = document.getElementById('curTime');
        this.durTime = document.getElementById('durTime');
        this.volume = document.getElementById('volume');
        this.muteBtn = document.getElementById('muteBtn');
        this.prevVolume = 1;
        
        this.init();
    }
    
    init() {
        this.formatTime = (time) => {
            if (!isFinite(time)) return '0:00';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.progress.max = 100;
            this.durTime.textContent = this.formatTime(this.audio.duration);
        });
        
        this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.audio.addEventListener('ended', () => this.setPlaying(false));
        
        this.playBtn.addEventListener('click', this.togglePlay.bind(this));
        this.progress.addEventListener('input', this.seekAudio.bind(this));
        this.volume.addEventListener('input', this.changeVolume.bind(this));
        this.muteBtn.addEventListener('click', this.toggleMute.bind(this));
        
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    async togglePlay() {
        try {
            if (this.audio.paused) {
                await this.audio.play();
                this.setPlaying(true);
            } else {
                this.audio.pause();
                this.setPlaying(false);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }
    
    setPlaying(isPlaying) {
        this.playIcon.innerHTML = isPlaying 
            ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' 
            : '<path d="M8 5v14l11-7z"/>';
        
        if (isPlaying) {
            this.playBtn.style.boxShadow = '0 15px 40px rgba(119, 67, 212, 0.8)';
        } else {
            this.playBtn.style.boxShadow = '0 10px 30px rgba(119, 67, 212, 0.4)';
        }
    }
    
    updateProgress() {
        if (isFinite(this.audio.duration) && this.audio.duration > 0) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.value = percent;
            this.curTime.textContent = this.formatTime(this.audio.currentTime);
            
            this.progress.style.background = `linear-gradient(90deg, 
                #7743D4 0%, 
                #7743D4 ${percent}%, 
                rgba(255,255,255,0.2) ${percent}%, 
                rgba(255,255,255,0.2) 100%)`;
        }
    }
    
    seekAudio() {
        const percent = Number(this.progress.value) / 100;
        this.audio.currentTime = percent * this.audio.duration;
    }
    
    changeVolume() {
        this.audio.volume = Number(this.volume.value);
        this.updateMuteButton();
    }
    
    toggleMute() {
        if (this.audio.volume > 0) {
            this.prevVolume = this.audio.volume;
            this.audio.volume = 0;
            this.volume.value = 0;
        } else {
            this.audio.volume = this.prevVolume || 1;
            this.volume.value = this.audio.volume;
        }
        this.updateMuteButton();
    }
    
    updateMuteButton() {
        this.muteBtn.innerHTML = this.audio.volume === 0
            ? '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>';
        this.muteBtn.setAttribute('aria-label', this.audio.volume === 0 ? 'Unmute audio' : 'Mute audio');
        
        const percent = this.audio.volume * 100;
        this.volume.style.background = `linear-gradient(90deg, 
            #7743D4 0%, 
            #7743D4 ${percent}%, 
            rgba(255,255,255,0.2) ${percent}%, 
            rgba(255,255,255,0.2) 100%)`;
    }
    
    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.audio.volume = Math.min(1, this.audio.volume + 0.1);
                this.volume.value = this.audio.volume;
                this.updateMuteButton();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.audio.volume = Math.max(0, this.audio.volume - 0.1);
                this.volume.value = this.audio.volume;
                this.updateMuteButton();
                break;
        }
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

class AnimationObserver {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PhotoSlider();
    new CurrencyConverter();
    new AudioPlayer();
    new SmoothScroll();
    new AnimationObserver();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});