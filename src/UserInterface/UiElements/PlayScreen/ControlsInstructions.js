import { UiElement } from "../UiElement.js";

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
            }
        })

        this.appendChild( new UiElement({
            id: "ControlsDisplayBox",
            style: {
                background: "rgba(0, 0, 0, 0.2)",
                padding: "2px",
                border: "1px solid rgba(256, 256, 256, 0.3)"
            },
            innerHTML: "<b>WASD</b> move, <b>SHIFT</b> run, <b>SPACE</b> jump, <b>V</b> view, <b>R</b> respawn",
            parent: parent
        }));
    }
}

export { ControlsInstructions };