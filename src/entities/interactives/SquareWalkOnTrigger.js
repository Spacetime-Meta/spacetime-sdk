import { Vector3, Mesh, BoxGeometry } from "three";

import { Interactive } from './Interactive.js';

export class SquareWalkOnTrigger extends Interactive {
    constructor(mesh, onTrigger) {
        super(mesh)

        this.onTrigger = onTrigger;

        this.padSize = {
            x: Math.abs(this.mesh.geometry.attributes.position.array[0]),
            y: Math.abs(this.mesh.geometry.attributes.position.array[1]),
            z: Math.abs(this.mesh.geometry.attributes.position.array[2]),
        };

        
        const box = new Mesh( new BoxGeometry(this.padSize.x * 2, 2, this.padSize.z * 2) );
        
        // use this to see the box
        // box.material.wireframe = true;
        // MAIN_SCENE.add(box);

        // box.position.copy(mesh.position);
        // box.position.y = mesh.position.y + 1 + this.padSize.y;
    }

    update() {
        const playerToPad = new Vector3();
        playerToPad.subVectors(LOCAL_PLAYER.position, this.mesh.position);
        
        if(
            Math.abs(playerToPad.x) < this.padSize.x &&
            playerToPad.y < 2.1 + this.padSize.y && 
            Math.abs(playerToPad.z) < this.padSize.z
        ) {
            this.onTrigger();
        }
    }
}