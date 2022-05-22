import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../fbx/terrains/classroom.fbx', 0, 0, 0, "fbx", 0.2)
    virtualEnvironment.spawnPlayer('../../../glb/avatars/yBot.glb', 0, 70, 0)


    setTimeout(() => {
        const video = document.getElementById( 'video' );
        video.play();

        const texture = new THREE.VideoTexture( video );
        const parameters = { color: 0xffffff, map: texture };

        const geometry = new THREE.PlaneGeometry( 200, 100 );

        const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( parameters ) );
        mesh.position.set(72,90,95)
        mesh.rotateY(- Math.PI / 2)

        virtualEnvironment.scene.add( mesh )
    }, 2000)

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