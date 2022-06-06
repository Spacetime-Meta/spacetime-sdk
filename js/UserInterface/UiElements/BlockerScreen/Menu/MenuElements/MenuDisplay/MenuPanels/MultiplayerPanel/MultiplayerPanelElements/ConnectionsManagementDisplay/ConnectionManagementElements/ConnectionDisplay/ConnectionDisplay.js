import { UiElement } from "../../../../../../../../../../UiElement.js";

import { ConnectionOptions } from "./ConnectionDisplayElements/ConnectionOptions.js"

class ConnectionDisplay extends UiElement {
    constructor(connection){
        super({
            id: connection.peer,
            style: {
                border: "1px solid black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "5px",
            }    
        })

        this.connection = connection;

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
        VIRTUAL_ENVIRONMENT.remoteController.disconnectPeer(this.peer);
    }

    update() {
        if(this.connection.open){
            this.element.style.border = "1px solid green";
        } else {
            this.element.style.border = "1px solid yellow";
        }
    }
}
export { ConnectionDisplay }