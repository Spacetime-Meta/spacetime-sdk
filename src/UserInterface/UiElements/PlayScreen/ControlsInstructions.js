import { UiElement } from "../UiElement.js";

const INSTRUCTIONS = {
    DESKTOP: "<b>WASD</b> move, <b>SHIFT</b> run, <b>SPACE</b> jump, <b>V</b> view, <b>R</b> respawn",
    MOBILE: "Use <b>Joystick/Scroll</b> to move around"
}

class ControlsInstructions extends UiElement {
    constructor() {
        super({
            id: "ControlInstructions",
            style: {
                position: "absolute",
                top: "5px",
                left: "0",
                width: "100%",
                color: "rgba(256, 256, 256, 0.8)",
                display: "flex",
                justifyContent: "center",
                fontSize: "x-small"
            }
        })

        this.controlsDisplayBox = new UiElement({
            id: "ControlsDisplayBox",
            style: {
                background: "rgba(250,250,250,0.2)",
                borderRadius: "5px",
                padding: "10px",
            },
            innerHTML: INSTRUCTIONS.DESKTOP,
        })

        this.appendChild(this.controlsDisplayBox);
    }

    setMobileInstructions() {
        this.controlsDisplayBox.element.innerHTML = INSTRUCTIONS.MOBILE;
    }
}

export { ControlsInstructions };