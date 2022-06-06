import { UiElement } from "../../../../../../../../../../UiElement.js";

import { ConnectionOptions } from "./ConnectionDisplayElements/ConnectionOptions.js"

class ConnectionDisplay extends UiElement {
    constructor(connection){
        super({
            style: {
                border: "1px solid black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }    
        })

        // remember the name for closing
        this.peer = connection.peer

        this.peerIdDisplay = new UiElement({
            innerHTML: connection.peer,
            style: {
                padding: "3px"
            }
        })

        this.options = new ConnectionOptions(()=>this.handleConnectionClose());

        this.appendChildList([
            this.peerIdDisplay,
            this.options
        ])
    }

    handleConnectionClose() {
        this.element.remove();
        VIRTUAL_ENVIRONMENT.remoteController.disconnectPeer(this.peer);
    }
}
export { ConnectionDisplay }