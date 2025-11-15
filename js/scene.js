import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from './config.js';

export class SceneManager {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controls = null;
        this.video = null;
        this.envTexture = null;
        this.cubeCamera = null;
        this.cubeRenderTarget = null;
        this.scene2 = null;
        this.videoBox = null;
        this.loadedModel = null;
        this.imageCanvas = null;
        this.animationId = null;
    }

    init(container, videoElement, canvasElement) {
        this.video = videoElement;
        this.imageCanvas = canvasElement;

        // Initialize main scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        this.camera.position.set(
            CONFIG.camera.position.x,
            CONFIG.camera.position.y,
            CONFIG.camera.position.z
        );
        this.camera.lookAt(
            CONFIG.camera.lookAt.x,
            CONFIG.camera.lookAt.y,
            CONFIG.camera.lookAt.z
        );

        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = CONFIG.renderer.physicallyCorrectLights;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = CONFIG.renderer.toneMappingExposure;
        container.appendChild(this.renderer.domElement);

        // Initialize controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = CONFIG.controls.enableDamping;
        this.controls.target.set(
            CONFIG.controls.target.x,
            CONFIG.controls.target.y,
            CONFIG.controls.target.z
        );

        // Setup texture
        this.setupTexture();

        // Setup environment map
        this.setupEnvironmentMap();

        // Load model
        this.loadModel();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupTexture() {
        this.envTexture = new THREE.CanvasTexture(this.imageCanvas);
        this.envTexture.encoding = THREE.sRGBEncoding;
        this.envTexture.minFilter = THREE.LinearFilter;
        this.envTexture.magFilter = THREE.LinearFilter;
    }

    setupEnvironmentMap() {
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
            CONFIG.cubeRenderTargetSize,
            {
                format: THREE.RGBAFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter,
            }
        );
        this.cubeRenderTarget.texture.encoding = THREE.sRGBEncoding;

        this.cubeCamera = new THREE.CubeCamera(0.01, 100, this.cubeRenderTarget);

        this.scene2 = new THREE.Scene();

        const videoMaterial = new THREE.MeshBasicMaterial({
            map: this.envTexture,
            side: THREE.BackSide
        });

        this.videoBox = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            videoMaterial
        );
        this.scene2.add(this.videoBox);
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            CONFIG.modelSrc,
            (gltf) => {
                this.loadedModel = gltf.scene;

                this.loadedModel.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.material.envMap = this.cubeRenderTarget.texture;
                        node.material.metalness = CONFIG.material.metalness;
                        node.material.roughness = CONFIG.material.roughness;
                        node.material.needsUpdate = true;
                    }
                });

                this.scene.add(this.loadedModel);
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the model:', error);
                const errorBox = new THREE.Mesh(
                    new THREE.BoxGeometry(1, 1, 1),
                    new THREE.MeshStandardMaterial({ color: 0xff0000 })
                );
                this.scene.add(errorBox);
            }
        );
    }

    updateVideoTexture() {
        if (this.video && !this.video.paused && this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
            const vWidth = this.video.videoWidth;
            const vHeight = this.video.videoHeight;

            const sSize = Math.min(vWidth, vHeight);
            const sX = (vWidth - sSize) / 2;
            const sY = (vHeight - sSize) / 2;

            const ctx = this.imageCanvas.getContext('2d');
            const dSize = this.imageCanvas.width;

            ctx.drawImage(this.video, sX, sY, sSize, sSize, 0, 0, dSize, dSize);

            if (this.envTexture) {
                this.envTexture.needsUpdate = true;
            }
        }
    }

    setZoom(zoomValue) {
        const newScale = 1.0 / zoomValue;
        if (this.videoBox) {
            this.videoBox.scale.set(newScale, newScale, newScale);
        }
        if (this.envTexture) {
            this.envTexture.needsUpdate = true;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.updateVideoTexture();

        if (this.cubeCamera) {
            this.cubeCamera.update(this.renderer, this.scene2);
        }

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
