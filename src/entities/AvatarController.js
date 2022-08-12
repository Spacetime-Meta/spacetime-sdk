import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadingBar } from '../UserInterface/UiElements/LoadingPage/loadingPage.js';

const DEFAULT_AVATAR_PATH = 'https://elegant-truffle-070d6b.netlify.app/vanguard.glb';
const DEFAULT_ANIMATION_PATH = 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb';
const DEFAULT_ANIMATION_MAPPING = { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 };

class AvatarController extends THREE.Object3D {
    constructor() {
        super();
        this.isVisible = true;
        this.loader = new GLTFLoader();
        this.animations = {};
        this.quaternion90deg = new THREE.Quaternion();
        this.quaternion90deg.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), -Math.PI / 2 );
    }

    spawnAvatar(params) {
        params.avatarPath = typeof params.avatarPath === "undefined" ? DEFAULT_AVATAR_PATH : params.avatarPath;
        params.animationPath = typeof params.animationPath === "undefined" ? DEFAULT_ANIMATION_PATH : params.animationPath;
        params.animationMapping = typeof params.animationMapping === "undefined" ? DEFAULT_ANIMATION_MAPPING : params.animationMapping;
        this.loadAvatar(params.avatarPath, () => this.loadAnimations(params.animationPath, params.animationMapping));
    }

    play(anim, time = 0.5) {
        
        if (anim !== this.current && (performance.now() - this.lastChange) >= 250) {
            this.lastChange = performance.now();
            
            if (this.current !== "none" && typeof this.animations[this.current] !== 'undefined') {
                this.animations[this.current].fadeOut(time);
            }
            
            this.current = anim;
            if(typeof this.animations[this.current] !== 'undefined'){
                this.animations[this.current].enabled = true;
                this.animations[this.current].reset();
                this.animations[this.current].fadeIn(time);
                this.animations[this.current].play();
            }
            
            
        }
    }

    setTransparency(setTo) {
        if(setTo) {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.model);
            
        } else {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.model);
        }
        this.isVisible = !setTo;
    }

    changeAvatar(avatarUrl, animationsUrl, animationMapping) {
        this.loadAvatar(avatarUrl, () => this.loadAnimations(animationsUrl, animationMapping));
    }

    loadAvatar(avatarURL, loadAnimation) {
        this.loader.load(avatarURL, (responseObject) => {
            
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.model)

            this.radius = .25;
            this.size = 1.5;

            this.model = responseObject.scene;
            this.model.scale.set(0.01, 0.01, 0.01);
            this.model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                }
            });
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.model);
            loadAnimation(); 
        });
    }

    removeAvatar(){
        VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.model);
    }

    loadAnimations(animationURL, animationMapping) {
        this.loader.load(animationURL, (gltf) => {
            if(typeof this.model == 'undefined') return;
            this.current = "none";
            this.animations = {
                "walk": gltf.animations[animationMapping.walk],
                "idle": gltf.animations[animationMapping.idle],
                "run": gltf.animations[animationMapping.run],
                "jump": gltf.animations[animationMapping.jump],
                "fall": gltf.animations[animationMapping.fall]
            };
            this.mixer = new THREE.AnimationMixer(this.model);
            Object.entries(this.animations).forEach(([anim, clip]) => {
                this.animations[anim] = this.mixer.clipAction(clip);
            });
            this.lastChange = performance.now() - 250;
            this.delta = 0;
            this.play("idle", 0);
        });
    }

    updateFacingDirection(horizontalVelocity) {
        if(horizontalVelocity.length() > 0.001){
            this.lookAt(this.position.x + horizontalVelocity.x, this.position.y + this.size / 2 + this.radius , this.position.z + horizontalVelocity.z);
            this.quaternion.multiply(this.quaternion90deg)
        }

        this.model.position.copy(this.position);
        this.model.position.y -= this.size / 2;
        this.model.quaternion.copy(this.quaternion);
    }
    
    update(delta, position, horizontalVelocity, anim, time = 0.5) {
        
        // use the mixer as only signal that everything is properly loaded
        if(this.mixer && this.isVisible){

            // set position of the avatar
            this.position.copy(position);

            this.updateFacingDirection(horizontalVelocity);

            this.play(anim, time);
            this.mixer.update(delta); 
        } 
    }
}

export { AvatarController };