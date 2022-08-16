import { Object3D, Scene, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from '../util/three-mesh-bvh.js';
import { TerrainGenerator } from './TerrainGenerator.js';
import { SquareWalkOnTrigger } from '../entities/interactives/SquareWalkOnTrigger.js';

export class TerrainController {
    
    constructor(manager){

        // loaders
        this.FBXLoader = new FBXLoader(manager);
        this.GLTFLoader = new GLTFLoader(manager);
        
        
        this.terrain = new Object3D();
        this.collider;
        this.geometries = [];
        this.interactives = [];

        // this is an updatable object
        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
        
    }

    generateTerrain(seed) {
        this.terrainGenerator = new TerrainGenerator(seed);
        this.terrain = this.terrainGenerator.generateTerrain();
    }

    loadTerrain(terrainConfig) {
        switch (terrainConfig.format) {

            // FBX loader is broken use only glb/gltf until fixed
            case ".fbx":
                this.FBXLoader.load(terrainConfig.url, (responseObject) => {
                    this.handleLoadedTerrain(responseObject.scene, terrainConfig);
                })
                break;
        
            case ".glb":
                this.GLTFLoader.load(terrainConfig.url, (responseObject) => {
                    this.handleLoadedTerrain(responseObject.scene, terrainConfig);
                })
                break;
        };
    }

    executeConfig(terrainConfig) {
        if(typeof terrainConfig.url !== "undefined") {
            
            const defaultOptions = {
                position: new Vector3(),
                scaleFactor: 1,
                format: terrainConfig.url.substring(terrainConfig.url.lastIndexOf('.')),
                portalMap: {}
            };

            for (let opt in defaultOptions) {
                terrainConfig[opt] = typeof terrainConfig[opt] === 'undefined' ? defaultOptions[opt] : terrainConfig[opt];
            };

            this.terrainConfig = terrainConfig;

            // delete the original terrain
            this.geometries = [];
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.terrain);
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.collider);
            
            // deactivate te interactives
            this.interactives.forEach(interactive => {
                interactive.removeDebugger();
            })
            this.interactives = [];
            
            this.loadTerrain(terrainConfig);

        } else {
            console.error("[Terrain Controller] Must Provide Url in config.terrain");
        };


        
    }

    buildInteractives() {
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.children.forEach(child => {
            if(child.name === "Scene") {
                child.children.forEach(mesh => {
                    if(mesh.name.substring(0,5) === "_stm_") {
                        const type = mesh.name.substring(5).substring(0,mesh.name.substring(5).indexOf('_'));

                        switch (type) {
                            
                            case "launchpad": {
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.velocity.y = 50;
                                }) );
                            } break;

                            case "spawnPoint": {
                                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.spawnPoint = mesh.position;
                                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.copy(mesh.position);
                            } break;

                            case "startTime": {
                                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.setupTimer();
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.playScreen.timerBox.startTimer();
                                }) );
                            } break;

                            case "stopTime": {
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.playScreen.timerBox.stopTimer()
                                }) );
                            } break;

                            case "portal": {
                                const id = mesh.name.substring(12, 12 + mesh.name.substring(12).indexOf('_'))
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    if(typeof this.terrainConfig.portalMap[id] !== "undefined") {
                                        VIRTUAL_ENVIRONMENT.loadConfig(this.terrainConfig.portalMap[id]);
                                    }
                                }) );
                            } break;
                        }
                    }
                })
            }
        })
    }

    toggleInteractiveDebugBox() {
        this.interactives.forEach(interactive => {
            interactive.toggleDebugBox();
        })
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

        this.MAIN_SCENE.add( mesh )
    }

    handleLoadedTerrain(terrain, terrainConfig) {
        this.terrain = terrain;

        //apply configs
        this.terrain.position.copy(terrainConfig.position);
        this.terrain.scale.set(terrainConfig.scaleFactor, terrainConfig.scaleFactor, terrainConfig.scaleFactor);
        
        this.terrain.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;

                //apply wold position from geometry 
                const cloned = new Mesh(object.geometry, object.material);
                object.getWorldPosition(cloned.position);
            }
            if (object.isLight) {
                object.parent.remove(object);
            }
        });

        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.terrain);
        this.generateCollider();
        this.buildInteractives();
    }

    generateCollider(){
        this.terrain.traverse(object => {
            if (object.geometry && object.visible) {
                if(object.name !== "_stm_water_") {
                    const cloned = object.geometry.clone();
                    cloned.applyMatrix4(object.matrixWorld);
                    for (const key in cloned.attributes) {
                        if (key !== 'position') { 
                            cloned.deleteAttribute(key);
                        }
                    }
                    this.geometries.push(cloned);
                }
            }
        });


        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new Mesh(mergedGeometry);
        this.collider.bvh = mergedGeometry.boundsTree;

        this.collider.material.wireframe = true;
        this.collider.visible = VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.optionsPanel.toggleCollider.isActive;
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.collider);

        /* The following lines of code are used to debug the BVH collider. 
         * Uncomment these lines to visualize the BVH collider. 
         * More information on Bounding Volume Hierarchy (BVH):
         * https://en.wikipedia.org/wiki/Bounding_volume_hierarchy
        */
       
        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(visualizer);
    }

    toggleViewCollider() {
        this.collider.visible = !this.collider.visible;
    }

    newSolidGeometriesFromSource(url, x, y, z, scaleFactor) {
        this.GLTFLoader.load(url, (responseObject) => {
            setTimeout(() => {   
                responseObject.scene.scale.set(scaleFactor, scaleFactor, scaleFactor)
                responseObject.scene.position.set(x,y,z)
                VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(responseObject.scene)
    
                responseObject.scene.traverse((object) => {
                    if(object.geometry && object.visible && object.position) {
                        const cloned = object.geometry.clone();
                        cloned.scale(scaleFactor, scaleFactor, scaleFactor)
                        cloned.translate(x, y ,z)
                        object.updateMatrixWorld();
                        cloned.applyMatrix4(object.matrixWorld);
                        for (const key in cloned.attributes) {
                            if (key !== 'position') { cloned.deleteAttribute(key); }
                        }
                        
                        this.geometries.push(cloned);
                    }
                })
                
                this.generateCollider(VIRTUAL_ENVIRONMENT.MAIN_SCENE)
            }, 2000);
        })
    }

    update(delta) {
        this.interactives.forEach(interactive => {
            interactive.update();
        })
    }
}