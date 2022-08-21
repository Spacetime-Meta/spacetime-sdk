import { Vector3, LoadingManager, Cache, Clock, Matrix4, Raycaster, Mesh, MeshLambertMaterial, PlaneGeometry, VideoTexture } from 'three';

import Stats from './util/Stats.module.js';

import { PlayerLocal } from './entities/PlayerLocal.js';
import { TerrainController } from './terrain/TerrainController.js';
import { RemoteController } from './util/RemoteController.js';
import { UiController } from './UserInterface/UiController.js';
import { DefaultScene } from "./render/DefaultScene.js";
import { DefaultCamera } from "./render/DefaultCamera.js";
import { DefaultRenderer } from "./render/DefaultRenderer.js";
import { CardanoConnector } from "./cardano/CardanoConnector.js";

const clock = new Clock();
const DEFAULT = "default";

export class VirtualEnvironment {
    
    constructor(configPath) {

        // injects this in the window so we can access
        // VIRTUAL_ENVIRONMENT from anywhere in the app
        window.VIRTUAL_ENVIRONMENT = this;
        
        // vars
        this.isConfigCompleted = false;
        this.portalMap = {};
        this.updatableObjects = [];
        
        // this will create the update loop logic
        this.initEnvironment();

        // execute the config if passed as raw object
        if(typeof configPath === "object") {
            this.executeConfig(configPath);
        } else {

            // this will read a config file and customize
            // the environment accordingly
            this.loadConfig(configPath);
        }
        

        // this will allow connection to cardano wallets
        this.cardanoConnector = new CardanoConnector();

    }

    initEnvironment() { 
        // ===== UI =====
        this.UI_CONTROLLER = new UiController();
        
        // ===== renderer, scene, camera =====
        this.renderer = new DefaultRenderer();
        this.MAIN_SCENE = new DefaultScene();
        this.camera = new DefaultCamera();
        
        window.addEventListener('resize', () => onWindowResize(this.camera, this.renderer), false);
        function onWindowResize(camera, renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // enables the THREE.Cache object 
        // https://threejs.org/docs/#api/en/loaders/Cache
        // i have no idea if this actually works
        Cache.enabled = true;
        
        this.loadingManager = new LoadingManager();
        this.terrainController = new TerrainController(this.loadingManager);

        // player local will load the default spacetime avatar
        this.LOCAL_PLAYER = new PlayerLocal();

        // ===== setupMultiplayer =====
        this.remoteController = new RemoteController(this.loadingManager, this.MAIN_SCENE);
    }

    loadConfig(configPath) {
        if(typeof configPath === "undefined") {
            console.warn(`%c [Virtual Environment] No config files specified`);
        } else {
            if(this.lastConfig !== configPath) {
                
                console.log(`%c [Virtual Environment] Loading new config path: ${configPath}`, 'color:#bada55');
                this.lastConfig = configPath

                if(typeof configPath === "string") {
                    fetch(configPath)
                        .then( (response) => { return response.json(); } )
                        .then( (configObject) => { 
                            this.configObject = configObject;
                            this.executeConfig(configObject); 
                        } );
                
                } else {
                    console.error("[Virtual Environment] ConfigPath must be an url to a .json or .glb/.gltf.\nConfig Path: " + configPath);
                }

            } else {
                console.warn("[Virtual Environment] You are trying to load the same config twice.\nConfig Path: " + configPath);
            }
        }
    }

    executeConfig(configObject) {
        const defaultOptions = {
            player: {},
            avatar: {
                default: {
                    name: "vanguard",
                    mesh: 'https://elegant-truffle-070d6b.netlify.app/vanguard.glb',
                    animations: 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb',
                    mapping: { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 },
                    scaleFactor: 0.01,
                    offset: 0.75
                },
                others: [
                    {
                        name: "xBot",
                        mesh: 'https://elegant-truffle-070d6b.netlify.app/xBot.glb',
                        animations: 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb',
                        mapping: { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 },
                        scaleFactor: 0.01,
                        offset: 0.75
                    },
                    {
                        name: "yBot",
                        mesh: 'https://elegant-truffle-070d6b.netlify.app/yBot.glb',
                        animations: 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb',
                        mapping: { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 },
                        scaleFactor: 0.01,
                        offset: 0.75
                    }
                ]
            }
        };

        for (let opt in defaultOptions) {
            configObject[opt] = typeof configObject[opt] === 'undefined' ? defaultOptions[opt] : configObject[opt];
        };

        this.LOCAL_PLAYER.executeConfig(configObject);

        if(configObject.terrain) {
            this.terrainController.executeConfig(configObject.terrain);
        } else {
            console.error('[Virtual Environment] "terrain" is a mandatory parameter, add it to your configuration:\n"terrain": {"url": "<url to your terrain.glb>"}');
        }


        this.UI_CONTROLLER.blockerScreen.menu.menuDisplay.optionsPanel.synchronize();
    }

    toggleStats() {
        if(this.isStatsActive) {
            document.body.removeChild(this.stats.dom);
        } else {

            // in the first time user clicks
            if(typeof this.stats === "undefined") {
                this.stats = Stats()
                this.stats.dom.style.left = "350px"
                this.updatableObjects.push(this.stats)
                
                // init  at false since rest of the method will toggle on
                this.isStatsActive = false;
            }
            document.body.appendChild(this.stats.dom)
        }
        this.isStatsActive = !this.isStatsActive;
    }
    
    update() {
        // calculate time since last frame update
        const delta = Math.min(clock.getDelta(), 0.1);
        
        this.updatableObjects.forEach(object => {
            object.update(delta);
        });
        
        // have the renderer render the scene again
        this.renderer.render(this.MAIN_SCENE, this.camera);
    }

}