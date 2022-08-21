import { Vector3, Vector4 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const UP_VECTOR = new Vector3(0, 1, 0);
const FIRST_PERSON_CONTROLS = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
const THIRD_PERSON_CONTROLS = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 5, 0.2);

const FORWARD_QUADRANT_KEY_MAP = [
    {"d": true},            // 0
    {"d": true, "w": true}, // 1
    {"d": true, "w": true}, // 2
    {"w": true},            // 3
    {"w": true},            // 4
    {"a": true, "w": true}, // 5
    {"a": true, "w": true}, // 6
    {"a": true},            // 7
]

const BACKWARD_QUADRANT_KEY_MAP = [
    {"d": true},            // 0
    {"d": true, "s": true}, // 1
    {"d": true, "s": true}, // 2
    {"s": true},            // 3
    {"s": true},            // 4
    {"a": true, "s": true}, // 5
    {"a": true, "s": true}, // 6
    {"a": true},            // 7
]

const temp = new Vector3();

export class MobileControls {
    constructor() {

        // this one can not extend orbit controls because it causes conflicts with the original update method
        this.orbitControls = new OrbitControls(VIRTUAL_ENVIRONMENT.camera, VIRTUAL_ENVIRONMENT.UI_CONTROLLER.playScreen.element);

        this.orbitControls.minPolarAngle = 0.01; 
        this.orbitControls.maxPolarAngle = Math.PI - 0.25;

        this.orbitControls.maxDistance = VIRTUAL_ENVIRONMENT.camera.DEFAULT_DISTANCE;
        this.orbitControls.minDistance = VIRTUAL_ENVIRONMENT.camera.DEFAULT_DISTANCE;

        this.controlVector =  THIRD_PERSON_CONTROLS.clone();
        this.targetControlVector =  THIRD_PERSON_CONTROLS.clone();

        this.isRunning = false;
        this.isJumping = false;

        this.TYPE = "mobile"

        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.setupTouchControls();
    }

    getForwardVector() {
        temp.x = Math.sin(this.orbitControls.getAzimuthalAngle());
        temp.z = Math.cos(this.orbitControls.getAzimuthalAngle());
        return temp.normalize().multiplyScalar(-1);
    }

    getSideVector() {
        return this.getForwardVector().cross(UP_VECTOR);
    }

    getControlObject() {
        temp.x = Math.sin(this.orbitControls.getAzimuthalAngle());
        temp.z = Math.cos(this.orbitControls.getAzimuthalAngle());
        return temp
    }

    getKeys() {
        const quadrant = VIRTUAL_ENVIRONMENT.UI_CONTROLLER.joystick.quadrant;

        if(!isNaN(quadrant)) {
            return {
                ...(VIRTUAL_ENVIRONMENT.UI_CONTROLLER.joystick.isForward ? BACKWARD_QUADRANT_KEY_MAP[quadrant] : FORWARD_QUADRANT_KEY_MAP[quadrant]),
                ...(this.isJumping ? {" ": true} : {}),
                ...(this.isRunning ? {"shift": true} : {})
            }
        } else {
            return this.isJumping ? {" ": true} : {};
        }
    }

    update() {

        this.orbitControls.update();

        // move the target
        this.orbitControls.target.set( 
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.x, 
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.y, 
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.z 
        );

        // adjust the distance
        // *this could have a better smoothing function* 
        const lastDist = this.orbitControls.maxDistance;
        this.orbitControls.maxDistance = (VIRTUAL_ENVIRONMENT.camera.cameraDistance + lastDist) / 2;
        this.orbitControls.minDistance = (VIRTUAL_ENVIRONMENT.camera.cameraDistance + lastDist) / 2;

        // update the run state depending on the joystick position
        this.isRunning = VIRTUAL_ENVIRONMENT.UI_CONTROLLER.joystick.isMaxed;

        // orbit controls must be updated every frame
        this.orbitControls.update();
    }
}