import { Scene, Color, Fog, HemisphereLight } from 'three';

import { SquareWalkOnTrigger } from '../entities/interactives/SquareWalkOnTrigger.js';
import { DefaultDirectionalLight } from "./DefaultDirectionalLight.js"

export class DefaultScene extends Scene {
    constructor() {
        super();
        
        // ===== sky =====
        // TODO skybox
        this.background = new Color(0x69e6f4);
        this.fog = new Fog( new Color(0.8, 0.8, 0.8), 10, 150 );

        // ===== ambient lights =====
        const light = new HemisphereLight(0xffeeff, 0x777788, 1);
        this.add(light);

        // ===== shadowLights =====
        this.shadowLight = new DefaultDirectionalLight();
        this.add(this.shadowLight);
        this.add(this.shadowLight.target);

        this.interactives = [];
    }

    toggleShadows() {
        this.shadowLight.castShadow = !this.shadowLight.castShadow;
    }

    buildInteractives() {
        this.children.forEach(child => {
            if(child.name === "Scene") {
                child.children.forEach(mesh => {
                    if(mesh.name.substring(0,5) === "_stm_") {
                        const type = mesh.name.substring(5).substring(0,mesh.name.substring(5).indexOf('_'));

                        switch (type) {
                            
                            case "launchpad": {
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    LOCAL_PLAYER.velocity.y = 50;
                                }) );
                            } break;

                            case "spawnPoint": {
                                LOCAL_PLAYER.spawnPoint = mesh.position;
                                LOCAL_PLAYER.position.copy(mesh.position);
                            } break;

                            case "startTime": {
                                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.setupTimer();
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.playScreen.timerBox.startTimer();
                                }) );
                            } break;

                            case "stopTime": {
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.playScreen.timerBox.stopTimer()
                                }) );
                            } break;

                            case "portal": {
                                this.interactives.push( new SquareWalkOnTrigger(mesh, () => {
                                }) );
                            } break;
                        }
                    }
                })
            }
        })
    }

    update() {

        this.shadowLight.update();

        this.interactives.forEach(interactive => {
            interactive.update();
        })
    }
}
