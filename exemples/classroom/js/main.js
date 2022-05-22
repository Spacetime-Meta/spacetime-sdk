import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../fbx/terrains/classroom.fbx', 0, 0, 0, "fbx", 0.2);
    virtualEnvironment.spawnPlayer('../../../glb/avatars/yBot.glb', 0, 70, 0);
    
    setTimeout(() => {
        virtualEnvironment.newVideoDisplayPlane('../textures/whitepaper.mp4', 200, 100, 72, 90, 95, - Math.PI / 2);
    }, 100)
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