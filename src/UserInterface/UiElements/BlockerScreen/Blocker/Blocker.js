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

        console.log(window.screen.width);
        if(window.screen.width < 425) {
            this.element.innerHTML = "";
            
            this.playButton = new UiElement({
                innerHTML: "Click To Play",
                style: {
                    border: "2px solid black",
                    position: "absolute",
                    top: "150px",
                    right: "-50px",
                    borderRadius: "10px",
                    background: "#078A8C",
                    padding: "15px",
                    transform: "rotate(-90deg)"
                }
            })
            
            this.playButton.element.addEventListener("touchstart", () => {
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.isTouchScreen = true;
                console.log(`%c [UI Controller] Touch screen detected.`, 'color:#bada55');
            });

            this.appendChild(this.playButton)
        }

        this.element.addEventListener("touchstart", () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.isTouchScreen = true;
            console.log(`%c [UI Controller] Touch screen detected.`, 'color:#bada55');
        });


    }
}