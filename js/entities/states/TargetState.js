import { State } from "./State.js";
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.135.0-pjGUcRG9Xt70OdXl97VF/mode=imports/optimized/three.js';

function angleDifference(angle1, angle2) {
    const diff = ((angle2 - angle1 + Math.PI) % (Math.PI * 2)) - Math.PI;
    return (diff < -Math.PI) ? diff + (Math.PI * 2) : diff;
}
class TargetState extends State {
    constructor(memory) {
        super(memory);
    }
    update(agent) {
        agent.controller.play("walk");
        const target = this.memory.target;
        let toTarget = Math.atan2(target.x - agent.position.x, target.z - agent.position.z);
        agent.entities.forEach(entity => {
            if (entity === agent) {
                return;
            }
            const size = entity.radius + agent.radius;
            if (agent.position.distanceTo(entity.position) < size * 6) {
                const toAvoid = Math.atan2(entity.position.x - agent.position.x, entity.position.z - agent.position.z);
                const factor = Math.min(Math.max(1.0 - ((agent.position.distanceTo(entity.position) - size * 3) / size * 3), 0), 1);
                toTarget += (angleDifference(toAvoid, toTarget) * factor) / 5;
            }
        });
        agent.horizontalVelocity.x += 0.5 * Math.sin(toTarget) * agent.delta;
        agent.horizontalVelocity.z += 0.5 * Math.cos(toTarget) * agent.delta;
        agent.model.rotation.y += angleDifference(agent.model.rotation.y, toTarget) / 50;
    }
}
export { TargetState };