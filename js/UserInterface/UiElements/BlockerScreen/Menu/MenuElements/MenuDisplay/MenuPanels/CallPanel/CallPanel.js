import { UiElement } from "../../../../../../UiElement.js";
import { CameraBox } from "./CallPanelElements/CameraBox.js";
import { EndCallButton } from "./CallPanelElements/EndCallButton.js";

class CallPanel extends UiElement {
    constructor(){
        super({
            id: "CallPanel",
            style: { 
                height: "100%",
                display: "none"
            }
        })

        this.element.className = "call-panel";

        this.endCallButton = new EndCallButton();

        this.appendChildList([
            this.endCallButton
        ])

        window.CALL_PANEL = this;
    }

    addCameraBox(peerId, stream) {
        this.appendChild(new CameraBox(peerId, stream));
    }
}
export { CallPanel }