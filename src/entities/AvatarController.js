import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadingBar } from '../UserInterface/UiElements/LoadingPage/loadingPage.js';

class AvatarController extends THREE.Object3D {
    constructor() {
        super();
        this.isVisible = true;
        this.loader = new GLTFLoader();
        this.animations = {};
        this.quaternion90deg = new THREE.Quaternion();
        this.quaternion90deg.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), -Math.PI / 2 );
    }

    executeConfig(config) {
        this.spawnAvatar(config.default);
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.avatarPanel.addNewAvatarButton(config.default);

        if(config.others) {
            config.others.forEach(avatar => {
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.avatarPanel.addNewAvatarButton(avatar);
            })
        }
    }

    spawnAvatar(params) {
        this.loadAvatar(params, () => this.loadAnimations(params.animations, params.mapping));
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

    changeAvatar(params) {
        console.log(`%c [Avatar Controller] Loading new avatar: ${params.name}`, 'color:#bada55');
        this.loadAvatar(params, () => this.loadAnimations(params.animations, params.mapping));
    }

    loadAvatar(params, loadAnimation) {

        if(params.offset) {
            this.offset = params.offset;
        } else {
            this.offset = 1.75;
        }
        

        this.loader.load(params.mesh, (responseObject) => {
            
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.model)

            this.radius = 0.25;
            this.size = 1.5;

            this.model = responseObject.scene;
            this.model.scale.set(params.scaleFactor, params.scaleFactor, params.scaleFactor);
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
        this.model.position.y -= this.offset;//1.75;//this.size;
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