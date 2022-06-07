import { UiElement } from "../../../../../../../../UiElement.js";

import { GoLiveButton } from "./GoLiveDisplayElements/GoLiveButton.js"
import { PeerIdInput } from "./GoLiveDisplayElements/PeerIdInput.js"

class GoLiveDisplay extends UiElement {
    constructor(onClick) {
        super({
            id: "GoLiveDisplay",
            style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }
        })
        
        this.goLiveButton = new GoLiveButton(onClick);
        this.peerIdInput = new PeerIdInput();
        
        this.title = new UiElement({
            type: "h3",
            innerHTML: "enter a peer id"
        });
        
        this.info = new UiElement({
            style: {
                padding: "10px",
            },
            innerHTML: "This feature is still experimental. Please join our <a href='https://discord.gg/w6CzHy35E2'>Discord</a> if you have any difficulty or want to suggest an improvement, "
        })

        this.appendChildList([
            this.title,
            this.peerIdInput,
            this.goLiveButton,
            this.info
        ]);
    }
}
export { GoLiveDisplay }