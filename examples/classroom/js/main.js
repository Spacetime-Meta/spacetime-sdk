import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../resources/terrains/classroom.fbx', 0, 0, 0, "fbx", 0.2);
    virtualEnvironment.spawnPlayer({
        avatarPath: '../../../resources/avatars/megan.glb',
        animationPath: '../../../resources/animations/megan@animation.glb',
        animationMapping: {
            walk: 1,
            idle: 2,
            run: 3,
            jump: 4,
            fall: 5
        },
        spawn: {x: 0, y: 70, z: 0}
    });
    
    setTimeout(() => {
        virtualEnvironment.newVideoDisplayPlane('../classroom/textures/mapFirstDemo.mp4', 200, 100, 72, 90, 95, - Math.PI / 2);
    }, 100)
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}