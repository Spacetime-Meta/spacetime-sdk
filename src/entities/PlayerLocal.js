import { CapsuleEntity } from "./CapsuleEntity.js";
import { PointerLockControls } from '../util/PointerLockControls.js'; // most recent version does not support pointerSpeedY
import { Vector3, Vector4, Matrix4, Raycaster, Mesh, BoxGeometry } from 'three';
import { AvatarController } from './AvatarController.js';

const UP_VECTOR = new Vector3(0, 1, 0);
const FIRST_PERSON_CONTROLS = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
const  THIRD_PERSON_CONTROLS = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 5, 0.2);

const tempVector = new Vector3();

const PLAYER_DIMENSIONS = {
    HEIGHT: 1.5,
    WIDTH: 0.25
}

class PlayerLocal extends CapsuleEntity {
    constructor() {
        super(
            PLAYER_DIMENSIONS.WIDTH,
            PLAYER_DIMENSIONS.HEIGHT
        );

        this.controlVector =  THIRD_PERSON_CONTROLS.clone();
        this.targetControlVector =  THIRD_PERSON_CONTROLS.clone();
        this.horizontalVelocity = new Vector3();
        this.positionChange = new Vector3();
        this.spawnPoint = new Vector3();
        
        this.keys = {};
        this.visible = false;
        this.isRunning = false;
        
        this.avatarController = new AvatarController();
        this.avatarController.spawnAvatar({});
        this.setupControls();

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this);

        // multiplayer debugger
        this.multiplayerDebugHitBox = new Mesh(new BoxGeometry( 
            PLAYER_DIMENSIONS.WIDTH * 2, 
            PLAYER_DIMENSIONS.HEIGHT + PLAYER_DIMENSIONS.WIDTH * 2,
            PLAYER_DIMENSIONS.WIDTH * 2 
        ));
        this.multiplayerDebugHitBox.material.wireframe = true;
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.multiplayerDebugHitBox);
    }

    executeConfig(playerConfig) {
        const defaultOptions = {
            spawn: new Vector3()
        };

        for (let opt in defaultOptions) {
            playerConfig[opt] = typeof playerConfig[opt] === 'undefined' ? defaultOptions[opt] : playerConfig[opt];
        };

        this.spawnPoint = playerConfig.spawn;
        this.position.copy(playerConfig.spawn);
    }

    setupControls() {
        this.controls = new PointerLockControls(VIRTUAL_ENVIRONMENT.camera.controlObject, document.body);
        this.controls.sensitivityY = -0.002;
        this.controls.minPolarAngle = 0.01; 
        this.controls.maxPolarAngle = Math.PI - 0.25;
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.controls.getObject());

        document.addEventListener('keyup', (event) => {
            delete this.keys[event.key.toLowerCase()];
        });
        document.addEventListener('keydown', (event) => {
            if(this.controls.isLocked) {
                if (event.key === "v") {
                    if (this.targetControlVector ===  THIRD_PERSON_CONTROLS) {
                        this.targetControlVector = FIRST_PERSON_CONTROLS;
                        this.avatarController.setTransparency(true);
                    } else {
                        this.targetControlVector =  THIRD_PERSON_CONTROLS;
                        this.avatarController.setTransparency(false);
                    }
                }
                if (event.key === "r") {
                    this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
                    this.velocity = new Vector3();
                }
                if (event.keyCode === 32 && event.target === document.body) {
                    event.preventDefault();
                }
                this.keys[event.key.toLowerCase()] = true;
            }
        });

        this.controls.addEventListener('unlock', () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsUnlock()
        });
    }
    
    getForwardVector() {
        VIRTUAL_ENVIRONMENT.camera.controlObject.getWorldDirection(tempVector);
        tempVector.y = 0;
        tempVector.normalize();
        tempVector.multiplyScalar(-1);
        return tempVector;
    }
    
    getSideVector() {
        VIRTUAL_ENVIRONMENT.camera.controlObject.getWorldDirection(tempVector);
        tempVector.y = 0;
        tempVector.normalize();
        tempVector.cross(UP_VECTOR);
        tempVector.multiplyScalar(-1);
        return tempVector;
    }

    update(delta) {

        if(Object.keys(this.keys).length > 0){

            // speedFactor depending on the run/walk state
            if(this.keys["shift"]) {
                this.isRunning = true;
            }
            this.speedFactor = this.isRunning ? 0.15 : 0.05;

            if (this.keys["w"]) {
                this.horizontalVelocity.add(this.getForwardVector().multiplyScalar(this.speedFactor * delta));
            }

            if (this.keys["s"]) {
                this.horizontalVelocity.add(this.getForwardVector().multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["a"]) {
                this.horizontalVelocity.add(this.getSideVector().multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["d"]) {
                this.horizontalVelocity.add(this.getSideVector().multiplyScalar(this.speedFactor * delta));
            }
            if (this.keys[" "] && this.canJump) {
                this.velocity.y = 10.0;
                this.setAnimationParameters("jump", 0);
            }
        } else {
            this.isRunning = false;
            this.horizontalVelocity.multiplyScalar(0);
        }

        for(let i=0; i<5; i++){
            super.update(delta/5);
        }  

        if (this.position.y < -20) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimation()
        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
        }

        this.controlVector.lerp(this.targetControlVector, 0.1);

        if(VIRTUAL_ENVIRONMENT.socketController) {
            const direction = VIRTUAL_ENVIRONMENT.camera.controlObject.getWorldDirection(tempVector);
            VIRTUAL_ENVIRONMENT.socketController.socket.emit("keys", {
                keys: this.keys,
                controlObject: direction
            });
        }
    }

    updateCurrentAnimation() {
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();

        if(this.onGround) {
            if (this.keys["w"] || this.keys["s"] || this.keys["a"] || this.keys["d"]) {
                if(this.isRunning){ 
                    this.setAnimationParameters("run"); 
                } else { 
                    this.setAnimationParameters("walk"); 
                }
            } else {
                this.setAnimationParameters("idle");
            }
        } else {
            if(this.positionChange.y < -3) {
                this.setAnimationParameters("fall", 0.25);
            }
        }
    }

    setAnimationParameters(anim, time = 0.5) {
        this.currentAnimation = anim;
        this.currentAnimationTime = time;
    }
}

export { PlayerLocal }