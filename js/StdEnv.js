import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { PointerLockControls } from './util/PointerLockControls.js';

import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from './util/three-mesh-bvh.js';

import { DefaultDirectionalLight } from "./render/DefaultDirectionalLight.js"
import { DefaultComposer } from "./render/DefaultComposer.js"
import { PlayerLocal } from './entities/PlayerLocal.js';
import localProxy from "./util/localProxy.js";

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;
const ULTRA = 3;

let shadowLight, collider;

const bloomScene = new THREE.Scene();
const clock = new THREE.Clock();

/*
This class wraps the whole Virtual Environement and provide an easy to use API for
people who want to build standard worlds.

In main.js, this class should be used the following way:

const VE = new StdEnv();
function init() { 
    VE.init("path/to/terrain.glb"); 
    // .. other stuff for the webpage
}

function animate() {
    VE.update();
    // .. other stuff
}

init();
animate();


Other usages should be like:
    to change the graphic tier:
    VE.setGraphicsSetting(graphicTier);
    VE.increaseGraphicSettings()

    for events on control lock and unlock
    VE.controls.addEventListener('lock', function() { .. do stuff });
    VE.controls.addEventListener('unlock', function() { .. do stuff });
    VE.controls.lock();
*/

class StdEnv {
    constructor() {
        this.scene = new THREE.Scene();
        this.init = function(terrainPath, avatarPath, x, y, z) {
            this.graphicTier = localProxy.tier !== undefined ? localProxy.tier : 0;

            // ===== renderer =====
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setPixelRatio(1);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.VSMShadowMap;
            document.body.appendChild(this.renderer.domElement);

            // ===== scene =====
            const scene = this.scene;
            this.scene.background = new THREE.Color(0x69e6f4);
            this.scene.fog = new THREE.Fog(0x69e6f4, 1600, 2000);

            // ===== camera =====
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            this.camera.position.y = 1.6;
            this.camera.lookAt(0, 1.7, -1);
            this.dummyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            this.dummyCamera.position.y = 1.6;
            this.dummyCamera.lookAt(0, 1.7, -1);

            // ===== lights =====
            const light = new THREE.HemisphereLight(0xffeeff, 0x777788, 1);
            light.position.set(0.5, 1, 0.75);
            this.scene.add(light);

            if (this.graphicTier !== LOW) {
                shadowLight = new DefaultDirectionalLight(this.graphicTier);
                this.scene.add(shadowLight);
                this.scene.add(shadowLight.target);
            }

            // ===== shaders =====
            this.composer = new DefaultComposer(this.renderer, this.scene, this.camera);

            // ===== load the terrain =====
            function onProgress(xr) { /* console.log((xr.loaded / xr.total) * 100)*/ }

            function onError(e) { console.log(e) };

            const loader = new GLTFLoader();
            loader.load(terrainPath, (object) => {
                object.scene.position.set(x, y, z);
                object.scene.traverse(object => {
                    if (object.isMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                        object.material.roughness = 1;
                        if (object.material.map) {
                            object.material.map.anisotropy = 16;
                            object.material.map.needsUpdate = true;
                        }
                        const cloned = new THREE.Mesh(object.geometry, object.material);
                        object.getWorldPosition(cloned.position);
                        //object.updateMatrixWorld();
                        if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                            /* object.updateMatrixWorld();
                                cloned.matrix.copy(object.matrixWorld);*/
                            bloomScene.attach(cloned);
                        }
                    }
                    if (object.isLight) {
                        object.parent.remove(object);
                    }
                });
                scene.add(object.scene);
                let geometries = [];
                object.scene.traverse(object => {
                    if (object.geometry && object.visible) {
                        const cloned = object.geometry.clone();
                        cloned.applyMatrix4(object.matrixWorld);
                        for (const key in cloned.attributes) {
                            if (key !== 'position') { cloned.deleteAttribute(key); }
                        }
                        geometries.push(cloned);
                    }
                });
                const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
                mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
                collider = new THREE.Mesh(mergedGeometry);
                collider.material.wireframe = true;
                collider.material.opacity = 0.5;
                collider.material.transparent = true;
                collider.visible = false;
                scene.add(collider);

                const visualizer = new MeshBVHVisualizer(collider, 10);
                visualizer.visible = false;
                visualizer.update();
                scene.add(visualizer);
            });
            this.entities = [];
            // ===== player =====
            this.player = new PlayerLocal('glb/animation.glb', avatarPath, this.scene);
            window.player = this.player;
            this.scene.add(this.player);

            // ===== controls =====
            this.controls = new PointerLockControls(this.dummyCamera, document.body);
            this.controls.sensitivityY = 0.002;
            this.scene.add(this.controls.getObject());

            document.addEventListener('keydown', (event) => {
                if (event.key === "v") {
                    if (this.targetControlVector === this.thirdPersonControls) {
                        this.targetControlVector = this.fpsControls;
                        this.controls.sensitivityY = -0.002;
                    } else {
                        this.targetControlVector = this.thirdPersonControls;
                        this.controls.sensitivityY = 0.002;
                    }
                }
                this.player.keys[event.key] = true;
            });
            document.addEventListener('keyup', (event) => {
                this.player.keys[event.key] = false;
            });

            window.addEventListener('keydown', (e) => {
                if (e.keyCode === 32 && e.target === document.body) {
                    e.preventDefault();
                }
            });

            // ===== graphic settings =====
            this.setGraphicsSetting(this.graphicTier);

        } // -- end init

