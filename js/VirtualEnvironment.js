import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { PointerLockControls } from './util/PointerLockControls.js';
import { TerrainController } from './util/TerrainController.js';
import { RemoteController } from './util/RemoteController.js';

import { DefaultDirectionalLight } from "./render/DefaultDirectionalLight.js"
import { DefaultComposer } from "./render/DefaultComposer.js"
import { PlayerLocal } from './entities/PlayerLocal.js';
import localProxy from "./util/localProxy.js";
import loadingPage from './UiElements/loadingPage.js';
import graphicTierButton from './UiElements/buttons/graphicTierButton.js';
import blocker from './UiElements/blocker.js';
import avatarSelectPanel from './UiElements/avatarSelectPanel.js';

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;
const ULTRA = 3;
const settings = ["Low", "Medium", "High", "Ultra"];

let shadowLight;

const clock = new THREE.Clock();

class VirtualEnvironment {
    constructor() {
        // ===== loading =====
        this.loading();
        
        this.graphicTier = localProxy.tier !== undefined ? localProxy.tier : 0;

        // ===== renderer =====
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // ===== scene =====
        this.scene = new THREE.Scene();
        const scene = this.scene;
        this.scene.background = new THREE.Color(0x69e6f4);
        this.scene.fog = new THREE.Fog(0x69e6f4, 1600, 2000);

        // ===== camera =====
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.y = 1.6;
        this.camera.lookAt(0, 1.7, -1);
        this.dummyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.dummyCamera.position.y = 1.6;
        this.dummyCamera.lookAt(0, 1.7, -1);

        // ===== lights =====
        const light = new THREE.HemisphereLight(0xffeeff, 0x777788, 1);
        light.position.set(0.5, 1, 0.75);
        this.scene.add(light);

        if (this.graphicTier !== LOW) {
            shadowLight = new DefaultDirectionalLight(this.graphicTier);
            this.scene.add(shadowLight);
            this.scene.add(shadowLight.target);
        }

        // ===== shaders =====
        this.composer = new DefaultComposer(this.renderer, this.scene, this.camera);

        // ===== graphic settings =====
        this.setGraphicsSetting(this.graphicTier);
        
        // ===== UI =====
        this.createUiElements();

        // ===== Terrain Controller
        this.terrainController = new TerrainController();

        // ===== setup resize listener ==========
        window.addEventListener('resize', () => onWindowResize(this.camera, this.renderer), false);

        function onWindowResize(camera, renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // ===== setupMultiplayer =====
        this.remoteController = new RemoteController(this.scene);


        // ===== others =====
        this.cameraPosition = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();
        this.fpsControls = new THREE.Vector4(0.01, Math.PI - 0.01, 0.01, 1);
        this.thirdPersonControls = new THREE.Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 40, 0.2);
        this.controlVector = this.thirdPersonControls.clone();
        this.targetControlVector = this.thirdPersonControls;
    } // -- end constructor

    createUiElements() {
        graphicTierButton(this.graphicTier, () => {this.increaseGraphicSettings()});
        blocker(() => {
            this.controls.lock()
            document.getElementById('blocker').style.display = "none";
        });
        avatarSelectPanel();
    }

    loadTerrain(terrainPath, x, y, z, format, scaleFactor = 1){
        this.terrainController.loadTerrain(terrainPath, this.scene, x, y, z, format, scaleFactor);
    }

    generateTerrain(seed) {
        this.terrainController.generateTerrain(this.scene, seed);
    }
    
