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

        // build the debug box
        this.debugBox = new Mesh( new BoxGeometry(this.padSize.x * 2, 2, this.padSize.z * 2) );
        this.debugBox.material.wireframe = true;
        this.debugBox.position.copy(mesh.position);
        this.debugBox.position.y = mesh.position.y + 1 + this.padSize.y;

        this.isDebugActive = VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.optionsPanel.toggleTriggers.isActive;
        if(this.isDebugActive) {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.debugBox);
        }
    }

    toggleDebugBox() {
        if(this.isDebugActive) {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.debugBox);
        } else {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.debugBox);
        }
        this.isDebugActive = !this.isDebugActive;
    }

    removeDebugger() {
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.debugBox);
    }

    update(delta) {
        const playerToPad = new Vector3();
        playerToPad.subVectors(VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position, this.mesh.position);
        
        if(
            Math.abs(playerToPad.x) < this.padSize.x &&
            playerToPad.y < 2.1 + this.padSize.y && 
            Math.abs(playerToPad.z) < this.padSize.z
        ) {
            this.onTrigger();
        }
    }
}