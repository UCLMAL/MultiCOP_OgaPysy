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
    }

    init() {
        if (this.isInitialized) return;

        // Setup video ended event listener
        this.videoElement.addEventListener('ended', () => this.handleVideoEnded());

        // Create preload video element if enabled
        if (this.settings.preloadNext) {
            this.createPreloadElement();
        }

        // Load first video
        this.playVideoAtIndex(0);

        this.isInitialized = true;
        console.log('🎬 PlaylistManager initialized with', this.playlist.length, 'videos');
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

        // Apply video configuration to scene
        this.applyVideoConfig(videoConfig);

        // Update UI to match configuration
        this.updateUIFromConfig(videoConfig);

        // Play video
        this.videoElement.play().catch(err => {
            console.error('Video play failed:', err);
        });

        // Preload next video if enabled
        if (this.settings.preloadNext) {
            this.preloadNextVideo();
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

    applyVideoConfig(config) {
        // Apply all parameters to the scene
        this.sceneManager.setZoom(config.zoom);
        this.sceneManager.setRotationX(config.rotationX);
        this.sceneManager.setRotationY(config.rotationY);
        this.sceneManager.setTinyPlanet(config.tinyPlanet);
        this.sceneManager.setDirectView(config.directView);
    }

    updateUIFromConfig(config) {
        // Update UI controls to match configuration
        if (this.uiManager && this.uiManager.updateAllUIFromConfig) {
            this.uiManager.updateAllUIFromConfig(config);
        }
    }

    preloadNextVideo() {
        if (!this.preloadElement) return;

        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextVideo = this.playlist[nextIndex];

        // Set source and start loading
        this.preloadElement.src = nextVideo.url;
        this.preloadElement.load();

        console.log('⏳ Preloading next video:', nextVideo.url);
    }

    // Public method to get current video info
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
