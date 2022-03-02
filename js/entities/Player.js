import { ControlableCapsule } from "../entities/ControlableCapsule.js";
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

class Player extends ControlableCapsule {
    constructor() {
        super();
        this.keys = {};
    }

    update(delta, camera, collider, entities) {
        super.update(delta, camera, collider);

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
        const invMat = new THREE.Matrix4();
        const raycaster = new THREE.Raycaster(this.position, new THREE.Vector3(0, -1, 0));
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
    }
}

export { Player };