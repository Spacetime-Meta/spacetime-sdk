import { UiElement } from "../../UiElement.js"

export class Blocker extends UiElement {
    constructor(){
        super({
            id: "blocker",
            style: {
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "16px",
                color: "white",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "rgba(0, 0, 0, 0.3)",
                fontSize: "large"
            },
            innerHTML: "Click to play",
            onClick: () => {
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsLock();
            },
        });

        this.element.addEventListener("touchstart", () => {

            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.isTouchScreen = true;
            console.log(`%c [UI Controller] Touch screen detected.`, 'color:#bada55');

        });
    }
}