import { Vector3, LoadingManager, Cache, Clock, Matrix4, Raycaster, Mesh, MeshLambertMaterial, PlaneGeometry, VideoTexture } from 'three';

import Stats from './util/Stats.module.js';

import { PlayerLocal } from './entities/PlayerLocal.js';
import { TerrainController } from './terrain/TerrainController.js';
import { PeerJsController } from './multiplayer/PeerJsController.js';
import { SocketController } from './multiplayer/SocketController.js';
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
        this.portalMap = {};
        this.updatableObjects = [];
        
        // this will create the update loop logic
        this.initEnvironment();

        // execute the config if passed as raw object
        if(typeof configPath === "object" && configPath !== null) {
            console.log(`%c [Virtual Environment] Executing raw config`, 'color:#bada55');
            this.executeConfig(configPath);
        } else {

            // this will find the corresponding config file and customize
            // the environment accordingly
            this.loadConfig(configPath);
        }
        
        if(process.env.BLOCKFROST_API_KEY) {
            // this will allow connection to cardano wallets
            this.cardanoConnector = new CardanoConnector();
        } else {
            console.log(`%c [Virtual Environment] Blockfrost key not found`, 'color:#bada55');
        }

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
        
    }

    loadConfig(configPath) {
        if(typeof configPath === "undefined") {
            console.log(`%c [Virtual Environment] No config files specified, looking at query params for location`, 'color:#edad00');

            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });

            let location = params.location;
            if(typeof location === "object" && location !== null) {

                this.location = location;
                
                console.log(`%c [Virtual Environment] Reading configuration for chunk: ${location}`, 'color:#bada55');
                
                
            } else {
                console.log(`%c [Virtual Environment] No location found, defaulting to spawn planet`, 'color:#edad00');
                
                this.location = "0,0,0";
                
                fetch("./client/configs/spawnPlanet.json")
                    .then( (response) => { return response.json(); } )
                    .then( (configObject) => { 
                        this.executeConfig(configObject); 
                    } );
            }
            

        } else {
            if(this.lastConfig !== configPath) {
                
                console.log(`%c [Virtual Environment] Loading new config path: ${configPath}`, 'color:#bada55');
                this.lastConfig = configPath

                if(typeof configPath === "string") {
                    fetch(configPath)
                        .then( (response) => { return response.json(); } )
                        .then( (configObject) => { 
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

        if(typeof configObject.socket !== "undefined") {
            if(typeof this.socketController === "undefined") {
                this.socketController = new SocketController();
            } else {
                // execute config
            }
            
        } else {

            // if a socket controller already exist we must disconnect
            // and destroy the controller
            if(this.socketController) {
                this.socketController.socket.disconnect();
                delete this.socketController;
            }
        }

        this.UI_CONTROLLER.blockerScreen.menu.menuDisplay.optionsPanel.synchronize();
    }

    activatePeerToPeer() {
        // ===== setup peer to peer Multiplayer =====
        this.peerJsController = new PeerJsController();
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