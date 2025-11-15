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
        this.loadedModel = null;
        this.imageCanvas = null;
        this.animationId = null;
        this.shaderMaterial = null;
        this.backgroundSphere = null;
        this.backgroundMaterial = null;
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

        // Load shaders and model
        this.loadShadersAndModel();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupTexture() {
        this.envTexture = new THREE.CanvasTexture(this.imageCanvas);
        this.envTexture.encoding = THREE.sRGBEncoding;
        this.envTexture.minFilter = THREE.LinearFilter;
        this.envTexture.magFilter = THREE.LinearFilter;
    }

    getAspectRatio() {
        // Calculate aspect ratio from canvas (which always contains the video/image)
        return this.imageCanvas.width / this.imageCanvas.height;
    }

    async loadShadersAndModel() {
        try {
            // Load shader files
            const [vertexShader, fragmentShader] = await Promise.all([
                fetch('./js/shaders/portal.vert').then(r => r.text()),
                fetch('./js/shaders/portal.frag').then(r => r.text())
            ]);

            // Create shader material for reflective model
            this.shaderMaterial = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    envMap: { value: this.envTexture },
                    cameraPosition: { value: this.camera.position },
                    zoom: { value: CONFIG.zoom.default },
                    rotationX: { value: CONFIG.rotation.defaultX },
                    rotationY: { value: CONFIG.rotation.defaultY },
                    tinyPlanet: { value: CONFIG.tinyPlanet.default },
                    directView: { value: false },  // Model uses reflection mode
                    aspectRatio: { value: this.getAspectRatio() }
                }
            });

            // Create shader material for background sphere (shares same shaders)
            this.backgroundMaterial = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    envMap: { value: this.envTexture },
                    cameraPosition: { value: this.camera.position },
                    zoom: { value: CONFIG.zoom.default },
                    rotationX: { value: CONFIG.rotation.defaultX },
                    rotationY: { value: CONFIG.rotation.defaultY },
                    tinyPlanet: { value: CONFIG.tinyPlanet.default },
                    directView: { value: true },  // Background always uses direct view
                    aspectRatio: { value: this.getAspectRatio() }
                },
                side: THREE.BackSide  // Render inside of sphere
            });

            // Create background sphere
            const sphereGeometry = new THREE.SphereGeometry(50, 60, 40);
            this.backgroundSphere = new THREE.Mesh(sphereGeometry, this.backgroundMaterial);
            this.backgroundSphere.visible = false;  // Hidden by default
            this.scene.add(this.backgroundSphere);

            // Load model
            this.loadModel();
        } catch (error) {
            console.error('Error loading shaders:', error);
        }
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            CONFIG.modelSrc,
            (gltf) => {
                this.loadedModel = gltf.scene;

                // Replace all materials with our custom shader material
                this.loadedModel.traverse((node) => {
                    if (node.isMesh && this.shaderMaterial) {
                        node.material = this.shaderMaterial;
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
        if (this.shaderMaterial && this.shaderMaterial.uniforms.zoom) {
            this.shaderMaterial.uniforms.zoom.value = zoomValue;
        }
        if (this.backgroundMaterial && this.backgroundMaterial.uniforms.zoom) {
            this.backgroundMaterial.uniforms.zoom.value = zoomValue;
        }
    }

    setRotationX(rotationValue) {
        if (this.shaderMaterial && this.shaderMaterial.uniforms.rotationX) {
            this.shaderMaterial.uniforms.rotationX.value = rotationValue;
        }
        if (this.backgroundMaterial && this.backgroundMaterial.uniforms.rotationX) {
            // Invert rotation for background to match reflection behavior
            this.backgroundMaterial.uniforms.rotationX.value = -rotationValue;
        }
    }

    setRotationY(rotationValue) {
        if (this.shaderMaterial && this.shaderMaterial.uniforms.rotationY) {
            this.shaderMaterial.uniforms.rotationY.value = rotationValue;
        }
        if (this.backgroundMaterial && this.backgroundMaterial.uniforms.rotationY) {
            // Invert rotation for background to match reflection behavior
            this.backgroundMaterial.uniforms.rotationY.value = -rotationValue;
        }
    }

    setTinyPlanet(enabled) {
        if (this.shaderMaterial && this.shaderMaterial.uniforms.tinyPlanet) {
            this.shaderMaterial.uniforms.tinyPlanet.value = enabled;
        }
        if (this.backgroundMaterial && this.backgroundMaterial.uniforms.tinyPlanet) {
            this.backgroundMaterial.uniforms.tinyPlanet.value = enabled;
        }
    }

    setDirectView(enabled) {
        // Show/hide background sphere (model stays visible)
        if (this.backgroundSphere) {
            this.backgroundSphere.visible = enabled;
        }
        // Model always stays visible for reflections
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
