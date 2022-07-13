import { Scene, Color, Fog, HemisphereLight } from 'three';

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



        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    toggleShadows() {
        this.shadowLight.castShadow = !this.shadowLight.castShadow;
    }

    update(delta) {
        this.shadowLight.update();
    }
}
