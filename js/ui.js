import { CONFIG } from './config.js';

export class UIManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.currentVideoObjectUrl = null;

        // Get UI elements
        this.elements = {
            startButton: document.getElementById('startButton'),
            infoOverlay: document.getElementById('infoOverlay'),
            imageUpload: document.getElementById('imageUpload'),
            uploadLabel: document.getElementById('uploadLabel'),
            videoUpload: document.getElementById('videoUpload'),
            uploadVideoLabel: document.getElementById('uploadVideoLabel'),
            videoButton: document.getElementById('videoButton'),
            imageCanvas: document.getElementById('imageCanvas'),
            zoomControl: document.getElementById('zoomControl'),
            zoomSlider: document.getElementById('zoomSlider'),
            zoomValueSpan: document.getElementById('zoomValue'),
            rotationXControl: document.getElementById('rotationXControl'),
            rotationXSlider: document.getElementById('rotationXSlider'),
            rotationXValueSpan: document.getElementById('rotationXValue'),
            rotationYControl: document.getElementById('rotationYControl'),
            rotationYSlider: document.getElementById('rotationYSlider'),
            rotationYValueSpan: document.getElementById('rotationYValue'),
            video: document.getElementById('video')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Start button
        this.elements.startButton.addEventListener('click', () => this.handleStart());

        // Image upload
        this.elements.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // Video upload
        this.elements.videoUpload.addEventListener('change', (e) => this.handleVideoUpload(e));

        // Default video button
        this.elements.videoButton.addEventListener('click', () => this.handleDefaultVideo());

        // Zoom slider
        this.elements.zoomSlider.addEventListener('input', (e) => this.handleZoomChange(e));

        // Rotation X slider
        this.elements.rotationXSlider.addEventListener('input', (e) => this.handleRotationXChange(e));

        // Rotation Y slider
        this.elements.rotationYSlider.addEventListener('input', (e) => this.handleRotationYChange(e));
    }

    handleStart() {
        this.elements.video.play()
            .then(() => {
                this.elements.infoOverlay.style.display = 'none';
                this.showControls();
            })
            .catch(err => {
                console.error("Video play failed:", err);
                this.elements.startButton.textContent = "Error - Could not play video";
                this.elements.startButton.disabled = true;
            });
    }

    showControls() {
        this.elements.uploadLabel.style.display = 'block';
        this.elements.uploadVideoLabel.style.display = 'block';
        this.elements.videoButton.style.display = 'block';
        this.elements.zoomControl.style.display = 'flex';
        this.elements.rotationXControl.style.display = 'flex';
        this.elements.rotationYControl.style.display = 'flex';
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                const ctx = this.elements.imageCanvas.getContext('2d');
                const sWidth = image.width;
                const sHeight = image.height;
                const dWidth = this.elements.imageCanvas.width;
                const dHeight = this.elements.imageCanvas.height;

                const scale = Math.max(dWidth / sWidth, dHeight / sHeight);
                const scaledWidth = sWidth * scale;
                const scaledHeight = sHeight * scale;
                const dx = (dWidth - scaledWidth) / 2;
                const dy = (dHeight - scaledHeight) / 2;

                ctx.clearRect(0, 0, dWidth, dHeight);
                ctx.drawImage(image, dx, dy, scaledWidth, scaledHeight);

                this.elements.video.pause();

                if (this.sceneManager.envTexture) {
                    this.sceneManager.envTexture.needsUpdate = true;
                }
            };
            image.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (this.currentVideoObjectUrl) {
            URL.revokeObjectURL(this.currentVideoObjectUrl);
        }

        this.currentVideoObjectUrl = URL.createObjectURL(file);
        this.elements.video.src = this.currentVideoObjectUrl;
        this.elements.video.play();
    }

    handleDefaultVideo() {
        if (this.currentVideoObjectUrl) {
            URL.revokeObjectURL(this.currentVideoObjectUrl);
            this.currentVideoObjectUrl = null;
        }

        this.elements.video.src = CONFIG.defaultVideoSrc;
        this.elements.video.play();
    }

    handleZoomChange(event) {
        const zoomValue = parseFloat(event.target.value);
        this.sceneManager.setZoom(zoomValue);
        this.elements.zoomValueSpan.textContent = zoomValue.toFixed(2);
    }

    handleRotationXChange(event) {
        const rotationValue = parseFloat(event.target.value);
        this.sceneManager.setRotationX(rotationValue);
        // Convert radians to degrees for display
        const degrees = (rotationValue * 180 / Math.PI).toFixed(2);
        this.elements.rotationXValueSpan.textContent = degrees;
    }

    handleRotationYChange(event) {
        const rotationValue = parseFloat(event.target.value);
        this.sceneManager.setRotationY(rotationValue);
        // Convert radians to degrees for display
        const degrees = (rotationValue * 180 / Math.PI).toFixed(2);
        this.elements.rotationYValueSpan.textContent = degrees;
    }

    cleanup() {
        if (this.currentVideoObjectUrl) {
            URL.revokeObjectURL(this.currentVideoObjectUrl);
        }
    }
}
