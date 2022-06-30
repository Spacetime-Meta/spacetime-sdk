import { DirectionalLight, CameraHelper, Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

const OFFSET = new Vector3(-30, 100, -100)

class DefaultDirectionalLight extends DirectionalLight {
    constructor() {
        super(0x8888ff, 1);

        this.castShadow = true;
        this.shadow.camera.near = 0.1;
        this.shadow.camera.far = 200;
        this.shadow.camera.right = 50;
        this.shadow.camera.left = -50;
        this.shadow.camera.top = 50;
        this.shadow.camera.bottom = -50;

        this.shadow.mapSize.width = 1024;
        this.shadow.mapSize.height = 1024;
        this.shadow.bias = -0.001;

        // use this to visualize the shadow camera
        // const helper = new CameraHelper(this.shadow.camera)
        // MAIN_SCENE.add(helper)
    }
    update() {
        this.position.addVectors(LOCAL_PLAYER.position, OFFSET);
        this.target.position.copy(LOCAL_PLAYER.position);
    }
}

export { DefaultDirectionalLight };