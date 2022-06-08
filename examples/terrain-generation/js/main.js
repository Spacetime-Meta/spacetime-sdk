import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// then fill your world with the stuff you want
init();
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    let seed = parseInt(urlParams.get("x")) + parseInt(urlParams.get("y")) + parseInt(urlParams.get("z"))
    console.log(seed)
    if(typeof seed === "NaN"){ seed = 100 }
    virtualEnvironment.generateTerrain(seed);
    virtualEnvironment.spawnPlayer({spawn: { x:0, y:520, z:0}})
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}