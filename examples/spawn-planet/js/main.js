import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../resources/terrains/spawnPlanet.glb', 0, -20, 0, "glb")
    virtualEnvironment.spawnPlayer('../../../resources/avatars/yBot.glb', '../../../resources/animations/animation.glb', 0, 50, 0)
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}