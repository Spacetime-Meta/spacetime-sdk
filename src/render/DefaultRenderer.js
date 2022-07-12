
import { WebGLRenderer, VSMShadowMap } from 'three';

export class DefaultRenderer extends WebGLRenderer {
    constructor() {
        super({ alpha: true });
        
        // setup a renderer with default values
        this.setPixelRatio(1);
        this.setSize(window.innerWidth-1, window.innerHeight-1);
        this.shadowMap.enabled = true;
        this.shadowMap.type = VSMShadowMap;

        // set the page css to fit perfectly
        document.body.style.margin = "0";

        // add it to the document
        document.body.appendChild(this.domElement);
    }
}
