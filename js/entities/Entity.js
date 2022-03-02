import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

class Entity extends THREE.Object3D {
    constructor() {
        super();
        this.box = new THREE.Box3();
        this.velocity = new THREE.Vector3();
    }
    update(delta) {}
}
export { Entity };