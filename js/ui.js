import { CONFIG } from './config.js';

export class UIManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;

        // Get UI elements
        this.elements = {
            startButton: document.getElementById('startButton'),
            infoOverlay: document.getElementById('infoOverlay'),
            zoomControl: document.getElementById('zoomControl'),
            zoomSlider: document.getElementById('zoomSlider'),
            zoomValueSpan: document.getElementById('zoomValue'),
            rotationXControl: document.getElementById('rotationXControl'),
            rotationXSlider: document.getElementById('rotationXSlider'),
            rotationXValueSpan: document.getElementById('rotationXValue'),
            rotationYControl: document.getElementById('rotationYControl'),
            rotationYSlider: document.getElementById('rotationYSlider'),
            rotationYValueSpan: document.getElementById('rotationYValue'),
            tinyPlanetControl: document.getElementById('tinyPlanetControl'),
            tinyPlanetToggle: document.getElementById('tinyPlanetToggle'),
            directViewControl: document.getElementById('directViewControl'),
            directViewToggle: document.getElementById('directViewToggle')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Start button
        this.elements.startButton.addEventListener('click', () => this.handleStart());

        // Zoom slider
        this.elements.zoomSlider.addEventListener('input', (e) => this.handleZoomChange(e));

        // Rotation X slider
        this.elements.rotationXSlider.addEventListener('input', (e) => this.handleRotationXChange(e));

        // Rotation Y slider
        this.elements.rotationYSlider.addEventListener('input', (e) => this.handleRotationYChange(e));

        // Tiny Planet toggle
        this.elements.tinyPlanetToggle.addEventListener('change', (e) => this.handleTinyPlanetToggle(e));

        // Direct View toggle
        this.elements.directViewToggle.addEventListener('change', (e) => this.handleDirectViewToggle(e));
    }

    handleStart() {
        // PlaylistManager now handles video playback
        // Just hide overlay and show controls immediately
        this.elements.infoOverlay.style.display = 'none';
        this.showControls();
    }

    showControls() {
        this.elements.zoomControl.style.display = 'flex';
        this.elements.rotationXControl.style.display = 'flex';
        this.elements.rotationYControl.style.display = 'flex';
        this.elements.tinyPlanetControl.style.display = 'flex';
        this.elements.directViewControl.style.display = 'flex';
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

    handleTinyPlanetToggle(event) {
        const enabled = event.target.checked;
        this.sceneManager.setTinyPlanet(enabled);
    }

    handleDirectViewToggle(event) {
        const enabled = event.target.checked;
        this.sceneManager.setDirectView(enabled);
    }

    // Programmatic UI update methods for playlist manager
    setUIZoom(value) {
        this.elements.zoomSlider.value = value;
        this.elements.zoomValueSpan.textContent = value.toFixed(2);
        this.sceneManager.setZoom(value);
    }

    setUIRotationX(value) {
        this.elements.rotationXSlider.value = value;
        const degrees = (value * 180 / Math.PI).toFixed(2);
        this.elements.rotationXValueSpan.textContent = degrees;
        this.sceneManager.setRotationX(value);
    }

    setUIRotationY(value) {
        this.elements.rotationYSlider.value = value;
        const degrees = (value * 180 / Math.PI).toFixed(2);
        this.elements.rotationYValueSpan.textContent = degrees;
        this.sceneManager.setRotationY(value);
    }

    setUITinyPlanet(enabled) {
        this.elements.tinyPlanetToggle.checked = enabled;
        this.sceneManager.setTinyPlanet(enabled);
    }

    setUIDirectView(enabled) {
        this.elements.directViewToggle.checked = enabled;
        this.sceneManager.setDirectView(enabled);
    }

    // Update all UI controls from config object
    updateAllUIFromConfig(config) {
        this.setUIZoom(config.zoom);
        this.setUIRotationX(config.rotationX);
        this.setUIRotationY(config.rotationY);
        this.setUITinyPlanet(config.tinyPlanet);
        this.setUIDirectView(config.directView);
    }

    cleanup() {
        // No cleanup needed - playlist manager handles video lifecycle
    }
}
