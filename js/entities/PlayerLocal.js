import { CapsuleEntity } from "./CapsuleEntity.js";
import { Vector3, Matrix4, Raycaster } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { AvatarController } from './AvatarController.js';

class PlayerLocal extends CapsuleEntity {
    constructor(animationURL, avatarURL, scene) {
        super(5, 30);

        this.playerDirection = new Vector3();
        this.keys = {};

        this.avatarController = new AvatarController(animationURL, avatarURL, scene);

        this.speedFactor = 1; // 1 is the default walk speed
        this.visible = false;
        this.position.y = 50;
        this.position.z = -30;

        this.jumped = 0;
        this.friction = 0.975;
    }
    
    getForwardVector = function(camera) {
        camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }
    
    getSideVector = function(camera) {
        camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(camera.up);
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }

    update(delta, camera, collider, entities, frustum, dummyCamera, controlVector) {

        // speedFactor depending on the run/walk state
        this.speedFactor = this.keys["shift"] ? 3 : 1;

        if (this.keys["w"]) {
            this.horizontalVelocity.add(this.getForwardVector(camera).multiplyScalar(this.speedFactor * delta));
        }

        if (this.keys["s"]) {
            this.horizontalVelocity.add(this.getForwardVector(camera).multiplyScalar(-this.speedFactor * delta));
        }

        if (this.keys["a"]) {
            this.horizontalVelocity.add(this.getSideVector(camera).multiplyScalar(-this.speedFactor * delta));
        }

        if (this.keys["d"]) {
            this.horizontalVelocity.add(this.getSideVector(camera).multiplyScalar(this.speedFactor * delta));
        }
        this.jumped -= 0.2;
        if (this.keys[" "]) {
            if (this.onGround && this.jumped <= 0) {
                this.jumped = 20;
            }
        }
        if (this.jumped > 0 && this.jumped < 1) {
            this.velocity.y = 150.0;
            this.jumped = 0;
        }
        super.update(delta, collider);

        if (this.position.y < -1000) {
            this.position.set(0, 40, -30);
        }
        entities.forEach(entity => {
            const size = this.radius + entity.radius;
            if (this.position.distanceTo(entity.position) < size) {
                const toEntity = Math.atan2(entity.position.x - this.position.x, entity.position.z - this.position.z);
                this.position.x -= Math.sin(toEntity) * (size - this.position.distanceTo(entity.position));
                this.position.z -= Math.cos(toEntity) * (size - this.position.distanceTo(entity.position));
            }
        });
        const invMat = new Matrix4();
        const raycaster = new Raycaster(this.position, new Vector3(0, -1, 0));
        invMat.copy(collider.matrixWorld).invert();
        raycaster.ray.applyMatrix4(invMat);
        const hit = collider.geometry.boundsTree.raycastFirst(raycaster.ray);
        if (hit) {
            hit.point.applyMatrix4(collider.matrixWorld);
            if (hit.point.distanceTo(this.position) < this.size + this.radius + 25) {
                this.groundBelow = true;
            } else {
                this.groundBelow = false;
            }
        } else {
            this.groundBelow = false;
        }

        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, frustum, this.position, this.horizontalVelocity);
            this.avatarController.opacity = (controlVector.z - 0.01) / (40 - 0.01);
        }
    }
}

export { PlayerLocal }