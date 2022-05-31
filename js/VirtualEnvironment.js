import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { TerrainController } from './util/TerrainController.js';
import { RemoteController } from './util/RemoteController.js';

import { DefaultDirectionalLight } from "./render/DefaultDirectionalLight.js"
import { DefaultComposer } from "./render/DefaultComposer.js"
import { PlayerLocal } from './entities/PlayerLocal.js';
import localProxy from "./util/localProxy.js";
import {loadingBar, loadingPage} from './UiElements/loadingPage.js';
// import graphicTierButton from './UiElements/buttons/graphicTierButton.js';
import blocker from './UiElements/blocker.js';
import avatarSelectPanel from './UiElements/avatarSelectPanel.js';
import controlInstructions from './UiElements/controlInstructions.js';

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;
const ULTRA = 3;
const settings = ["Low", "Medium", "High", "Ultra"];
const DEFAULT = "default";

let shadowLight;

const clock = new THREE.Clock();

class VirtualEnvironment {
    constructor() {
        // ===== loading =====
        this.loading();
        
        // until complete removal of the graphic tier setting, keep this section commented
        this.graphicTier = 2; //localProxy.tier !== undefined ? localProxy.tier : 0;

        // ===== renderer =====
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // ===== scene =====
        window.mainScene = new THREE.Scene();
        mainScene.background = new THREE.Color(0x69e6f4);
        mainScene.fog = new THREE.Fog(0x69e6f4, 1600, 2000);

        // ===== camera =====
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.y = 1.6;
        this.camera.lookAt(0, 1.7, -1);
        this.dummyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.dummyCamera.position.y = 1.6;
        this.dummyCamera.lookAt(0, 1.7, -1);
        this.cameraPosition = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();

        // ===== lights =====
        const light = new THREE.HemisphereLight(0xffeeff, 0x777788, 1);
        light.position.set(0.5, 1, 0.75);
        mainScene.add(light);

        if (this.graphicTier !== LOW) {
            shadowLight = new DefaultDirectionalLight(this.graphicTier);
            mainScene.add(shadowLight);
            mainScene.add(shadowLight.target);
        }

        // ===== shaders =====
        this.composer = new DefaultComposer(this.renderer, mainScene, this.camera);

        // ===== graphic settings =====
        this.setGraphicsSetting(this.graphicTier);
        
        // ===== UI =====
        this.createUiElements();

        // ===== Terrain Controller
        this.terrainController = new TerrainController(this.loadingManager);

        // ===== setup resize listener ==========
        window.addEventListener('resize', () => onWindowResize(this.camera, this.renderer), false);

        function onWindowResize(camera, renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // ===== setupMultiplayer =====
        this.remoteController = new RemoteController(this.loadingManager, mainScene);

    } // -- end constructor

    createUiElements() {
        blocker();
        controlInstructions();
    }

    loadTerrain(terrainPath, x, y, z, format, scaleFactor = 1){
        this.terrainController.loadTerrain(terrainPath, mainScene, x, y, z, format, scaleFactor);
    }

    generateTerrain(seed) {
        this.terrainController.generateTerrain(mainScene, seed);
    }
    
    spawnPlayer(params) {
        window.player = new PlayerLocal(params, this.dummyCamera, this.loadingManager);
        mainScene.add(player);
    }

    setShadowLightTier(graphicTier) {
        if (shadowLight) {
            mainScene.remove(shadowLight.target);
            mainScene.remove(shadowLight);
            shadowLight.dispose();
            shadowLight.shadow.dispose();
        }

        if (graphicTier !== LOW) {
            shadowLight = new DefaultDirectionalLight(this.graphicTier);
            mainScene.add(shadowLight);
            mainScene.add(shadowLight.target);
        } else {
            shadowLight = undefined;
        }
    }

    setGraphicsSetting(graphicTier) {
        this.graphicTier = graphicTier;
        this.setShadowLightTier(graphicTier);
        this.composer.setGraphicsSetting(graphicTier, this.renderer, mainScene);

        const graphicTierButtonElement = document.getElementById("graphicTierButton");
        if(graphicTierButtonElement !== null) {
            graphicTierButtonElement.innerHTML = "Light: " + settings[graphicTier];
        }
    }

    newSolidGeometriesFromSource(url, x, y, z, scaleFactor){
        this.terrainController.newSolidGeometriesFromSource(mainScene, url, x, y, z, scaleFactor)
    }

    newVideoDisplayPlane(url, width, height, x, y, z, rotationY) {
        const video = document.createElement('video');
        video.id = url; // give unique id to support multiple players
        video.loop = true;
        video.crossOrigin = "anonymous";
        video.playsinline = true;
        video.style.display = "none";

        const source =  document.createElement('source')
        source.src = url;
        source.type = 'video/mp4';

        video.appendChild(source);
        document.body.appendChild(video)

        document.onkeydown = function(e) {
            if (e.keyCode == 80 && !this.videoHasPlayed) {
                //p - play 
                video.play();
                this.videoHasPlayed = true;
            } else if (e.keyCode == 80 && this.videoHasPlayed) {
                //p - pause
                this.videoHasPlayed = false;
                video.pause();
            } else if (e.keyCode == 82) {
                //r - rewind video
                video.currentTime(0);
            }

        }

        const mesh = new THREE.Mesh( 
            new THREE.PlaneGeometry( width, height ), 
            new THREE.MeshLambertMaterial({ 
                color: 0xffffff, 
                map: new THREE.VideoTexture( video ) 
            }) 
        );
        mesh.position.set(x,y,z)
        mesh.rotateY(rotationY)

        mainScene.add( mesh )
    }

    increaseGraphicSettings() {
        this.graphicTier += 1;
        this.graphicTier %= 4;
        localProxy.tier = this.graphicTier;
        this.setGraphicsSetting(this.graphicTier)
    }

    loading() {
        // ===== loading manager =====
        this.loadingManager = new THREE.LoadingManager();

        loadingPage();
        loadingBar(this.loadingManager);
    }
    
    update() {
        const delta = Math.min(clock.getDelta(), 0.1);
        if (this.terrainController.collider) {
            
            player.update(delta, this.terrainController.collider);
            this.camera.position.copy(player.position);
            
            this.camera.position.copy(player.position);
            const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
            this.camera.position.add(dir.multiplyScalar(player.controlVector.z));
            this.camera.lookAt(player.position);
            const invMat = new THREE.Matrix4();
            const raycaster = new THREE.Raycaster(player.position.clone(), this.camera.position.clone().sub(player.position.clone()).normalize());
            invMat.copy(this.terrainController.collider.matrixWorld).invert();
            raycaster.ray.applyMatrix4(invMat);
            const hit = this.terrainController.collider.geometry.boundsTree.raycastFirst(raycaster.ray);
            if (hit) {
                this.camera.position.copy(player.position);
                const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
                this.camera.position.add(dir.multiplyScalar(Math.min(hit.point.distanceTo(player.position), player.controlVector.z * 1.25) * 0.8));
                this.camera.lookAt(player.position);
            }
            this.cameraPosition.lerp(this.camera.position, player.controlVector.w);
            this.cameraTarget.lerp(player.position, player.controlVector.w);
            this.camera.position.copy(this.cameraPosition);
            this.camera.lookAt(this.cameraTarget);
            
        }

        this.remoteController.update(delta);

        mainScene.fog.needsUpdate = true;

        if (this.graphicTier !== LOW) {
            shadowLight.update(this.camera);
        }
        this.composer.update(this.camera);
        if (this.graphicTier > LOW) {
            this.renderer.setRenderTarget(this.composer.defaultTexture);
            this.renderer.clear();
            this.renderer.render(mainScene, this.camera);
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