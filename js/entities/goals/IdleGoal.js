import { Goal } from "./Goal.js";
import { IdleState } from "../states/IdleState.js";
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.135.0-pjGUcRG9Xt70OdXl97VF/mode=imports/optimized/three.js';
import { MoveToState } from "../states/MoveToState.js";
import { TargetGoal } from "./TargetGoal.js";
class IdleGoal extends Goal {
    constructor(memory) {
        super(memory);
    }
    init(agent) {
        agent.setState(new IdleState({}));
    }
    update(agent) {
        if (agent.state instanceof IdleState) {
            if (Math.random() < 0.001) {
                const invMat = new THREE.Matrix4();
                const target = new THREE.Vector3(agent.position.x + Math.random() * 200 - 100, agent.position.y, agent.position.z + Math.random() * 200 - 100);
                const raycaster = new THREE.Raycaster(agent.position, target.clone().sub(agent.position));
                invMat.copy(agent.collider.matrixWorld).invert();
                raycaster.ray.applyMatrix4(invMat);
                const hit = agent.collider.geometry.boundsTree.raycastFirst(raycaster.ray);
                let blocked;
                if (hit) {
                    hit.point.applyMatrix4(agent.collider.matrixWorld);
                    if (hit.point.distanceTo(agent.position) < target.distanceTo(agent.position)) {
                        blocked = true;
                    }
                }
                if (!blocked) {
                    agent.setState(new MoveToState({ target }));
                }
            }
        }
        if (agent.state instanceof MoveToState) {
            if (agent.state.memory.finished || Math.random() < 0.0001) {
                agent.setState(new IdleState({}));
            }
        }
        if (agent.position.distanceTo(player.position) < this.memory.excitementDistance) {
            if (Math.random() < this.memory.excitementChancePlayer) {
                agent.setGoal(new TargetGoal({
                    target: player.position,
                    targetDistance: 20 + 15 * Math.random(),
                    time: Math.random() * 5 + 3
                }));
            }
        }
        agent.entities.forEach(entity => {
            if (agent.position.distanceTo(entity.position) < this.memory.excitementDistance) {
                if (Math.random() < this.memory.excitementChanceEntity && entity.goal instanceof IdleGoal) {
                    agent.setGoal(new TargetGoal({
                        target: entity.position,
                        targetDistance: 20 + 15 * Math.random(),
                        time: Math.random() * 5 + 3
                    }));
                }
            }
        })
    }
}
export { IdleGoal };