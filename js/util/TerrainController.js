import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FBXLoader.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from './three-mesh-bvh.js';
import { TerrainGenerator } from './TerrainGenerator.js';

class TerrainController {
    
    constructor(manager){
        this.FBXLoader = new FBXLoader(manager);
        this.GLTFLoader = new GLTFLoader(manager);
        this.terrain = new THREE.Object3D();
        this.collider;
        this.bloomScene = new THREE.Scene();
        this.geometries = [];
        this.terrainGenerator = new TerrainGenerator();
    }

    generateTerrain(scene, seed) {
        this.terrain = this.terrainGenerator.generateTerrain(scene, seed, this)
    }

    loadTerrain(URL, scene, x, y, z, format, scaleFactor){
        switch (format) {
            case "fbx":
                this.FBXLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject, scene, x, y, z, scaleFactor);
                })
                break;
        
            case "glb":
                this.GLTFLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject.scene, scene, x, y, z, scaleFactor);
                })
                break;
        }
    }

    handleLoadedTerrain(terrain, scene, x, y, z, scaleFactor) {
        console.log(terrain)
        this.terrain = terrain;
        this.terrain.position.set(x, y, z);
        this.terrain.scale.set(scaleFactor, scaleFactor, scaleFactor)
        this.terrain.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.roughness = 1;
                if (object.material.map) {
                    object.material.map.anisotropy = 16;
                    object.material.map.needsUpdate = true;
                }
                const cloned = new THREE.Mesh(object.geometry, object.material);
                object.getWorldPosition(cloned.position);
                if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                    this.bloomScene.attach(cloned);
                }
            }
            if (object.isLight) {
                object.parent.remove(object);
            }
        });

        scene.add(this.terrain);
        this.generateCollider(scene);
    }

    generateCollider(scene){
        console.log("loading collider")
        this.terrain.traverse(object => {
            if (object.geometry && object.visible) {
                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { cloned.deleteAttribute(key); }
                }
                this.geometries.push(cloned);
            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new THREE.Mesh(mergedGeometry);
        this.collider.material.wireframe = true;
        this.collider.material.opacity = 0.5;
        this.collider.material.transparent = true;
        this.collider.visible = false; // toggle this value to see the collider
        scene.add(this.collider);

        /* The following lines of code are used to debug the BVH collider. 
         * Uncomment these lines to visualize the BVH collider. 
         * More information on Bounding Volume Hierarchy (BVH):
         * https://en.wikipedia.org/wiki/Bounding_volume_hierarchy
        */
       
        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // scene.add(visualizer);
    }

    newSolidGeometriesFromSource(scene, url, x, y, z, scaleFactor) {
        this.GLTFLoader.load(url, (responseObject) => {
            setTimeout(() => {   
                console.log("load new stuff")
                responseObject.scene.scale.set(3.75 * scaleFactor, 3.75 * scaleFactor, 3.75 * scaleFactor)
                responseObject.scene.position.set(x,y,z)
                scene.add(responseObject.scene)
    
                responseObject.scene.traverse((object) => {
                    if(object.geometry && object.visible && object.position) {
                        const cloned = object.geometry.clone();
                        cloned.scale(3.75 * scaleFactor, 3.75 * scaleFactor, 3.75 * scaleFactor)
                        cloned.translate(x, y + (-1 * scaleFactor),z)
                        console.log(object.matrixWorld)
                        object.updateMatrixWorld();
                        cloned.applyMatrix4(object.matrixWorld);
                        for (const key in cloned.attributes) {
                            if (key !== 'position') { cloned.deleteAttribute(key); }
                        }
                        
                        this.geometries.push(cloned);
                    }
                })
                
                this.generateCollider(scene)
            }, 2000);
            
        })
    }
}

export { TerrainController };