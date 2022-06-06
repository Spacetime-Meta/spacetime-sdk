import { UiElement } from "../../../../UiElement.js";

class MenuFooter extends UiElement {
    constructor() {
        super({
            id: "MenuFooter",
            style: {
                background: "#383838",
                color: "white",
                textAlign: "center",
            },
            innerHTML: "Not Connected"
        })
    }

    update() {
        if(typeof VIRTUAL_ENVIRONMENT.remoteController.peer !== "undefined"){
            const peerID = VIRTUAL_ENVIRONMENT.remoteController.peer.id;
            if(peerID !== this.element.innerHTML) {
                this.element.innerHTML = "Connected as: " + peerID;
            }
        } else {
            this.element.innerHTML = "Not Connected";
        }
    }
}
export { MenuFooter }