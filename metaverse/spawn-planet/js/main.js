import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../resources/terrains/spawnPlanet.glb', 0, 0, 0, "glb", 0.05)
    virtualEnvironment.spawnPlayer({spawn: { x:0, y:5, z:0}})
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}