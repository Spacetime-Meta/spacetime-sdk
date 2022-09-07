import { UiElement } from "../../UiElement.js";
import { GoLiveDisplay } from "./PeerToPeerPanelElements/GoLiveDisplay/GoLiveDisplay.js"
import { ConnectionsManagementDisplay } from "./PeerToPeerPanelElements/ConnectionsDisplay/ConnectionsDisplay.js"

class PeerToPeerPanel extends UiElement {
    constructor(){
        super({
            id: "PeerToPeerPanel",
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
            VIRTUAL_ENVIRONMENT.peerJsController.createPeerWithId(inputValue);
        }
    }

    update(delta) {
        if(typeof VIRTUAL_ENVIRONMENT.peerJsController.peer !== "undefined") {
            this.goLiveDisplay.element.style.display = "none";
            this.connectionsManagementDisplay.element.style.display = "block";
        } else {
            this.goLiveDisplay.element.style.display = "flex";
            this.connectionsManagementDisplay.element.style.display = "none";
        }
    }
}
export { PeerToPeerPanel }