import { UiElement } from "../../../../../../UiElement.js";

import { GoLiveDisplay } from "./MultiplayerPanelElements/GoLiveDisplay/GoLiveDisplay.js"

class MultiplayerPanel extends UiElement {
    constructor(){
        super({
            id: "MultiplayerPanel",
            style: {
                display: "none",
                height: "100%"
            }
        })

        this.goLiveDisplay = new GoLiveDisplay(()=>this.handleGoLive());

        this.appendChild(this.goLiveDisplay)
    }

    handleGoLive() {
        VIRTUAL_ENVIRONMENT.remoteController.createPeerWithId(this.goLiveDisplay.peerIdInput.element.value);
        this.goLiveDisplay.element.style.display = "none";
    }
}
export { MultiplayerPanel }