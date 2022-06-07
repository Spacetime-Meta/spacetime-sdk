import { UiElement } from "../../../../../../../../UiElement.js";
import localProxy from "../../../../../../../../../../util/localProxy.js"

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

        this.connectionDisplayList = []

        this.newConnectionDisplay = new NewConnectionDisplay();
        this.appendChild(this.newConnectionDisplay);

        this.appendChild(new UiElement({
            type: "h3",
            innerHTML: "Connection List"
        }));

        this.appendChild(new UiElement({
            innerHTML: "Your stared contacts will connect automatically when you log on"
        }))
    }

    handleNewConnection(connection) {
        this.connectionDisplayList.forEach(connectionDisplay => {
            if(connectionDisplay.element.id === connection.peer){
                console.log("here")
                return;
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