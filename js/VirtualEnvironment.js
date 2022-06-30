import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

import Stats from './util/Stats.module.js'

import { PlayerLocal } from './entities/PlayerLocal.js';

import { TerrainController } from './terrain/TerrainController.js';
import { RemoteController } from './util/RemoteController.js';
import { UiController } from './UserInterface/UiController.js';

import { DefaultDirectionalLight } from "./render/DefaultDirectionalLight.js"

import localProxy from "./util/localProxy.js";
import {loadingBar, loadingPage} from './UserInterface/UiElements/LoadingPage/loadingPage.js';

const clock = new THREE.Clock();

class VirtualEnvironment {
    constructor() {
        // ===== loading =====
        this.loading();

        /**
         * Uncomment the following lines to activate the stats panel
         */
        this.stats = Stats()
        this.stats.dom.style.left = "350px"
        document.body.appendChild(this.stats.dom)
        
        // ===== renderer =====
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // ===== scene =====
        window.MAIN_SCENE = new THREE.Scene();
        MAIN_SCENE.background = new THREE.Color(0x69e6f4);
        MAIN_SCENE.fog = new THREE.Fog( new THREE.Color(0.8, 0.8, 0.8), 10, 150 );

        // ===== camera =====
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

        this.dummyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
        this.cameraPosition = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();

        // ===== lights =====
        const light = new THREE.HemisphereLight(0xffeeff, 0x777788, 1);
        MAIN_SCENE.add(light);

        this.shadowLight = new DefaultDirectionalLight();
        MAIN_SCENE.add(this.shadowLight);
        MAIN_SCENE.add(this.shadowLight.target);

        // ===== UI =====
        this.UI_CONTROLLER = new UiController();

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
        this.remoteController = new RemoteController(this.loadingManager, MAIN_SCENE);

        // inject this n the window
        window.VIRTUAL_ENVIRONMENT = this;

    } // -- end constructor

    loadTerrain(terrainPath, x, y, z, format, scaleFactor = 1){
        this.terrainController.loadTerrain(terrainPath, MAIN_SCENE, x, y, z, format, scaleFactor);
    }

    generateTerrain(seed) {
        this.terrainController.generateTerrain(seed);
    }
    
    spawnPlayer(params) {
        window.LOCAL_PLAYER = new PlayerLocal(params, this.dummyCamera, this.loadingManager);
        MAIN_SCENE.add(LOCAL_PLAYER);
    }

    newSolidGeometriesFromSource(url, x, y, z, scaleFactor){
        this.terrainController.newSolidGeometriesFromSource(MAIN_SCENE, url, x, y, z, scaleFactor)
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

        MAIN_SCENE.add( mesh )
    }

    loading() {
        // ===== loading manager =====
        this.loadingManager = new THREE.LoadingManager();

        loadingPage();
        loadingBar(this.loadingManager);
    }
    
    update() {

        // update the stats
        this.stats.update();

        const delta = Math.min(clock.getDelta(), 0.1);
        if (this.terrainController.collider) {
            
            LOCAL_PLAYER.update(delta, this.terrainController.collider);
            this.camera.position.copy(LOCAL_PLAYER.position);
            
            this.camera.position.copy(LOCAL_PLAYER.position);
            const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
            this.camera.position.add(dir.multiplyScalar(LOCAL_PLAYER.controlVector.z));
            this.camera.lookAt(LOCAL_PLAYER.position);
            const invMat = new THREE.Matrix4();
            const raycaster = new THREE.Raycaster(LOCAL_PLAYER.position.clone(), this.camera.position.clone().sub(LOCAL_PLAYER.position.clone()).normalize());
            invMat.copy(this.terrainController.collider.matrixWorld).invert();
            raycaster.ray.applyMatrix4(invMat);
            const hit = this.terrainController.collider.geometry.boundsTree.raycastFirst(raycaster.ray);
            if (hit) {
                this.camera.position.copy(LOCAL_PLAYER.position);
                const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
                this.camera.position.add(dir.multiplyScalar(Math.min(hit.point.distanceTo(LOCAL_PLAYER.position), LOCAL_PLAYER.controlVector.z * 1.25) * 0.8));
                this.camera.lookAt(LOCAL_PLAYER.position);
            }
            this.cameraPosition.lerp(this.camera.position, LOCAL_PLAYER.controlVector.w);
            this.cameraTarget.lerp(LOCAL_PLAYER.position, LOCAL_PLAYER.controlVector.w);
            this.camera.position.copy(this.cameraPosition);
            this.camera.lookAt(this.cameraTarget);
            
        }

        this.remoteController.update(delta);
        this.shadowLight.update();
        this.renderer.render(MAIN_SCENE, this.camera);

        this.UI_CONTROLLER.update();
    }

}

export { VirtualEnvironment };