import { PerspectiveCamera, Vector3, Object3D, Matrix4, Raycaster } from 'three'

const ZERO_VECTOR = new Vector3();
const invMat = new Matrix4();

export class DefaultCamera extends PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 0.1, 200);

        // the control object is feed to the pointer lock controls
        this.controlObject = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2);

        this.cameraPosition = new Vector3();
        this.cameraTarget = new Vector3();

        this.raycaster = new Raycaster();

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this)
    }

    updateCameraPosition(distanceFactor) {
        this.position.copy(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position);
        this.position.add(this.controlObject.getWorldDirection(ZERO_VECTOR).multiplyScalar(distanceFactor));
        this.lookAt(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position);
    }

    update(delta) {

        let hit;
        if( VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z > 0.1 && typeof VIRTUAL_ENVIRONMENT.terrainController.collider !== "undefined" ) { 
            // raycast to see if the camera is clipped
            invMat.copy(VIRTUAL_ENVIRONMENT.terrainController.collider.matrixWorld).invert();
            this.raycaster.set(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.clone(), this.position.clone().sub(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.clone()).normalize());
            this.raycaster.ray.applyMatrix4(invMat);
            hit = VIRTUAL_ENVIRONMENT.terrainController.collider.geometry.boundsTree.raycastFirst(this.raycaster.ray);
        }

        if (hit) {
            this.updateCameraPosition(Math.min(hit.distance * 0.8, VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z));
        } else {
            this.updateCameraPosition(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z);
        }
    }
}