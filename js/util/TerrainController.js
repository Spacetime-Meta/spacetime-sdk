import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from './util/three-mesh-bvh.js';
class TerrainController {
    
    constructor(){
        this.loader = new GLTFLoader();
        this.terrain;
        this.collider;
    }

    loadTerrain(URL, scene, x, y, z){
        this.loader.load(URL, (Object) => {
            this.terrain = Object.scene;
            object.scene.position.set(x, y, z);
            scene.add(object.scene);
        })
    }

    generateCollider(scene){

    }

}