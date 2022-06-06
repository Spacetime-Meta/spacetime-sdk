import { UiElement } from "../../../../UiElement.js";
import localProxy from "../../../../../../util/localProxy.js";

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
            if(localProxy.peerId !== this.element.innerHTML) {
                this.element.innerHTML = "Connected as: " + localProxy.peerId;
            }
        }
    }
}
export { MenuFooter }