import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import * as SkeletonUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/SkeletonUtils.js';
import Controller from "./animation/Controller.js";

function angleDifference(angle1, angle2) {
    const diff = ((angle2 - angle1 + Math.PI) % (Math.PI * 2)) - Math.PI;
    return (diff < -Math.PI) ? diff + (Math.PI * 2) : diff;
}

class PlayerAvatar extends THREE.Object3D {
    constructor(radius, size, model, animations, {
        scene,
        entities
    }) {
        super();
        this.size = size;
        this.radius = radius;
        this.model = SkeletonUtils.clone(model);
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
        this.mixer = new THREE.AnimationMixer(this.model);
        this.animations = animations;
        this.controller = new Controller(this.mixer, this.animations);
        this.controller.animations.jump.loop = THREE.LoopPingPong;
        this.scene = scene;
        this.scene.add(this.model);
        this.delta = 0;
        this.box = new THREE.Box3();
        this.updateBox();
        this.positionChange = new THREE.Vector3();
        this.controller.play("idle", 0);
        this.jumpTick = 0;
        this.opacity = 1;
    }
    update(delta, frustum, fpsCamera) {
        this.delta = delta;
        this.updateBox();
        this.model.position.copy(this.position);
        // this.model.position.y -= (this.size) / 2 - this.radius / 2;
        this.model.position.y -= this.size / 2 + 1.25;
        const dir = fpsCamera.getWorldDirection(new THREE.Vector3());
        if (this.positionChange) {
            const viewDir = Math.atan2(dir.x, dir.z) + Math.PI;
            const moveDir = Math.atan2(this.positionChange.x, this.positionChange.z);
            this.model.rotation.y = viewDir + angleDifference(viewDir, moveDir) * Math.min(Math.hypot(this.positionChange.x, this.positionChange.z), 1);
        } else {
            this.model.rotation.y = Math.atan2(dir.x, dir.z) + Math.PI;
        }
        if (!frustum.intersectsBox(this.box)) {
            this.model.visible = false;
        } else {
            this.model.visible = true;
            this.mixer.update(delta);
        }
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();
        const changeMag = Math.hypot(this.positionChange.x, this.positionChange.z);
        if (player.jumped > 0 && this.jumpTick === 0) {
            this.controller.play("jump", 0.25);
        } else {
            if (this.positionChange.y < -0.25 && !player.groundBelow) {
                this.controller.play("fall", 0.25);
            } else {
                if ((this.controller.current !== "jump" || this.jumpTick > 1) && !player.keys[" "]) {
                    if (player.keys["w"] || player.keys["s"] || player.keys["a"] || player.keys["d"]) {
                        this.controller.play("walk");
                    } else {
                        this.controller.play("idle");
                    }
                }
            }
        }
        if (this.controller.current === "jump") {
            this.jumpTick += delta;
        } else {
            this.jumpTick = 0;
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
                //child.material.color = new THREE.Color(1.0, 0.0, 0.0);
            }
        })
    }
    updateBox() {
        this.box.setFromPoints([
            new THREE.Vector3(this.position.x + this.radius, this.position.y, this.position.z + this.radius),
            new THREE.Vector3(this.position.x - this.radius, this.position.y - this.size - this.radius, this.position.z - this.radius),
        ]);
    }
}

export { PlayerAvatar };