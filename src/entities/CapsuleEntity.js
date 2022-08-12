import { Box3, Vector3, Line3, Matrix4, Object3D, Mesh, BoxGeometry, Raycaster, ArrowHelper } from 'three';

const downVector = new Vector3(0, -1, 0);
const tempSegment = new Line3();

export class CapsuleEntity extends Object3D {
    constructor(radius, size) {
        super();
        this.box = new Box3();
        this.velocity = new Vector3();
        this.horizontalVelocity = new Vector3();
        this.radius = radius;
        this.size = size;
        this.onGround = false;
        this.canJump = false;
        this.gravity = -20;
        this.segment = new Line3(new Vector3(), new Vector3(0, -size, 0.0));
        console.log(this.segment);

        this.raycaster = new Raycaster();
        this.raycaster.set(this.position, downVector);
        this.arrowHelper = new ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 100, 0x00ff00 );

        this.debugHitBox = new Mesh(new BoxGeometry( radius * 2, size + radius * 2, radius * 2 ));
        this.debugHitBox.material.wireframe = true;

        this.isHelperActive = false;

        this.friction = 0.98;
    }

    toggleHitbox() {
        if(this.isHelperActive) {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.debugHitBox);
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.arrowHelper);
        } else {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.arrowHelper);
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.debugHitBox);
        }
        this.isHelperActive = !this.isHelperActive;
    }

    collisionLogic(delta, collider) {
 
        this.updateMatrixWorld();
        
        const tempMat = new Matrix4();
        tempMat.copy(collider.matrixWorld).invert();

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
        collider.bvh.shapecast({

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
        // console.log(deltaVector.y);
        // console.log(Math.abs(delta * this.velocity.y * 0.25));
        // console.log(this.onGround);
        // console.log("");

        if (this.onGround) {
            this.velocity.set(0, 0, 0);
        } else {
            deltaVector.normalize();
            this.velocity.addScaledVector(deltaVector, -deltaVector.dot(this.velocity));
        }
        
        // evaluate if the player is close to the ground
        this.raycaster.set(tempSegment.start, downVector);
        // console.log(tempSegment.start);
        this.raycaster.ray.applyMatrix4(tempMat)
        const hit = collider.bvh.raycastFirst( this.raycaster.ray );

        if(hit) {

            // console.log(hit.distance);
            if(hit.distance > 2) {
                console.log(this.onGround);
            }

            this.canJump = hit.distance < 2 || this.onGround;
        } else {
            this.canJump = this.onGround;
        }
    }

    update(delta) {

        // add the movement velocity to the position
        this.position.add(this.horizontalVelocity);

        // apply the friction
        this.horizontalVelocity.multiplyScalar(this.friction);


        if(VIRTUAL_ENVIRONMENT.terrainController.collider) {
            // make the player fall if he is not grounded 
            this.velocity.y += this.onGround ? 0 : delta * this.gravity;

            this.position.addScaledVector(this.velocity, delta);
            
            this.collisionLogic(delta, VIRTUAL_ENVIRONMENT.terrainController.collider); 
        }
        
        if(this.isHelperActive){        
            if(this.canJump) {
                this.arrowHelper.setColor(0x00ff00)
            } else {
                this.arrowHelper.setColor(0xff0000)
            }

            this.debugHitBox.position.copy(tempSegment.start);
            this.debugHitBox.position.y -= this.size / 2; 
            this.arrowHelper.position.copy(this.position);
        }
    }
}