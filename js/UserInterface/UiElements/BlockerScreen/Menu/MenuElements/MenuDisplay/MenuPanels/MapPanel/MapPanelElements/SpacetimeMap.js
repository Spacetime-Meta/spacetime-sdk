import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

import { UiElement } from "../../../../../../../UiElement.js";
import { LocationManager } from "../../../../../../../../../util/LocationManager.js";

import { getSpaceSector } from './graphqlCaller.js';
import PlanetGenerator from './PlanetGenerator.js';
import { HoverInfoBox } from './HoverInfoBox.js';
import { SearchBar } from './SearchBar.js';


const IPFS = function(CID) { return `https://ipfs.io/ipfs/${CID}` }
const ID = function(x, y, z) { return `${x},${y},${z}` }
const vectorToId = function(vector) { return ID(vector.x, vector.y, vector.z) }

export class SpacetimeMap extends UiElement {
    constructor(panel){
        super({
            id: "map",
            style: {
                width: "350px",
                height: "350px"
            }
        })

        this.parentPanel = panel;

        this.hoverInfoBox = new HoverInfoBox();
        this.appendChild(this.hoverInfoBox);

        this.searchBar = new SearchBar(this);
        this.appendChild( this.searchBar )

        this.homeButton = new UiElement({
            style: {
                position: "absolute",
                padding: "5px",
                margin: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                background: "rgb(255,255,255)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8"
            },
            onClick: ()=>{
                this.handleNavigateMap(new THREE.Vector3())
            }
        })

        const homeIcon = new UiElement({
            type: "img",
            style: {
                width: "10px"
            }
        })
        homeIcon.element.src = "../../resources/images/home.png";
        this.homeButton.appendChild(homeIcon)

        this.appendChild(this.homeButton)

        this.spaceState = {};
        this.renderDistance = 50;
        this.GLTFLoader = new GLTFLoader();
        this.hoverIntersect = undefined;

        // start by initializing the three js scene and renderer
        this.buildThreeJsScene();
        
        const location = LocationManager.getLocation();
        if(isNaN(location.x) || isNaN(location.y) || isNaN(location.z)){
            this.handleNavigateMap(new THREE.Vector3());
        } else {
            this.handleNavigateMap(new THREE.Vector3(location.x, location.y, location.z));
        }

        // add the event listeners
        this.element.addEventListener('click', event => {
            var intersectResult = this.getMouseIntersect(event);

            if(typeof intersectResult !== "undefined"){
                this.handleNavigateMap(intersectResult)
            };
        });

        this.element.addEventListener('mousemove', event => {
            this.hoverIntersect = this.getMouseIntersect(event);
            
            if(typeof this.hoverIntersect !== "undefined"){

                this.hoverInfoBox.setInfoContent(this.spaceState[vectorToId(this.hoverIntersect)])

                this.hoverInfoBox.element.style.left = (event.pageX + 5) + 'px';
                this.hoverInfoBox.element.style.top = (event.pageY + 5) + 'px';
                this.hoverInfoBox.element.style.display = "flex";

            } else {
                this.hoverInfoBox.element.style.display = "none";
            }
        });

        // start the animation loop
        const animate = () => { 
            this.update()
            requestAnimationFrame(animate) 
        }
        requestAnimationFrame(animate);
    }

    async handleNavigateMap(newLocation) {
        
        this.moveOrbit(newLocation);

        // start by loading the whole sector around our new location
        await this.loadSector(newLocation);

        // TODO - at this point we can update the ui info
        this.parentPanel.setPortalPanelInfo(this.spaceState[vectorToId(newLocation)])

        this.removeOutOfRange(newLocation);

    }

    getMouseIntersect(event) { 
        var mouse3D = new THREE.Vector3(
            event.offsetX  / this.element.clientWidth * 2 - 1,
            event.offsetY  / this.element.clientHeight * -2 + 1,
            0
        ); 
        this.raycaster.setFromCamera( mouse3D, this.camera );
        var intersects = this.raycaster.intersectObjects( this.scene.children );

        // use the following line to debug the raycaster
        // this.scene.add(new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 100, Math.random() * 0xffffff ));
        
        if (intersects.length > 0) {
            let object = intersects[0].object;
            try {
                while (!object.chunk) { 
                    object = object.parent;
                }
            } catch (e) { return undefined }
            return object.chunk;
        }
    }

