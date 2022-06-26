import { UiElement } from "../../UiElement.js";

import { GoLiveDisplay } from "./MultiplayerPanelElements/GoLiveDisplay/GoLiveDisplay.js"
import { ConnectionsManagementDisplay } from "./MultiplayerPanelElements/ConnectionsDisplay/ConnectionsDisplay.js"

class MultiplayerPanel extends UiElement {
    constructor(){
        super({
            id: "MultiplayerPanel",
            style: {
                display: "none",
                height: "100%",
                paddingTop: "25px",
            }
        })

        this.goLiveDisplay = new GoLiveDisplay(()=>this.handleGoLive());
        this.connectionsManagementDisplay = new ConnectionsManagementDisplay();

        this.appendChildList([
            this.goLiveDisplay,
            this.connectionsManagementDisplay
        ])
    }

    handleGoLive() {
        const inputValue = this.goLiveDisplay.inputs.peerIdInput.element.value
        if(inputValue !== "") {
            VIRTUAL_ENVIRONMENT.remoteController.createPeerWithId(inputValue);
        }
    }

    update() {
        if(typeof VIRTUAL_ENVIRONMENT.remoteController.peer !== "undefined") {
            this.goLiveDisplay.element.style.display = "none";
            this.connectionsManagementDisplay.element.style.display = "block";
        } else {
            this.goLiveDisplay.element.style.display = "flex";
            this.connectionsManagementDisplay.element.style.display = "none";
        }
    }
}
export { MultiplayerPanel }