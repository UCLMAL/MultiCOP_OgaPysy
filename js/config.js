// Configuration constants
export const CONFIG = {
    defaultVideoSrc: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/WDW_Grafizmo_Final.mp4',
    modelSrc: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/Oga_Test_2.glb',
    canvasSize: 1024,
    camera: {
        fov: 60,
        near: 0.1,
        far: 100,
        position: { x: 0, y: 1, z: 5 },
        lookAt: { x: 0, y: 1, z: 0 }
    },
    controls: {
        enableDamping: true,
        target: { x: 0, y: 1, z: 0 }
    },
    renderer: {
        physicallyCorrectLights: true,
        toneMappingExposure: 1.0
    },
    zoom: {
        min: 0.5,
        max: 4,
        default: 1,
        step: 0.01
    },
    rotation: {
        min: -Math.PI,
        max: Math.PI,
        defaultX: 0,
        defaultY: 0,
        step: 0.01
    },
    projectionMode: {
        default: 0,  // 0: cubemap, 1: tinyPlanet, 2: equirectangular
        modes: {
            cubemap: 0,
            tinyPlanet: 1,
            equirectangular: 2
        }
    },
    directView: {
        default: true
    },
    playlist: [
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-01-001.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-01-002.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-01-003.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-02-002.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-02-004.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-02-005.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-02-009.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/MOP-03-02.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/05.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        },
        {
            url: 'https://pub-66a5e419a59846e58e64646d349e80c4.r2.dev/fire%20and%20guaxire%20cut_1.mp4',
            zoom: 1.0,
            rotationX: 0,
            rotationY: 0,
            projectionMode: 2,  // cubemap
            directView: true
        }
        // Add more videos here as needed
    ],
    playlistSettings: {
        loop: true,          // Loop playlist when it reaches the end
        preloadNext: true    // Preload next video for smooth transitions
    }
};
