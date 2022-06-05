import { UiElement } from "../UiElement.js";
import { ControlsInstructions } from "./ControlsInstructions/ControlsInstructions.js";

class PlayScreen extends UiElement {
    constructor() {
        super({
            id: "playScreen",
            style: {
                position: "absolute",
                top: "0",
                width: "100%",
                height: "100%",
                display: "none",
            }
        })

        document.body.appendChild(this.element);

        this.controlsInstructions = new ControlsInstructions(this);
    }
}
export { PlayScreen }