import { Vector3, Vector4, Matrix4, Raycaster } from 'three';

import { CapsuleEntity } from "./CapsuleEntity.js";
import { AvatarController } from './AvatarController.js';

import { KeyMouseControls } from '../controls/KeyMouseControls.js';
import { MobileControls } from '../controls/MobileControls.js';

const UP_VECTOR = new Vector3(0, 1, 0);

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

        this.horizontalVelocity = new Vector3();
        this.positionChange = new Vector3();
        this.spawnPoint = new Vector3();
        
        this.visible = false;

        // set the keyboard as default so we ca start the loop
        this.controls = new KeyMouseControls();
        
        this.avatarController = new AvatarController();
        this.avatarController.spawnAvatar({});

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this);
    }

    executeConfig(playerConfig) {
        const defaultOptions = {
            spawn: undefined
        };

        for (let opt in defaultOptions) {
            playerConfig[opt] = typeof playerConfig[opt] === 'undefined' ? defaultOptions[opt] : playerConfig[opt];
        };

        // // set the spawnPoint option
        if(typeof playerConfig.spawn !== "undefined") {
            this.spawnPoint = playerConfig.spawn;
            this.position.copy(playerConfig.spawn);
        }
    }

    setupControls(type) {
        switch (type) {
            case "mobile":
                this.controls = new MobileControls();
                break;
        
            case "keyboardMouse":
                this.controls = new KeyMouseControls();
                break;

            default:
                console.error(`[Player Local] Unexpected control type: ${type}`);
                break;
        }
    }

    update(delta) {

        // the getKeys will convert joystick/vr inputs to key inputs
        // so we can use the same control logic
        const keys = this.controls.getKeys();

        if(Object.keys(keys).length > 0){

            // speedFactor depending on the run/walk state
            this.speedFactor = this.controls.isRunning ? 0.15 : 0.05;

            if (keys["w"]) {
                this.horizontalVelocity.add(this.controls.getForwardVector().multiplyScalar(this.speedFactor * delta));
            }

            if (keys["s"]) {
                this.horizontalVelocity.add(this.controls.getForwardVector().multiplyScalar(-this.speedFactor * delta));
            }

            if (keys["a"]) {
                this.horizontalVelocity.add(this.controls.getSideVector().multiplyScalar(-this.speedFactor * delta));
            }

            if (keys["d"]) {
                this.horizontalVelocity.add(this.controls.getSideVector().multiplyScalar(this.speedFactor * delta));
            }
            if (keys[" "] && this.canJump) {
                this.velocity.y = 10.0;
                this.setAnimationParameters("jump", 0);
            }
        } else {
            this.controls.isRunning = false;
            this.horizontalVelocity.multiplyScalar(0);
        }

        for(let i=0; i<5; i++){
            super.update(delta/5);
        }  

        if (this.position.y < -20) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimation(keys)
        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
        }

        // update the control object
        this.controls.update();
    }

    updateCurrentAnimation(keys) {
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();

        if(this.onGround) {
            if (keys["w"] || keys["s"] || keys["a"] || keys["d"]) {
                if(this.controls.isRunning){ 
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