        this.setShadowLightTier = function(graphicTier) {
            if (shadowLight) {
                this.scene.remove(shadowLight.target);
                this.scene.remove(shadowLight);
                shadowLight.dispose();
                shadowLight.shadow.dispose();
            }

            if (graphicTier !== LOW) {
                shadowLight = new DefaultDirectionalLight(this.graphicTier);
                this.scene.add(shadowLight);
                this.scene.add(shadowLight.target);
            } else {
                shadowLight = undefined;
            }
        }

        this.setGraphicsSetting = function(graphicTier) {
            this.graphicTier = graphicTier;
            this.setShadowLightTier(graphicTier);
            this.composer.setGraphicsSetting(graphicTier, this.renderer, this.scene);
        }

        this.increaseGraphicSettings = function() {
            this.graphicTier += 1;
            this.graphicTier %= 4;
            localProxy.tier = this.graphicTier;
            this.setGraphicsSetting(this.graphicTier)
        }

        this.spawnOtherPlayer = function(avatarPath){ }

        this.getLocation = () => { }

        this.moveOtherPlayer = (x,y,z) => { }

        this.cameraPosition = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();
        this.fpsControls = new THREE.Vector4(0.01, Math.PI - 0.01, 0.01, 1);
        this.thirdPersonControls = new THREE.Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 40, 0.2);
        this.controlVector = this.thirdPersonControls.clone();
        this.targetControlVector = this.thirdPersonControls;
    } // -- end constructor

    update() {
        const delta = Math.min(clock.getDelta(), 0.1);
        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
        if (collider) {
            
            const controlVector = this.controlVector;
            this.controls.minPolarAngle = controlVector.x;
            this.controls.maxPolarAngle = controlVector.y;
            
            for (let i = 0; i < 5; i++) {
                this.player.update(delta / 5, this.dummyCamera, collider, this.entities, frustum, this.dummyCamera, controlVector);
                this.camera.position.copy(this.player.position);
                this.entities.forEach(entity => {
                    entity.update(delta / 5, frustum);
                })
            }
            
            //this.camera.position.y += 10;
            this.camera.position.copy(this.player.position);
            const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
            this.camera.position.add(dir.multiplyScalar(controlVector.z));
            this.camera.lookAt(this.player.position);
            const invMat = new THREE.Matrix4();
            const raycaster = new THREE.Raycaster(this.player.position.clone(), this.camera.position.clone().sub(this.player.position.clone()).normalize());
            invMat.copy(collider.matrixWorld).invert();
            raycaster.ray.applyMatrix4(invMat);
            const hit = collider.geometry.boundsTree.raycastFirst(raycaster.ray);
            if (hit) {
                this.camera.position.copy(this.player.position);
                const dir = this.dummyCamera.getWorldDirection(new THREE.Vector3());
                this.camera.position.add(dir.multiplyScalar(Math.min(hit.point.distanceTo(this.player.position), controlVector.z * 1.25) * 0.8));
                this.camera.lookAt(this.player.position);
            }
            this.cameraPosition.lerp(this.camera.position, controlVector.w);
            this.cameraTarget.lerp(this.player.position, controlVector.w);
            this.camera.position.copy(this.cameraPosition);
            this.camera.lookAt(this.cameraTarget);
            this.controlVector.lerp(this.targetControlVector, 0.1);
        }
        this.scene.fog.needsUpdate = true;

        if (this.graphicTier !== LOW) {
            shadowLight.update(this.camera);
        }
        this.composer.update(this.camera);
        if (this.graphicTier > LOW) {
            this.renderer.setRenderTarget(this.composer.defaultTexture);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(this.composer.bloomTexture);
            this.renderer.clear();
            this.renderer.render(bloomScene, this.camera);
        }

        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.composer.render();
    }

}

export { StdEnv };