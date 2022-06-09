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
        
        this.inputs = new UiElement({})

        this.inputs.peerIdInput = new PeerIdInput()
        this.inputs.appendChildList([
            this.inputs.peerIdInput,
            new GoLiveButton(onClick)
        ])
        
        this.title = new UiElement({
            innerHTML: "enter a peer id",
            style: {
                width: "100%",
                fontWeight: "bold",
                fontSize: "25px",
                textAlign: "center",
                marginTop: "50px"
            }
        });
        
        this.info = new UiElement({
            style: {
                padding: "10px",
                fontSize: "xx-small",
                textAlign: "justify",
                width: "250px"
            },
            innerHTML: "This feature is still experimental. Please join our <a href='https://discord.gg/w6CzHy35E2'>Discord</a> if you have any difficulty or want to suggest an improvement."
        })

        this.appendChildList([
            this.title,
            this.inputs,
            this.info
        ]);
    }
}
export { GoLiveDisplay }