import { CapsuleEntity } from "./CapsuleEntity.js";
import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

class ControlableCapsule extends CapsuleEntity {
    constructor() {
        super(5, 30);

        this.playerDirection = new Vector3();
        this.keys = {};

        this.visible = false;
        this.position.y = 50;
        this.position.z = -30;

        this.getForwardVector = function(camera) {
            camera.getWorldDirection(this.playerDirection);
            this.playerDirection.y = 0;
            this.playerDirection.normalize();
            this.playerDirection.multiplyScalar(-1);
            return this.playerDirection;
        }

        this.getSideVector = function(camera) {
            camera.getWorldDirection(this.playerDirection);
            this.playerDirection.y = 0;
            this.playerDirection.normalize();
            this.playerDirection.cross(camera.up);
            this.playerDirection.multiplyScalar(-1);
            return this.playerDirection;
        }
        this.jumped = 0;
        this.friction = 0.975;
    }

    update(delta, camera, collider) {
        if (this.keys["w"]) {
            this.horizontalVelocity.add(this.getForwardVector(camera).multiplyScalar(2 * delta));
        }

        if (this.keys["s"]) {
            this.horizontalVelocity.add(this.getForwardVector(camera).multiplyScalar(-2 * delta));
        }

        if (this.keys["a"]) {
            this.horizontalVelocity.add(this.getSideVector(camera).multiplyScalar(-2 * delta));
        }

        if (this.keys["d"]) {
            this.horizontalVelocity.add(this.getSideVector(camera).multiplyScalar(2 * delta));
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
    }
}

export { ControlableCapsule }