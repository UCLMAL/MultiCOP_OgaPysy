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
    }
};
