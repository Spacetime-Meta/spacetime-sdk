import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

import { UiElement } from "../../../../../../../UiElement.js";
import { LocationManager } from "../../../../../../../../../util/LocationManager.js";


const IPFS = function(CID) { return `https://ipfs.io/ipfs/${CID}` }
const ID = function(x, y, z) { return `${x},${y},${z}` }

export class SpacetimeMap extends UiElement {
    constructor(){
        super({
            id: "map",
            style: {
                width: "350px",
                height: "350px",
            }
        })

        // start by initializing the three js scene and renderer
        this.buildThreeJsScene();
        
        /**
         * Get the current location so we can always ini the map
         * looking at the planet we are currently on
         */ 
        const location = LocationManager.getLocation();
        handleNavigateMap(location.x, location.y, location.z);


        // start the animation loop
        const animate = () => { 
            this.update()
            requestAnimationFrame(animate) 
        }
        requestAnimationFrame(animate);
    }

    async handleNavigateMap(x, y, z) {
        
    }

    buildThreeJsScene() {
        // ============= renderer =============
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(350, 350);
        this.element.appendChild(this.renderer.domElement);

        // ============= setup the scene =============
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // ============= setup the camera =============
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.set(10, 10, 10);
        this.scene.add(this.camera);

        // ============= setup controls =============
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 20;
        this.controls.minDistance = 1;
        this.controls.enablePan = false;

        // ============= setup light =============
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(10, 10, 10).normalize();
        this.scene.add(light);
    }

    update() {
        this.renderer.render(this.scene, this.camera)
    }
}