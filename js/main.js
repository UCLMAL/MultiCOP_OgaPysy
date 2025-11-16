import { SceneManager } from './scene.js';
import { UIManager } from './ui.js';
import { PlaylistManager } from './playlist.js';

// Initialize the application
let sceneManager;
let uiManager;
let playlistManager;

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

    // Create playlist manager
    playlistManager = new PlaylistManager(sceneManager, uiManager, videoElement);

    // Setup start button with scene initialization
    startButton.addEventListener('click', () => {
        // Initialize scene
        sceneManager.init(container, videoElement, canvasElement);

        // Initialize playlist (this will start playing first video)
        playlistManager.init();

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
    if (playlistManager) {
        playlistManager.cleanup();
    }
});
