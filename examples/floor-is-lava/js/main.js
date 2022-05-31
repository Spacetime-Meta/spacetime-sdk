import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.spawnPlayer({spawn: { x:0, y:50, z:0}})
    
    setTimeout(() => {
        virtualEnvironment.newSolidGeometriesFromSource('../../../resources/objects/rock_platform.glb', 0, 20, 1000, 16);
        virtualEnvironment.newSolidGeometriesFromSource('../../../resources/objects/rock_platform.glb', 0, -20, -30, 16);

        for(let i=0; i<35; i++) {
            let position = new THREE.Vector3(Math.random() * 800 - 400, 0, Math.random() * 1000);
            virtualEnvironment.newSolidGeometriesFromSource('../../../resources/objects/rock_platform.glb', position.x, position.y, position.z, Math.random() * 20 + 4);
        }

        virtualEnvironment.terrainController.generateCollider(virtualEnvironment.scene);
    }, 100);
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}