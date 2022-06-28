import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

export class CapsuleEntity extends THREE.Object3D {
    constructor(radius, size) {
        super();
        this.box = new THREE.Box3();
        this.velocity = new THREE.Vector3();
        this.horizontalVelocity = new THREE.Vector3();
        this.radius = radius;
        this.size = size;
        this.onGround = false;
        this.gravity = -300;
        this.segment = new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, -size, 0.0));
        this.friction = 0.975;
    }

    update(delta, collider) {

        // make the player fall if he is not grounded 
        this.velocity.y += this.onGround ? 0 : delta * this.gravity;

        // add the velocity to the position
        this.position.addScaledVector(this.velocity, delta);
        this.position.add(this.horizontalVelocity);

        // apply the friction
        this.horizontalVelocity.multiplyScalar(this.friction);
        
        this.updateMatrixWorld();
        
        const tempMat = new THREE.Matrix4();
        tempMat.copy(collider.matrixWorld).invert();

        const tempSegment = new THREE.Line3();
        tempSegment.copy(this.segment);
        tempSegment.start.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        tempSegment.end.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        
        const tempBox = new THREE.Box3();
        tempBox.makeEmpty();
        tempBox.expandByPoint(tempSegment.start);
        tempBox.expandByPoint(tempSegment.end);
        tempBox.min.addScalar(-this.radius);
        tempBox.max.addScalar(this.radius);

        const tempVector = new THREE.Vector3();
        const tempVector2 = new THREE.Vector3();
        collider.geometry.boundsTree.shapecast({

            intersectsBounds: box => box.intersectsBox(tempBox),

            intersectsTriangle: tri => {

                // check if the triangle is intersecting the capsule and adjust the
                // capsule position if it is.
                const triPoint = tempVector;
                const capsulePoint = tempVector2;

                const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
                if (distance < this.radius) {

                    const depth = this.radius - distance;
                    const direction = capsulePoint.sub(triPoint).normalize();

                    tempSegment.start.addScaledVector(direction, depth);
                    tempSegment.end.addScaledVector(direction, depth);                 
                }
            }
        });

        const newPosition = tempVector;
        newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld);

        const deltaVector = tempVector2;
        deltaVector.subVectors(newPosition, this.position);
        
        const offset = Math.max(0.0, deltaVector.length() - 1e-5);
        deltaVector.normalize().multiplyScalar(offset);
        this.position.add(deltaVector);
        
        // evaluate if the player is grounded
        this.onGround = deltaVector.y > Math.abs(delta * this.velocity.y * 0.25);

        if (this.onGround) {
            this.velocity.set(0, 0, 0);
        } else {
            deltaVector.normalize();
            this.velocity.addScaledVector(deltaVector, -deltaVector.dot(this.velocity));
        }
    }
}