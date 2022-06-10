import { UiElement } from "../../../UiElement.js";

class ControlsDisplayBox extends UiElement {
    constructor(parent) {
        super({
            id: "ControlsDisplayBox",
            style: {
                background: "rgba(0, 0, 0, 0.2)",
                padding: "2px",
                border: "1px solid rgba(256, 256, 256, 0.3)"
            },
            innerHTML: "<b>WASD</b> move, <b>SHIFT</b> run, <b>SPACE</b> jump, <b>V</b> view",
            parent: parent
        })
    }
}

export { ControlsDisplayBox };