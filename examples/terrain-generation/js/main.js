import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.generateTerrain(Math.random())
    virtualEnvironment.spawnPlayer('../../../resources/avatars/yBot.glb', '../../../resources/animations/animation.glb', 0, 1000, 0)
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}