import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from './three-mesh-bvh.js';

class TerrainController {
    
    constructor(){
        this.loader = new GLTFLoader();
        this.terrain = new THREE.Object3D();
        this.collider;
        this.bloomScene = new THREE.Scene();
    }

    loadTerrain(URL, scene, x, y, z){
        this.loader.load(URL, (object) => {
            this.terrain = object.scene;
            this.terrain.position.set(x, y, z);
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
                    //object.updateMatrixWorld();
                    if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                        /* object.updateMatrixWorld();
                            cloned.matrix.copy(object.matrixWorld);*/
                        this.bloomScene.attach(cloned);
                    }
                }
                if (object.isLight) {
                    object.parent.remove(object);
                }
            });

            scene.add(this.terrain);
            this.generateCollider(scene);
        })
    }

    generateCollider(scene, geometries = []){
        console.log("loading collider")
        this.terrain.traverse(object => {
            if (object.geometry && object.visible) {
                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { cloned.deleteAttribute(key); }
                }
                geometries.push(cloned);
            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new THREE.Mesh(mergedGeometry);
        this.collider.material.wireframe = true;
        this.collider.material.opacity = 0.5;
        this.collider.material.transparent = true;
        this.collider.visible = true;
        scene.add(this.collider);

        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // scene.add(visualizer);
    }
}

export { TerrainController };