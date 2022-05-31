import { CapsuleEntity } from "./CapsuleEntity.js";
import { PointerLockControls } from '../util/PointerLockControls.js';
import { Vector3, Vector4, Matrix4, Raycaster } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { AvatarController } from './AvatarController.js';

class PlayerLocal extends CapsuleEntity {
    constructor(params, camera, loadingManager) {
        super(5, 30);
        this.spawnPoint = typeof params.spawn === "undefined" ? {x: 0, y:0, z:0} : params.spawn;
        this.position.x = this.spawnPoint.x;
        this.position.y = this.spawnPoint.y;
        this.position.z = this.spawnPoint.z;


        this.camera = camera;
        this.fpsControls = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
        this.thirdPersonControls = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 40, 0.2);
        this.controlVector = this.thirdPersonControls.clone();
        this.targetControlVector = this.thirdPersonControls;
        this.horizontalVelocity = new Vector3();
        this.playerDirection = new Vector3();
        this.positionChange = new Vector3();
        this.keys = {};

        this.speedFactor = 1; // 1 is the default walk speed
        this.visible = false;
        
        this.avatarController = new AvatarController(loadingManager);
        this.avatarController.spawnAvatar(params);
        this.setupControls(this.camera);
    }

    setupControls() {
        this.controls = new PointerLockControls(this.camera, document.body);
        this.controls.sensitivityY = -0.002;
        this.controls.minPolarAngle = 0.01; 
        this.controls.maxPolarAngle = Math.PI - 0.25;
        mainScene.add(this.controls.getObject());

        document.addEventListener('keyup', (event) => {
            delete this.keys[event.key.toLowerCase()];
        });
        document.addEventListener('keydown', (event) => {
            if(player.controls.isLocked) {
                if (event.key === "v") {
                    if (this.targetControlVector === this.thirdPersonControls) {
                        this.targetControlVector = this.fpsControls;
                    } else {
                        this.targetControlVector = this.thirdPersonControls;
                    }
                }
                if (event.keyCode === 32 && event.target === document.body) {
                    event.preventDefault();
                }
                player.keys[event.key.toLowerCase()] = true;
            }
        });

        window.addEventListener('keydown', (event) => {

        });

        this.controls.addEventListener('unlock', () => {
            document.getElementById("blockerWrapper").style.display = 'block';
        });
    }
    
    getForwardVector() {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }
    
    getSideVector() {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.up);
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }

    update(delta, collider) {

        if(Object.keys(this.keys).length > 0){
            // speedFactor depending on the run/walk state
            this.speedFactor = this.keys["shift"] ? 3 : 1;

            if (this.keys["w"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.camera).multiplyScalar(this.speedFactor * delta));
            }

            if (this.keys["s"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.camera).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["a"]) {
                this.horizontalVelocity.add(this.getSideVector(this.camera).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["d"]) {
                this.horizontalVelocity.add(this.getSideVector(this.camera).multiplyScalar(this.speedFactor * delta));
            }
            if (this.keys[" "] && this.onGround) {
                this.velocity.y = 150.0;
                this.setAnimationParameters("jump", 0);
            }
        } else {
            this.horizontalVelocity.multiplyScalar(0);
        }

        
        for(let i=0; i<5; i++){
            super.update(delta/5, collider);
        }
       

        if (this.position.y < -1000) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimation()
        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
            this.avatarController.opacity = (this.controlVector.z - 0.01) / (40 - 0.01);
        }

        this.controlVector.lerp(this.targetControlVector, 0.1);
    }

    updateCurrentAnimation() {
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();

        if(this.onGround) {
            if (this.keys["w"] || this.keys["s"] || this.keys["a"] || this.keys["d"]) {
                if(this.keys["shift"]){ 
                    this.setAnimationParameters("run"); 
                } else { 
                    this.setAnimationParameters("walk"); 
                }
            } else {
                this.setAnimationParameters("idle");
            }
        } else {
            if(this.positionChange.y < -0.5) {
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