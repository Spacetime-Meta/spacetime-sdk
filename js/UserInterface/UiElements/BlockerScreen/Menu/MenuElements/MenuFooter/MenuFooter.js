import { UiElement } from "../../../../UiElement.js";

class MenuFooter extends UiElement {
    constructor() {
        super({
            id: "MenuFooter",
            style: {
                background: "#383838",
                textAlign: "center",
                height: "30px",
                transition: "all 0.5s ease",
                overflow: "hidden",
                position: "absolute",
                bottom: "0",
                width: "350px"
            },
            
        })

        this.textInfo = new UiElement({
            innerHTML: "Not Connected",
            style: {
                color: "white"
            }
        })

        this.disconnectButton = new UiElement({
            innerHTML: "Disconnect",
            style: {
                padding: "20px",
                margin: "20px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "radial-gradient(circle, rgba(256,235,235,1) 0%, rgba(256,215,215,1) 48%, rgba(256,230,230,1) 100%)",
                boxShadow: "0 2px 2px #ff8888",
                textAlign: "center",
                cursor: "pointer"
            },
            hover: {
                background: "#ffc8c8"
            },
            onClick: ()=>{
                VIRTUAL_ENVIRONMENT.remoteController.peer.destroy();
                delete VIRTUAL_ENVIRONMENT.remoteController.peer;
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.multiplayerPanel.update();
            }
        })

        this.appendChildList([
            this.textInfo,
            this.disconnectButton
        ])

        this.element.addEventListener("mouseenter", ()=>{
            if(typeof VIRTUAL_ENVIRONMENT.remoteController.peer !== "undefined"){
                this.element.style.height = "150px";
            }
        })

        this.element.addEventListener("mouseleave", ()=>{
            this.element.style.height = "30px";
        })
    }

    update() {
        if(typeof window.VIRTUAL_ENVIRONMENT.remoteController.peer !== "undefined"){
            this.textInfo.element.innerHTML = "Connected as: " + window.VIRTUAL_ENVIRONMENT.remoteController.peer.id;
        } else {
            this.textInfo.element.innerHTML = "Not Connected";
        }
    }
}
export { MenuFooter }