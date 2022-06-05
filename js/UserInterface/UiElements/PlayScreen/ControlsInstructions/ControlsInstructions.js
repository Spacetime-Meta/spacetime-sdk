import { UiElement } from "../../UiElement.js";

import { ControlsDisplayBox } from "./ControlsInstructionsElements/ControlsDisplayBox.js"

class ControlsInstructions extends UiElement {
    constructor(parent) {
        super({
            id: "ControlInstructions",
            style: {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                color: "rgba(256, 256, 256, 0.8)",
                display: "flex",
                justifyContent: "center",
                fontSize: "x-small"
            },
            parent: parent,
        })

        this.controlsDisplayBox = new ControlsDisplayBox(this.element)
    }
}

export { ControlsInstructions };