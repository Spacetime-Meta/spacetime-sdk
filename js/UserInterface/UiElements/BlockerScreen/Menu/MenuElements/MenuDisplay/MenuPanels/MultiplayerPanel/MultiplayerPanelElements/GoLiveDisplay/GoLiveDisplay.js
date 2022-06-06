import { UiElement } from "../../../../../../../../UiElement.js";

import { GoLiveButton } from "./GoLiveDisplayElements/GoLiveButton.js"
import { PeerIdInput } from "./GoLiveDisplayElements/PeerIdInput.js"

class GoLiveDisplay extends UiElement {
    constructor(onClick) {
        super({
            id: "GoLiveDisplay",
            style: {
                height: "100%"
            }
        })

        this.peerIdInput = new PeerIdInput();
        this.goLiveButton = new GoLiveButton(onClick);

        this.appendChildList([
            this.goLiveButton,
            this.peerIdInput
        ]);
    }
}
export { GoLiveDisplay }