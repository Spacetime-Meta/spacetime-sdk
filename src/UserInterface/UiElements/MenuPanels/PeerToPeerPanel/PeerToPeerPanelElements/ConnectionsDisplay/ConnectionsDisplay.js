import { UiElement } from "../../../../UiElement.js";
import localProxy from "../../../../../../util/localProxy.js"

import { ConnectionDisplay } from "./ConnectionsElements/ConnectionDisplay.js";
import { NewConnectionDisplay } from "./ConnectionsElements/NewConnectionDisplay.js";

class ConnectionsManagementDisplay extends UiElement {
    constructor() {
        super({
            id: "ConnectionManagementPanel",
            style: {
                display: "none",
            }
        })

        this.connectionDisplayList = []

        this.newConnectionDisplay = new NewConnectionDisplay();
        this.appendChild(this.newConnectionDisplay);
        
        this.appendChild(new UiElement({
            innerHTML: "Connection List",
            style: {
                width: "100%",
                fontWeight: "bold",
                fontSize: "25px",
                textAlign: "center",
                marginTop: "50px"
            }
        }));
        
        this.appendChild(new UiElement({
            innerHTML: "Activate the &#9733; icon to save a connection.",
            style: {
                fontSize: "xx-small",
                width: "100%",
                textAlign: "center"
            }
        }))


    }

    handleNewConnection(connection) {
        this.connectionDisplayList.forEach(connectionDisplay => {
            if(connectionDisplay.peer === connection.peer){
                connectionDisplay.element.remove()
            }
        })
        const newConnectionDisplay = new ConnectionDisplay(connection);
        this.connectionDisplayList.push(newConnectionDisplay);
        this.appendChild(newConnectionDisplay);
    }

    handleConnectionClose(peerId) {
        if(localProxy.friendList.includes(peerId)) {
            // if is in friend list 
            this.connectionDisplayList.forEach((display, index) => {
                if(display.element.id === peerId){
                    delete this.connectionDisplayList[index].connection;
                }
            })
        } else {
            //if is not
            const childList = this.element.childNodes
            for(let i=0; i<childList.length; i++) {
                if(childList[i].id === peerId) {
                    this.element.childNodes[i].remove();
                }
            }
            this.connectionDisplayList.forEach((display, index) => {
                if(display.element.id === peerId){
                    this.connectionDisplayList.splice(index, 1);
                }
            })
        }
       
    }

    update(){
        this.connectionDisplayList.forEach(connectionDisplay => {
            connectionDisplay.update();
        })
    }
}
export { ConnectionsManagementDisplay }