import { WebGLRenderer, VSMShadowMap, Vector3, LoadingManager, Clock, Matrix4, Raycaster, Mesh, MeshLambertMaterial, PlaneGeometry, VideoTexture } from 'three';

import Stats from './util/Stats.module.js'

import { PlayerLocal } from './entities/PlayerLocal.js';
import { TerrainController } from './terrain/TerrainController.js';
import { RemoteController } from './util/RemoteController.js';
import { UiController } from './UserInterface/UiController.js';
import { DefaultScene } from "./render/DefaultScene.js"
import { DefaultCamera } from "./render/DefaultCamera.js"

import {loadingBar, loadingPage} from './UserInterface/UiElements/LoadingPage/loadingPage.js';

const clock = new Clock();

export class VirtualEnvironment {
    constructor() {
        // set the page css
        document.body.style.margin = "0";
        document.body.style.fontFamily = "Space Mono, monospace";
        
        // vars
        this.isStatsActive = false;
        this.portalMap = {};

        // ===== loading =====
        this.loading();

        // ==== stats ===== 
        this.stats = Stats()
        this.stats.dom.style.left = "350px"
        
        // ===== renderer =====
        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = VSMShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // ===== scene =====
        window.MAIN_SCENE = new DefaultScene();

        // ===== camera =====
        this.camera = new DefaultCamera();

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

        // inject this in the window
        window.VIRTUAL_ENVIRONMENT = this;

    } // -- end constructor

    loadTerrain(terrainPath, x, y, z, format, scaleFactor = 1){
        this.terrainController.loadTerrain(terrainPath, MAIN_SCENE, x, y, z, format, scaleFactor);
    }

    generateTerrain(seed) {
        this.terrainController.generateTerrain(seed);
    }
    
    spawnPlayer(params) {
        window.LOCAL_PLAYER = new PlayerLocal(params, this.camera.controlObject, this.loadingManager);
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

        const mesh = new Mesh( 
            new PlaneGeometry( width, height ), 
            new MeshLambertMaterial({ 
                color: 0xffffff, 
                map: new VideoTexture( video ) 
            }) 
        );
        mesh.position.set(x,y,z)
        mesh.rotateY(rotationY)

        MAIN_SCENE.add( mesh )
    }

    loading() {
        // ===== loading manager =====
        this.loadingManager = new LoadingManager();

        loadingPage();
        loadingBar(this.loadingManager);
    }

    toggleStats() {
        if(this.isStatsActive) {
            document.body.removeChild(this.stats.dom);
        } else {
            document.body.appendChild(this.stats.dom)
        }
        this.isStatsActive = !this.isStatsActive;
    }
    
    update() {

        // calculate time since last frame update
        const delta = Math.min(clock.getDelta(), 0.1);

        // update the stats
        this.stats.update();

        MAIN_SCENE.update();

        if (this.terrainController.collider) {
            LOCAL_PLAYER.update(delta, this.terrainController.collider);
            this.camera.update();
        }

        this.remoteController.update(delta);
        this.renderer.render(MAIN_SCENE, this.camera);

        this.UI_CONTROLLER.update();
    }

}