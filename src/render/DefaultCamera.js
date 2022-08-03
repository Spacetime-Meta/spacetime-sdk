import { PerspectiveCamera, Vector3, Object3D, Matrix4, Raycaster } from 'three'

const ZERO_VECTOR = new Vector3();
const invMat = new Matrix4();

export class DefaultCamera extends PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 0.1, 200);

        // the control object is feed to the pointer lock controls
        this.controlObject = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2);

        // used for calculations
        this.cameraPosition = new Vector3();
        this.strictPosition = new Vector3();
        this.cameraTarget = new Vector3();

        this.raycaster = new Raycaster();

        // the camera will be update every frame
        VIRTUAL_ENVIRONMENT.updatableObjects.push(this)
    }

    update(delta) {
        
        let hit;

        // raycast to see if the camera is clipped
        if( VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z > 0.1 && typeof VIRTUAL_ENVIRONMENT.terrainController.collider !== "undefined" ) {     
            invMat.copy(VIRTUAL_ENVIRONMENT.terrainController.collider.matrixWorld).invert();
            this.raycaster.set(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.clone(), this.position.clone().sub(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.clone()).normalize());
            this.raycaster.ray.applyMatrix4(invMat);
            hit = VIRTUAL_ENVIRONMENT.terrainController.collider.geometry.boundsTree.raycastFirst(this.raycaster.ray);
        }

        // adjust the camera distance depending on a hit
        if (hit) {
            this.cameraDistance = Math.min(hit.distance * 0.8, VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z);
        } else {
            this.cameraDistance = VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controlVector.z;
        }

        if(VIRTUAL_ENVIRONMENT.UI_CONTROLLER.isTouchScreen) {

            if(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls) {
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.maxDistance = this.cameraDistance;
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.minDistance = this.cameraDistance;
            }

        } else {
            // the strick position is where the camera would be without the smoothing
            this.strictPosition.copy(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position);
            this.strictPosition.add(this.controlObject.getWorldDirection(ZERO_VECTOR).multiplyScalar(this.cameraDistance));

            // smoothly move the camera toward its strict position
            this.position.lerp(this.strictPosition, 0.2);
            this.cameraTarget.lerp(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position, 0.2);
            this.lookAt(this.cameraTarget);
        }

    }
}