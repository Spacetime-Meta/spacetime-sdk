import { DirectionalLight } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;
const ULTRA = 3;

class DefaultDirectionalLight extends DirectionalLight {
    constructor(graphicTier) {
        super(0x8888ff, 1);

        // default values
        this.position.set(90, 360, 170 * 3);
        this.castShadow = true;
        this.shadow.camera.near = 0.1;
        this.shadow.camera.far = 1000;
        this.shadow.camera.right = 400;
        this.shadow.camera.left = -400;
        this.shadow.camera.top = 400;
        this.shadow.camera.bottom = -400;
        this.shadow.radius = 4;

        switch (graphicTier) {
            case ULTRA:
                this.shadow.mapSize.width = 2048;
                this.shadow.mapSize.height = 2048;
                this.shadow.bias = -0.001;
                break;

            case HIGH:
                this.shadow.mapSize.width = 1024;
                this.shadow.mapSize.height = 1024;
                this.shadow.bias = -0.0025;
                break;

            case MEDIUM:
                this.shadow.mapSize.width = 512;
                this.shadow.mapSize.height = 512;
                this.shadow.bias = -0.005;
                break;
        }
    }
    update(camera) {
        this.position.x = camera.position.x + 90;
        this.position.y = 360;
        this.position.z = camera.position.z + 170 * 3;
        this.target.position.x = camera.position.x;
        this.target.position.y = 0;
        this.target.position.z = camera.position.z;
        this.shadow.camera.updateProjectionMatrix();
        this.updateMatrix();
    }
}

export { DefaultDirectionalLight };