    async loadSector (newLocation) {
        // get the state of that sector
        const newChunks = await getSpaceSector(  
            newLocation.x-this.renderDistance, 
            newLocation.x+this.renderDistance, 
            newLocation.y-this.renderDistance, 
            newLocation.y+this.renderDistance, 
            newLocation.z-this.renderDistance, 
            newLocation.z+this.renderDistance
        )
    
        const keys = Object.keys(newChunks)
        keys.forEach(key => {
            if(typeof this.spaceState[key] === "undefined"){
                try { 
                    this.renderChunk(newChunks[key]) 
                } 
                catch (error) { 
                    console.log("Error with spaceState key: "+key)
                    console.error(error) 
                }
            }
        });
    
        // update the space state
        this.spaceState = {...this.spaceState, ...newChunks}
    }

    removeOutOfRange(newLocation) { 
        for(var i=0; i<this.scene.children.length ;i++){
            const child = this.scene.children[i]
            if(typeof child.chunk !== 'undefined'){
                const location = child.chunk;
                if(
                    location.x > newLocation.x+this.renderDistance ||
                    location.x < newLocation.x-this.renderDistance ||
                    location.y > newLocation.y+this.renderDistance ||
                    location.y < newLocation.y-this.renderDistance ||
                    location.z > newLocation.z+this.renderDistance ||
                    location.z < newLocation.z-this.renderDistance
                ){
                    this.scene.remove(child)
                    delete this.spaceState[ID(location.x, location.y, location.z)]
                    i--;
                }
            }
        }
    }

    renderChunk(objData) {
        if (objData.planet !== "") {
            this.GLBSpawner(IPFS(objData.planet),
                objData.location.x,
                objData.location.y,
                objData.location.z)
        }
        else {
            const newPlanet = PlanetGenerator.spawn(
                objData.location.x,
                objData.location.y,
                objData.location.z
            );
            this.scene.add(newPlanet)
        }
    }

    GLBSpawner (path, x, y, z) {
        this.GLTFLoader.load( path,  (object) => {
            object.scene.position.set(x, y, z);
            
            var helper = new THREE.BoxHelper(object.scene, 0xffffff)
            helper.update()
        
            // this is how we scale items back to one unit
            var rad = helper.geometry.boundingSphere.radius 
            if(rad > 1 && ID(x,y,z) != ID(0,0,0)){
                object.scene.scale.x = object.scene.scale.x / rad;
                object.scene.scale.y = object.scene.scale.y / rad;
                object.scene.scale.z = object.scene.scale.z / rad;
            }
            object.scene.chunk = new THREE.Vector3(x, y, z);
            object.scene.source = 'gltf'
            this.scene.add(object.scene)
        },
        ()=>{},
        () => {console.log("Error with Chunk "+x+" "+y+" "+z)})
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
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 500);
        this.camera.position.set(10, 10, 10);
        this.scene.add(this.camera);

        // ============= setup controls =============
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 200;
        this.controls.minDistance = 1;
        this.controls.enablePan = false;

        // ============= setup light =============
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(10, 10, 10).normalize();
        this.scene.add(light);

        // ============ setup raycaster ================
        this.raycaster = new THREE.Raycaster();
    }

    moveOrbit(newLocation) {
        console.log(newLocation)
        if(!this.controls.target.equals(newLocation)){
            
            this.originalCameraPos = this.camera.position.clone();
            this.targetCameraPos = this.camera.position.clone().add(newLocation.clone().sub(this.camera.position).normalize().multiplyScalar(newLocation.clone().sub(this.camera.position).length() - 10));
            
            
            this.originalTargetPos = this.controls.target.clone();
            this.targetTargetPos = newLocation.clone();
            
            this.cameraTransitionFrames = 60;
        } 
    }

    updateCamera() {
        if (this.cameraTransitionFrames > 0) {
            this.camera.position.copy(this.originalCameraPos.clone().lerp(this.targetCameraPos, THREE.Math.smootherstep(1 - this.cameraTransitionFrames / 60, 0, 1)));
            this.controls.target.copy(this.originalTargetPos.clone().lerp(this.targetTargetPos, THREE.Math.smootherstep(1 - this.cameraTransitionFrames / 60, 0, 1)));
            this.cameraTransitionFrames--;
        }
    }

    update() {
        this.controls.update()
        this.renderer.render(this.scene, this.camera);

        this.updateCamera()

        this.scene.children.forEach(child => {
            if(child.source === 'generator'){
                PlanetGenerator.update(child)
            } else {
                if(child.source === 'gltf'){
                    child.rotateY(0.002)
                }
            }
        })
    }
}