import { CONFIG } from './config.js';

export class PlaylistManager {
    constructor(sceneManager, uiManager, videoElement) {
        this.sceneManager = sceneManager;
        this.uiManager = uiManager;
        this.videoElement = videoElement;
        this.currentIndex = 0;
        this.playlist = CONFIG.playlist;
        this.settings = CONFIG.playlistSettings;
        this.preloadElement = null;
        this.isInitialized = false;
        
        // UI Elements reference
        this.counterElement = document.getElementById('playlistCounter');
    }

    init() {
        if (this.isInitialized) return;

        // Setup video ended event listener
        this.videoElement.addEventListener('ended', () => this.handleVideoEnded());

        // Create preload video element if enabled
        if (this.settings.preloadNext) {
            this.createPreloadElement();
        }

        // Bind the HTML buttons
        this.bindDOMControls();

        // Load first video
        this.playVideoAtIndex(0);

        this.isInitialized = true;
        console.log('🎬 PlaylistManager initialized with', this.playlist.length, 'videos');
    }

    /**
     * Connects the HTML buttons to the class methods
     */
    bindDOMControls() {
        const btnNext = document.getElementById('btnNext');
        const btnPrev = document.getElementById('btnPrev');

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                console.log('User clicked Next');
                this.playNext();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                console.log('User clicked Previous');
                this.playPrevious();
            });
        }
    }

    createPreloadElement() {
        this.preloadElement = document.createElement('video');
        this.preloadElement.setAttribute('playsinline', '');
        this.preloadElement.setAttribute('crossorigin', 'anonymous');
        this.preloadElement.style.display = 'none';
        document.body.appendChild(this.preloadElement);
    }

    playVideoAtIndex(index) {
        if (index < 0 || index >= this.playlist.length) {
            console.warn('Invalid playlist index:', index);
            return;
        }

        this.currentIndex = index;
        const videoConfig = this.playlist[index];

        console.log(`▶️  Playing video ${index + 1}/${this.playlist.length}:`, videoConfig.url);

        // Set video source
        this.videoElement.src = videoConfig.url;

        // Update UI to match configuration
        this.updateUIFromConfig(videoConfig);
        
        // Update the playlist counter (e.g. "1 / 5")
        this.updateCounterDisplay();

        // Play video
        this.videoElement.play().catch(err => {
            console.error('Video play failed:', err);
        });

        // Preload next video if enabled
        if (this.settings.preloadNext) {
            this.preloadNextVideo();
        }
    }

    updateCounterDisplay() {
        if (this.counterElement) {
            const current = this.currentIndex + 1;
            const total = this.playlist.length;
            // Updates text to "1 / 5"
            this.counterElement.textContent = `${current} / ${total}`;
        }
    }

    playNext() {
        let nextIndex = this.currentIndex + 1;

        // Handle end of playlist
        if (nextIndex >= this.playlist.length) {
            if (this.settings.loop) {
                nextIndex = 0;
                console.log('🔄 Playlist looping back to start');
            } else {
                console.log('⏹️  Playlist finished');
                return;
            }
        }

        this.playVideoAtIndex(nextIndex);
    }

    playPrevious() {
        let prevIndex = this.currentIndex - 1;

        // Handle start of playlist
        if (prevIndex < 0) {
            if (this.settings.loop) {
                prevIndex = this.playlist.length - 1;
            } else {
                prevIndex = 0;
            }
        }

        this.playVideoAtIndex(prevIndex);
    }

    handleVideoEnded() {
        console.log('✅ Video ended, advancing to next');
        this.playNext();
    }

    updateUIFromConfig(config) {
        if (this.uiManager && this.uiManager.updateAllUIFromConfig) {
            this.uiManager.updateAllUIFromConfig(config);
        }
    }

    preloadNextVideo() {
        if (!this.preloadElement) return;

        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextVideo = this.playlist[nextIndex];

        this.preloadElement.src = nextVideo.url;
        this.preloadElement.load();

        console.log('⏳ Preloading next video:', nextVideo.url);
    }

    getCurrentVideo() {
        return {
            index: this.currentIndex,
            total: this.playlist.length,
            config: this.playlist[this.currentIndex]
        };
    }

    cleanup() {
        if (this.preloadElement) {
            this.preloadElement.remove();
            this.preloadElement = null;
        }
    }
}