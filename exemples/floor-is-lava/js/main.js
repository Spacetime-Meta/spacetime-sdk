import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { StdEnv } from '../../../js/StdEnv.js';

const VE = new StdEnv();
init();

function init() {
    // ===== Virtual Env =====
    VE.init();
    VE.spawnPlayer('glb/vanguard.glb')

    const loader = new GLTFLoader();
    loader.load('glb/rock_platform.glb', (platform) => {
        setTimeout(() => {

            const factor = 16;

            console.log("load new stuff")
            platform.scene.scale.set(3.75 * factor, 3.75 * factor, 3.75 * factor)
            platform.scene.position.set(0,0,-30)
            VE.scene.add(platform.scene)

            let newGeometries = [];
            platform.scene.traverse((object) => {
                if(object.geometry && object.visible && object.position) {
                    const cloned = object.geometry.clone();
                    cloned.scale(3.75 * factor, 3.75 * factor, 3.75 * factor)
                    cloned.translate(0,-1 * factor,-30)
                    console.log(object.matrixWorld)
                    object.updateMatrixWorld();
                    cloned.applyMatrix4(object.matrixWorld);
                    for (const key in cloned.attributes) {
                        if (key !== 'position') { cloned.deleteAttribute(key); }
                    }
                    
                    newGeometries.push(cloned);
                }
            })

            VE.terrainController.generateCollider(VE.scene, newGeometries)
        }, 2000);
        
    })

}

if (!window.requestPostAnimationFrame) {
    window.requestPostAnimationFrame = function(task) {
        requestAnimationFrame(() => {
            setTimeout(task, 0);
        });
    }
}

function animate() {
    requestPostAnimationFrame(animate);

    VE.update();
}
requestPostAnimationFrame(animate);