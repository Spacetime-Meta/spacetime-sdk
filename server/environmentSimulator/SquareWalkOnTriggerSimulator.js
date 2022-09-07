const THREE = require("three");

class SquareWalkOnTriggerSimulator {
    constructor(object, onTrigger) {

        // save the on trigger function
        this.onTrigger = onTrigger;

        // build a mesh with the given geometry
        this.mesh = new THREE.Mesh(object.geometry);
        this.mesh.geometry.computeBoundingBox();

        // find the center of the geometry
        const box = new THREE.Box3();
        box.copy( this.mesh.geometry.boundingBox )
           .applyMatrix4( this.mesh.matrixWorld )
           .getCenter( this.mesh.position );
        
        // find size of the pad
        this.padSize = this.mesh.geometry.boundingBox.max.sub(this.mesh.geometry.boundingBox.min).divideScalar(2)
    }

    update(delta, playerList) {
        for(var player in playerList) {
            const playerToPad = new THREE.Vector3();
            playerToPad.subVectors(playerList[player].position, this.mesh.position);
            
            if(
                Math.abs(playerToPad.x) < this.padSize.x &&
                playerToPad.y < 2.1 + this.padSize.y && 
                Math.abs(playerToPad.z) < this.padSize.z
            ) {
                this.onTrigger(playerList[player]);
            }
        }
    }
}
module.exports = { SquareWalkOnTriggerSimulator }