    spawnPlayer(avatarPath, x, y, z) {
        this.entities = [];
        this.player = new PlayerLocal('../../../glb/animations/animation.glb', avatarPath, this.scene, x, y, z);
        window.player = this.player;
        this.scene.add(this.player);
        
        // ===== controls =====
        this.controls = new PointerLockControls(this.dummyCamera, document.body);
        this.controls.sensitivityY = 0.002;
        this.controls.minPolarAngle = 0.01; 
        this.controls.maxPolarAngle = Math.PI - 0.25;
        this.scene.add(this.controls.getObject());

        document.addEventListener('keydown', (event) => {
            if(this.controls.isLocked) {
                if (event.key === "v") {
                    if (this.targetControlVector === this.thirdPersonControls) {
                        this.targetControlVector = this.fpsControls;
                        this.controls.sensitivityY = -0.002;
                    } else {
                        this.targetControlVector = this.thirdPersonControls;
                        this.controls.sensitivityY = 0.002;
                    }
                }
                this.player.keys[event.key.toLowerCase()] = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            this.player.keys[event.key.toLowerCase()] = false;
        });

        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 32 && e.target === document.body) {
                e.preventDefault();
            }
        });

        this.controls.addEventListener('unlock', () => {
            window.player.keys = {};
            document.getElementById("blocker").style.display = 'block';
        });
    }

    setShadowLightTier(graphicTier) {
        if (shadowLight) {
            this.scene.remove(shadowLight.target);
            this.scene.remove(shadowLight);
            shadowLight.dispose();
            shadowLight.shadow.dispose();
        }

        if (graphicTier !== LOW) {
            shadowLight = new DefaultDirectionalLight(this.graphicTier);
            this.scene.add(shadowLight);
            this.scene.add(shadowLight.target);
        } else {
            shadowLight = undefined;
        }
    }

    setGraphicsSetting(graphicTier) {
        this.graphicTier = graphicTier;
        this.setShadowLightTier(graphicTier);
        this.composer.setGraphicsSetting(graphicTier, this.renderer, this.scene);

        const graphicTierButtonElement = document.getElementById("graphicTierButton");
        if(graphicTierButtonElement !== null) {
            graphicTierButtonElement.innerHTML = "Light: " + settings[graphicTier];
        }
    }

    newSolidGeometriesFromSource(url, x, y, z, scaleFactor){
        this.terrainController.newSolidGeometriesFromSource(this.scene, url, x, y, z, scaleFactor)
    }

    newVideoDisplayPlane(url, width, height, x, y, z, rotationY) {
        const video = document.getElementById( 'video' );
        video.play();

        const texture = new THREE.VideoTexture( video );

        const mesh = new THREE.Mesh( 
            new THREE.PlaneGeometry( width, height ), 
            new THREE.MeshLambertMaterial({ color: 0xffffff, map: texture }) 
        );
        mesh.position.set(x,y,z)
        mesh.rotateY(rotationY)

        this.scene.add( mesh )
    }

    increaseGraphicSettings() {
        this.graphicTier += 1;
        this.graphicTier %= 4;
        localProxy.tier = this.graphicTier;
        this.setGraphicsSetting(this.graphicTier)
    }

    getLocation(){ }

    moveOtherPlayer(x,y,z){ }

    spawnOtherPlayer(avatarPath){ }

    loading() {
        loadingPage(true);
        var intervalId = window.setInterval(function() {
            if (typeof document.getElementsByTagName('body')[0] !== 'undefined') {
                window.clearInterval(intervalId);
                loadingPage(false);
            }
        }, 1000);
    }
    
    update() {
        const delta = Math.min(clock.getDelta(), 0.1);
        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
        if (this.terrainController.collider) {
            
            for (let i = 0; i < 5; i++) {
                this.player.update(delta / 5, this.dummyCamera, this.terrainController.collider, this.entities, frustum, this.dummyCamera, this.controlVector);
                this.camera.position.copy(this.player.position);
                this.entities.forEach(entity => {
                    entity.update(delta / 5, frustum);
                })
            }
            
            this.camera.position.copy(this.player.position);
            const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
            this.camera.position.add(dir.multiplyScalar(this.controlVector.z));
            this.camera.lookAt(this.player.position);
            const invMat = new THREE.Matrix4();
            const raycaster = new THREE.Raycaster(this.player.position.clone(), this.camera.position.clone().sub(this.player.position.clone()).normalize());
            invMat.copy(this.terrainController.collider.matrixWorld).invert();
            raycaster.ray.applyMatrix4(invMat);
            const hit = this.terrainController.collider.geometry.boundsTree.raycastFirst(raycaster.ray);
            if (hit) {
                this.camera.position.copy(this.player.position);
                const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
                this.camera.position.add(dir.multiplyScalar(Math.min(hit.point.distanceTo(this.player.position), this.controlVector.z * 1.25) * 0.8));
                this.camera.lookAt(this.player.position);
            }
            this.cameraPosition.lerp(this.camera.position, this.controlVector.w);
            this.cameraTarget.lerp(this.player.position, this.controlVector.w);
            this.camera.position.copy(this.cameraPosition);
            this.camera.lookAt(this.cameraTarget);
            this.controlVector.lerp(this.targetControlVector, 0.1);
        }

        this.remoteController.update(delta, frustum);



        this.scene.fog.needsUpdate = true;

        if (this.graphicTier !== LOW) {
            shadowLight.update(this.camera);
        }
        this.composer.update(this.camera);
        if (this.graphicTier > LOW) {
            this.renderer.setRenderTarget(this.composer.defaultTexture);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(this.composer.bloomTexture);
            this.renderer.clear();
            this.renderer.render(this.terrainController.bloomScene, this.camera);
        }

        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.composer.render();
    }

}

export { VirtualEnvironment };