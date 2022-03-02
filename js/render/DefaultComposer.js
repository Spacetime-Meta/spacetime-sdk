import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

import { EffectComposer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/FilmPass.js';
import { SMAAPass } from 'https://unpkg.com/three@0.137.0/examples/jsm/postprocessing/SMAAPass.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/shaders/FXAAShader.js';

import { BloomShader } from "./BloomShader.js";
import { BoxBlurShader } from "./BoxBlurShader.js";
import { BloomAddShader } from './BloomAddShader.js';
import { FogShader } from "./FogShader.js";
import { AOShader } from "./AOShader.js";

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;
const ULTRA = 3;

let bloomPass, boxBlur, bloomAddPass, aoPass, fogPass, smaaPass, fxaaPass, filmPass, renderPass, bloomTexture;

class DefaultComposer extends EffectComposer {
    constructor(renderer, scene, camera) {
        super(renderer);

        bloomPass = new(class BloomPass extends ShaderPass {})(BloomShader);
        boxBlur = new(class BlurPass extends ShaderPass {})(BoxBlurShader);
        bloomAddPass = new(class AddPass extends ShaderPass {})(BloomAddShader);
        aoPass = new ShaderPass(AOShader);
        fogPass = new ShaderPass(FogShader);
        fxaaPass = new ShaderPass(FXAAShader);
        // Postprocessing gets rid of MSAA so SMAA is used instead
        smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
        filmPass = new FilmPass(0.05, 0, 0, false);
        renderPass = new RenderPass(scene, camera);
        this.addPass(bloomPass);
        this.addPass(boxBlur);
        this.addPass(bloomAddPass);
        this.addPass(aoPass);
        this.addPass(smaaPass);
        this.addPass(fxaaPass);
        this.addPass(renderPass);
        // Full Scene Render Target

        this.defaultTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter
        });
        this.defaultTexture.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, THREE.FloatType);

        // Bloom Scene (Only Glowing Objects) Render Target
        this.bloomTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter
        });
        this.bloomTexture.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, THREE.FloatType);

        this.setGraphicsSetting = function(tier, renderer, scene) {
            switch (tier) {
                case ULTRA:
                    aoPass.enabled = true;
                    smaaPass.enabled = true;
                    fxaaPass.enabled = false;
                    bloomPass.enabled = true;
                    boxBlur.enabled = true;
                    bloomAddPass.enabled = true;
                    renderPass.enabled = false;
                    renderer.shadowMap.enabled = true;
                    scene.fog.color = new THREE.Color(0x69e6f4);
                    scene.fog.near = 1600;
                    scene.fog.far = 2000;
                    break;

                case HIGH:
                    aoPass.enabled = false;
                    smaaPass.enabled = true;
                    fxaaPass.enabled = false;
                    bloomPass.enabled = true;
                    boxBlur.enabled = true;
                    bloomAddPass.enabled = true;
                    renderPass.enabled = false;
                    renderer.shadowMap.enabled = true;
                    scene.fog.color = new THREE.Color(0.8, 0.8, 0.8);
                    scene.fog.near = 100;
                    scene.fog.far = 1500;
                    break;

                case MEDIUM:
                    aoPass.enabled = false;
                    smaaPass.enabled = false;
                    fxaaPass.enabled = true;
                    bloomPass.enabled = true;
                    boxBlur.enabled = true;
                    bloomAddPass.enabled = true;
                    renderPass.enabled = false;
                    renderer.shadowMap.enabled = true;
                    scene.fog.color = new THREE.Color(0.8, 0.8, 0.8);
                    scene.fog.near = 100;
                    scene.fog.far = 1500;
                    break;

                case LOW:
                    aoPass.enabled = false;
                    smaaPass.enabled = false;
                    fxaaPass.enabled = false;
                    bloomPass.enabled = false;
                    boxBlur.enabled = false;
                    bloomAddPass.enabled = false;
                    renderPass.enabled = true;
                    renderer.shadowMap.enabled = false;
                    scene.fog.color = new THREE.Color(0.8, 0.8, 0.8);
                    scene.fog.near = 100;
                    scene.fog.far = 1500;
                    break;
            }
        }
    }

    update(camera) {
        bloomPass.uniforms["sceneDiffuse"].value = this.defaultTexture.texture;
        bloomPass.uniforms["bloomDiffuse"].value = this.bloomTexture.texture;
        bloomPass.uniforms["sceneDepth"].value = this.defaultTexture.depthTexture;
        bloomPass.uniforms["bloomDepth"].value = this.bloomTexture.depthTexture;
        boxBlur.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        bloomAddPass.uniforms["sceneDiffuse"].value = this.defaultTexture.texture;
        bloomAddPass.uniforms["bloomAmt"].value = 1.0;
        fogPass.uniforms["sceneDepth"].value = this.defaultTexture.depthTexture;
        camera.updateMatrixWorld();
        fogPass.uniforms["projectionMatrixInv"].value = camera.projectionMatrixInverse;
        fogPass.uniforms["viewMatrixInv"].value = camera.matrixWorld;
        fogPass.uniforms["cameraPos"].value = camera.position;
        fogPass.uniforms["time"].value = performance.now() / 1000;
        aoPass.uniforms["sceneDepth"].value = this.defaultTexture.depthTexture;
        aoPass.uniforms["projectionMatrixInv"].value = camera.projectionMatrixInverse;
        aoPass.uniforms["viewMatrixInv"].value = camera.matrixWorld;
        aoPass.uniforms["viewMat"].value = camera.matrixWorldInverse;
        aoPass.uniforms["projMat"].value = camera.projectionMatrix;
        aoPass.uniforms["cameraPos"].value = camera.position;
        aoPass.uniforms["time"].value = performance.now() / 1000;
        aoPass.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    }
}

export { DefaultComposer };