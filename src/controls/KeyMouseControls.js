import { Vector3, Vector4 } from 'three';

// using fix version since most recent does not support pointerSpeedY
// update to mos recent when an alternative is found
import { PointerLockControls } from './PointerLockControls.js';

const UP_VECTOR = new Vector3(0, 1, 0);
const FIRST_PERSON_CONTROLS = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
const THIRD_PERSON_CONTROLS = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 5, 0.2);

const temp = new Vector3();

export class KeyMouseControls extends PointerLockControls {
    constructor() {
        super(VIRTUAL_ENVIRONMENT.camera.controlObject, document.body);

        this.sensitivityY = -0.002;
        this.minPolarAngle = 0.01; 
        this.maxPolarAngle = Math.PI - 0.25;

        this.controlVector =  THIRD_PERSON_CONTROLS.clone();
        this.targetControlVector =  THIRD_PERSON_CONTROLS.clone();

        this.isRunning = false;

        this.TYPE = "keyboardMouse"

        this.keys = {}

        document.addEventListener('keyup', (event) => {
            delete this.keys[event.key.toLowerCase()];
        });

        document.addEventListener('keydown', (event) => {

            // this prevents the controls from working
            // while typing in the menu
            if(this.isLocked) {
                
                if (event.key === "v") {
                    if (this.targetControlVector === THIRD_PERSON_CONTROLS) {
                        this.targetControlVector = FIRST_PERSON_CONTROLS;
                        VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.avatarController.setTransparency(true);
                    } else {
                        this.targetControlVector = THIRD_PERSON_CONTROLS;
                        VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.avatarController.setTransparency(false);
                    }
                }

                if (event.key === "r") {
                    this.position.set( 
                        VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.spawnPoint.x, 
                        VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.spawnPoint.y, 
                        VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.spawnPoint.z, 
                    );
                    this.velocity = new Vector3();
                }

                if (event.keyCode === 32 && event.target === document.body) {
                    event.preventDefault();
                }

                this.keys[event.key.toLowerCase()] = true;
            }
        });

        this.addEventListener('unlock', () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsUnlock()
        });
    }

    getForwardVector() {
        VIRTUAL_ENVIRONMENT.camera.controlObject.getWorldDirection(temp);
        temp.y = 0;
        return temp.normalize().multiplyScalar(-1);
    }

    getSideVector() {
        return this.getForwardVector().cross(UP_VECTOR)
    }

    getKeys() {
        return this.keys;
    }

    update() {
        this.controlVector.lerp(this.targetControlVector, 0.1);

        if(this.keys["shift"]) {
            this.isRunning = true;
        }
    }
} 