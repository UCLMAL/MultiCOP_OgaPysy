import { SceneManager } from './scene.js';
import { UIManager } from './ui.js';

// Initialize the application
let sceneManager;
let uiManager;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Get necessary elements
    const container = document.getElementById('container');
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('imageCanvas');
    const startButton = document.getElementById('startButton');

    // Create scene manager
    sceneManager = new SceneManager();

    // Create UI manager
    uiManager = new UIManager(sceneManager);

    // Setup start button with scene initialization
    startButton.addEventListener('click', () => {
        // Initialize scene
        sceneManager.init(container, videoElement, canvasElement);

        // Start animation
        sceneManager.start();
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (sceneManager) {
        sceneManager.stop();
    }
    if (uiManager) {
        uiManager.cleanup();
    }
});
