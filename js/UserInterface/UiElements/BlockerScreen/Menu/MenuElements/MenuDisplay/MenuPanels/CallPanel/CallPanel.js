import { UiElement } from "../../../../../../UiElement.js";
import { CameraBox } from "./CallPanelElements/CameraBox.js";
import { EndCallButton } from "./CallPanelElements/EndCallButton.js";

class CallPanel extends UiElement {
    constructor(){
        super({
            id: "CallPanel",
            style: { 
                height: "100%",
                display: "none",
            }
        })

        this.element.className = "call-panel";

        this.endCallButton = new EndCallButton();
        this.camera = new UiElement({
            style: {
                height: "80%",
                overflow: 'scroll',
                overflowX: 'hidden',
            }
        })

        this.appendChildList([
            this.endCallButton,
            this.camera
        ])
    }

    addCameraBox(peerId, stream) {
        let cameraBox = document.getElementById("camera-screen-" + peerId);
        if(!cameraBox) this.camera.appendChild(new CameraBox(peerId, stream));
    }

    closeCameraBox(peerId) {
        let cameraBox = document.getElementById("camera-screen-" + peerId);
        if(cameraBox) cameraBox.remove();
    }
}
export { CallPanel }