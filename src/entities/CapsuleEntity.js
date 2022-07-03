import { Box3, Vector3, Line3, Matrix4, Object3D } from 'three';

export class CapsuleEntity extends Object3D {
    constructor(radius, size) {
        super();
        this.box = new Box3();
        this.velocity = new Vector3();
        this.horizontalVelocity = new Vector3();
        this.radius = radius;
        this.size = size;
        this.onGround = false;
        this.gravity = -20;
        this.segment = new Line3(new Vector3(), new Vector3(0, -size, 0.0));

        // this.debugHitBox = new THREE.Mesh(new THREE.BoxGeometry( radius * 2, size + radius * 2, radius * 2 ));
        // this.debugHitBox.material.wireframe = true;
        // MAIN_SCENE.add(this.debugHitBox);

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
        
        const tempMat = new Matrix4();
        tempMat.copy(collider.matrixWorld).invert();

        const tempSegment = new Line3();
        tempSegment.copy(this.segment);
        tempSegment.start.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        tempSegment.end.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        
        const tempBox = new Box3();
        tempBox.makeEmpty();
        tempBox.expandByPoint(tempSegment.start);
        tempBox.expandByPoint(tempSegment.end);
        tempBox.min.addScalar(-this.radius);
        tempBox.max.addScalar(this.radius);

        const tempVector = new Vector3();
        const tempVector2 = new Vector3();
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

        // this.debugHitBox.position.copy(tempSegment.start.add(tempSegment.end).multiplyScalar(0.5))
        
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