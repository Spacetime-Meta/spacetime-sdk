import { DirectionalLight, CameraHelper, Vector3 } from 'three';

const OFFSET = new Vector3(-30, 100, -100)

export class DefaultDirectionalLight extends DirectionalLight {
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
        // VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(helper)
    }
    update(delta) {
        this.position.addVectors(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position, OFFSET);
        this.target.position.copy(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position);
    }
}