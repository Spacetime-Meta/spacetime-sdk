import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';
import { UiElement } from '../../../js/UserInterface/UiElements/UiElement.js';

import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

let isWon = false;
let startTime, elapsed, timer;

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../resources/terrains/parkour1.glb', 0, 0, 0, "glb", 0.5)
    virtualEnvironment.spawnPlayer({spawn: {x: 0, y: 10, z: 0}});
    
    document.addEventListener("keydown", event => {
        if(event.key === "r") {
            startTime = Date.now()
            isWon = false;
        }
    })

    startTime = Date.now()
    timer = new UiElement({
        innerHTML: "00000000",
        style: {
            position: "absolute",
            bottom: "0",
            right: "0",
            color: "white",
            fontWeight: "bold",
            fontSize: "25px"
        }
    })

    document.body.appendChild(timer.element)
}

// then start the animation
animate();
function animate() {

    if(!isWon) {
        elapsed = Date.now() - startTime;
        timer.element.innerHTML = `time: ${(elapsed / 1000).toFixed(2)}s`
    }

    // console.log(LOCAL_PLAYER.position)

    if(LOCAL_PLAYER.position.y > 1400) {
        if( LOCAL_PLAYER.position.x < -290 && LOCAL_PLAYER.position.x > -510 &&
            LOCAL_PLAYER.position.z < 780 && LOCAL_PLAYER.position.z > 560) {
            
                if(!isWon) {
                    isWon = true;
                } 
            
        }
    }

    virtualEnvironment.update();
    requestAnimationFrame(animate);
}
