import { UiElement } from "../UiElement.js";

import { ControlsInstructions } from "./ControlsInstructions.js";
import { TimerBox } from "./TimerBox.js";

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

        this.controlsInstructions = new ControlsInstructions();
        this.appendChild(this.controlsInstructions);

        document.body.appendChild(this.element);        
    }

    setupTimerBox() {
        if(typeof this.timerBox === "undefined") {
            this.timerBox = new TimerBox();
            this.appendChild(this.timerBox);
        }
    }

    setupMobileDisplay() {
        // change the controls instructions
        this.controlsInstructions.setMobileInstructions();

        // create a jump button
        this.jumpButton = new UiElement({
            id: "jump-button",
            innerHTML: "jump",
            style: {
                position: "absolute",
                bottom: "60px",
                right: "10px",
                background: "rgba(250,250,250,0.2)",
                borderRadius: "5px",
                padding: "10px",
                color: "white"
            },
        });

        this.jumpButton.element.addEventListener("touchstart", () => {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.isJumping = true;
        })

        this.jumpButton.element.addEventListener("touchend", () => {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.isJumping = false;
        })

        this.appendChild(this.jumpButton);

        // create a back to menu button
        this.appendChild( new UiElement({
            id: "backToMenu",
            innerHTML: "☰",
            style: {
                position: "absolute",
                top: "5px",
                left: "5px",
                background: "rgba(250,250,250,0.2)",
                borderRadius: "5px",
                padding: "10px",
                color: "white"
            },
            onClick: () => {
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsUnlock();
            }
        }));
    }
}
export { PlayScreen }