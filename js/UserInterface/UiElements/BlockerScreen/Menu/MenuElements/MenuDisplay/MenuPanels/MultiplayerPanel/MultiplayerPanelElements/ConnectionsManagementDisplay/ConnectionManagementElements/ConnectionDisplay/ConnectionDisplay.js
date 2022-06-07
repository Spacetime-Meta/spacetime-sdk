import { UiElement } from "../../../../../../../../../../UiElement.js";
import localProxy from "../../../../../../../../../../../../util/localProxy.js"

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

        this.options = new ConnectionOptions(
            ()=>this.handleConnectionClose(),
            localProxy.friendList.includes(this.peer),
            ()=>this.handleClickOnStar()
        );

        this.appendChildList([
            this.peerIdDisplay,
            this.options
        ])
    }

    handleClickOnStar() {
        if(localProxy.friendList.includes(this.peer)) {
            this.options.setStar("")
            let tempList = localProxy.friendList;
            const index = tempList.indexOf(this.peer);
            tempList.splice(index, 1);
            localProxy.friendList = tempList;
            if(typeof this.connection === "undefined") {
                this.element.remove()
            }
        } else {
            this.options.setStar("star")
            let tempList = localProxy.friendList
            tempList.push(this.peer);
            localProxy.friendList = tempList
        }
    }

    handleConnectionClose() {
        VIRTUAL_ENVIRONMENT.remoteController.disconnectPeer(this.peer);
    }

    update() {
        if(typeof this.connection !== "undefined"){
            if(this.connection.open){
                this.element.style.border = "1px solid green";
            } else {
                this.element.style.border = "1px solid yellow";
            }
        } else {
            this.element.style.border = "1px solid red";
        }
    }
}
export { ConnectionDisplay }