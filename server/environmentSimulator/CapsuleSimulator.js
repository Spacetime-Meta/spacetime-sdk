const THREE = require('three');

const tempSegment = new THREE.Line3();
const DOWN_VECTOR = new THREE.Vector3(0, -1, 0);

class CapsuleSimulator extends THREE.Object3D {
    constructor(height, width) {
        super();

        // vars
        this.box = new THREE.Box3();
        this.velocity = new THREE.Vector3();
        this.horizontalVelocity = new THREE.Vector3();
        this.onGround = false;
        this.canJump = false;
        this.height = height;

        this.width = width;
        this.gravity = -20;
        this.segment = new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, -height, 0.0));
        this.friction = 0.98;

        this.raycaster = new THREE.Raycaster();
    }

    collisionLogic(delta, collider) {

        this.updateMatrixWorld();
        
        const tempMat = new THREE.Matrix4();
        tempMat.copy(collider.matrixWorld).invert();

        tempSegment.copy(this.segment);
        tempSegment.start.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        tempSegment.end.applyMatrix4(this.matrixWorld).applyMatrix4(tempMat);
        
        const tempBox = new THREE.Box3();
        tempBox.makeEmpty();
        tempBox.expandByPoint(tempSegment.start);
        tempBox.expandByPoint(tempSegment.end);
        tempBox.min.addScalar(-this.width);
        tempBox.max.addScalar(this.width);

        const tempVector = new THREE.Vector3();
        const tempVector2 = new THREE.Vector3();
        collider.bvh.shapecast({

            intersectsBounds: box => box.intersectsBox(tempBox),

            intersectsTriangle: tri => {

                // check if the triangle is intersecting the capsule and adjust the
                // capsule position if it is.
                const triPoint = tempVector;
                const capsulePoint = tempVector2;

                const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
                if (distance < this.width) {

                    const depth = this.width - distance;
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
        
        // evaluate if the player is close to the ground
        this.raycaster.set(tempSegment.start, DOWN_VECTOR);
        // console.log(tempSegment.start);
        this.raycaster.ray.applyMatrix4(tempMat)
        const hit = collider.bvh.raycastFirst( this.raycaster.ray );

        if(hit) {
            this.canJump = hit.distance < 2 || this.onGround;
        } else {
            this.canJump = this.onGround;
        }
    }

    update(delta, collider, steps) {

        // add the movement velocity to the position
        this.position.add(this.horizontalVelocity);

        // apply the friction
        
        // console.log(this.horizontalVelocity);
        
        this.horizontalVelocity.multiplyScalar(this.friction);
        
        

        if(collider) {
            // make the player fall if he is not grounded 
            this.velocity.y += this.onGround ? 0 : delta * this.gravity;
            // console.log(this.onGround);
            // if(!this.onGround) {
            //     console.log(delta);
            //     console.log(delta * this.gravity);
            //     console.log(this.velocity.y);
            //     console.log(this.position.y);
            //     console.log("");
            // }
            
            this.position.addScaledVector(this.velocity, delta);
            
            this.collisionLogic(delta, collider); 
        }
    }
}
module.exports = { CapsuleSimulator }