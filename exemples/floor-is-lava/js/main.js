import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { StdEnv } from '../../../js/StdEnv.js';

// start by creating a basic virtual environment
let virtualEnvironment = new StdEnv();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.spawnPlayer('../../../glb/avatars/vanguard.glb')
    
    setTimeout(() => {
        virtualEnvironment.newSolidGeometriesFromSource('../../../glb/objects/rock_platform.glb', 0, 20, 1000, 16);
        virtualEnvironment.newSolidGeometriesFromSource('../../../glb/objects/rock_platform.glb', 0, -20, -30, 16);

        for(let i=0; i<35; i++) {
            let position = new THREE.Vector3(Math.random() * 800 - 400, 0, Math.random() * 1000);
            virtualEnvironment.newSolidGeometriesFromSource('../../../glb/objects/rock_platform.glb', position.x, position.y, position.z, Math.random() * 20 + 4);
        }

        virtualEnvironment.terrainController.generateCollider(virtualEnvironment.scene);
    }, 100);
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

    virtualEnvironment.update();
}
requestPostAnimationFrame(animate);