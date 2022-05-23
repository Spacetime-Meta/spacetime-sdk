import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import * as SkeletonUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/SkeletonUtils.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

function angleDifference(angle1, angle2) {
    const diff = ((angle2 - angle1 + Math.PI) % (Math.PI * 2)) - Math.PI;
    return (diff < -Math.PI) ? diff + (Math.PI * 2) : diff;
}

class AvatarController extends THREE.Object3D {
    constructor(animationURL, avatarURL, scene) {
        super();
        this.scene = scene;
        this.animations = {};
        this.quaternion90deg = new THREE.Quaternion();
        this.quaternion90deg.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), Math.PI / 2 );
        
        this.loadAvatar(avatarURL, () => this.loadAnimations(animationURL));
    }

    get animations() {
        return this._animations;
    }

    set animations(newAnimations) {
        this._animations = newAnimations;
    }

    play(anim, time = 0.5) {
        if (anim === this.current) {
            return;
        }
        if (performance.now() - this.lastChange < 250) {
            return;
        }
        this.lastChange = performance.now();
        if (this.current !== "none") {
            this.animations[this.current].fadeOut(time);
        }
        this.current = anim;
        if (this.current !== "none") {
            this.animations[this.current].enabled = true;
            this.animations[this.current].reset();
            this.animations[this.current].fadeIn(time);
            this.animations[this.current].play();
        }
    }

    update(delta, frustum, position, horizontalVelocity, anim, time = 0.5) {
        
        if(typeof this.box !== 'undefined') {
            this.updateBox();
            
            this.position.copy(position);
            this.updateFacingDirection(horizontalVelocity)
        
            this.play(anim, time);

            if (!frustum.intersectsBox(this.box)) {
                this.model.visible = false;
            } else {
                this.model.visible = true;
                this.mixer.update(delta);
            }

            this.model.traverse(child => {
                if (child.isMesh) {
                    child.material.opacity = this.opacity;
                    if (this.opacity < 1) {
                        child.material.transparent = true;
                    }
                    child.material.needsUpdate = true;
                    if (this.opacity < 0.1) {
                        child.material.depthWrite = false;
                    } else {
                        child.material.depthWrite = true;
                    }
                }
            })
        }
    }

    changeAvatar(avatarUrl, animationsUrl) {
        this.loadAvatar(avatarUrl, () => this.loadAnimations(animationsUrl));
    }

    updateBox() {
        this.box.setFromPoints([
            new THREE.Vector3(this.position.x + this.radius, this.position.y, this.position.z + this.radius),
            new THREE.Vector3(this.position.x - this.radius, this.position.y - this.size - this.radius, this.position.z - this.radius),
        ]);
    }

    loadAvatar(avatarURL, loadAnimation) {
        const loader = new GLTFLoader();
        loader.load(avatarURL, (responseObject) => {
            
            this.scene.remove(this.model)

            this.radius = 2.5;
            this.size = 30;

            this.model = responseObject.scene;
            this.model.scale.set(0.2, 0.2, 0.2);
            this.model.traverse(child => {
                if (child.isMesh) {
                    child.geometry = child.geometry.clone();
                    child.material = new THREE.MeshStandardMaterial({ color: child.material.color, transparent: true, roughness: child.material.roughness, metalness: child.material.metalness, map: child.material.map, normalMap: child.material.normalMap });
                }
            })
            this.model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                }
            });
            this.scene.add(this.model);
            loadAnimation(); 
        });
    }

    loadAnimations(animationURL) {
        const loader = new GLTFLoader();
        loader.load(animationURL, (gltf) => {
            if(typeof this.model == 'undefined') return;
            this.current = "none";
            this.animations = {
                "idle": gltf.animations[2],
                "walk": gltf.animations[1],
                "run": gltf.animations[3],
                "jump": gltf.animations[4],
                "fall": gltf.animations[5]
            };
            this.mixer = new THREE.AnimationMixer(this.model);
            Object.entries(this.animations).forEach(([anim, clip]) => {
                this.animations[anim] = this.mixer.clipAction(clip);
            });
            this.lastChange = performance.now() - 250;
            this.animations.jump.loop = THREE.LoopPingPong;
            this.scene.add(this.model);
            this.delta = 0;
            this.box = new THREE.Box3();
            this.updateBox();
            this.play("idle", 0);
            this.jumpTick = 0;
            this.opacity = 1;
        });
    }

    updateFacingDirection(horizontalVelocity) {
        this.lookAt(this.position.x + horizontalVelocity.x, 0, this.position.z + horizontalVelocity.z)
        this.quaternion.multiply(this.quaternion90deg)

        this.model.position.copy(this.position);
        this.model.position.y -= this.size / 2 + 1.25;
        this.model.quaternion.copy(this.quaternion);
    }
}

export { AvatarController };