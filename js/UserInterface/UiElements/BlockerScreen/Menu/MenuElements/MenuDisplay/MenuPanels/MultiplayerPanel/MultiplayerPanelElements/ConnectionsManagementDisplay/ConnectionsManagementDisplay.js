import { UiElement } from "../../../../../../../../UiElement.js";

import { ConnectionDisplay } from "./ConnectionManagementElements/ConnectionDisplay/ConnectionDisplay.js";
import { NewConnectionDisplay } from "./ConnectionManagementElements/NewConnectionDisplay/NewConnectionDisplay.js";

class ConnectionsManagementDisplay extends UiElement {
    constructor() {
        super({
            id: "ConnectionManagementPanel",
            style: {
                display: "none",
            }
        })

        this.newConnectionDisplay = new NewConnectionDisplay();
        this.appendChild(this.newConnectionDisplay);

        this.appendChild(new UiElement({
            type: "h3",
            innerHTML: "Connection List"
        }));
    }

    handleNewConnection(connection) {
        const connectionDisplay = new ConnectionDisplay(connection);
        this.appendChild(connectionDisplay);
    }

    handleConnectionClose(peerId) {
        const childList = this.element.childNodes
        for(let i=0; i<childList.length; i++) {
            if(childList[i].id === peerId) {
                this.element.childNodes[i].remove();
            }
        }
    }
}
export { ConnectionsManagementDisplay }