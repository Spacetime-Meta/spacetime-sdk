import { Goal } from "./Goal.js";
import { IdleState } from "../states/IdleState.js";
import { TargetState } from "../states/TargetState.js";
import { IdleGoal } from "./IdleGoal.js";
class TargetGoal extends Goal {
    constructor(memory) {
        super(memory);
    }
    init(agent) {
        agent.setState(new TargetState({ target: this.memory.target }));
    }
    update(agent) {
        this.memory.time -= agent.delta;
        if (this.memory.time < 0) {
            agent.setGoal(new IdleGoal({
                excitementDistance: 100,
                excitementChancePlayer: 0.0005,
                excitementChanceEntity: 0.001
            }));
        }
        if (agent.state instanceof TargetState) {
            if (agent.position.distanceTo(this.memory.target) < this.memory.targetDistance) {
                agent.setState(new IdleState({}));
            }
        }
        if (agent.state instanceof IdleState) {
            if (agent.position.distanceTo(this.memory.target) > this.memory.targetDistance) {
                agent.setState(new TargetState({ target: this.memory.target }));
            }
        }
    }
}
export { TargetGoal };