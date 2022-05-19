import localProxy from "./localProxy.js";
import goLivePanel from '../UiElements/goLivePanel.js';
import peerIdDisplay from '../UiElements/peerIdDisplay.js';
import chatBox from '../UiElements/chatBox.js';
import friendManagement from '../UiElements/buttons/friendManagement.js';

// PeerJs is injected in the window
const Peer = window.Peer;

class RemoteController {
    constructor() {
        this.connections = [];
        
        goLivePanel(this);

        // check if the user has a peerID in the local storage
        // if(typeof localProxy.peerId !== 'undefined'){
        //     this.peer = new Peer(localProxy.peerId);
        //     console.log("[RemoteController] Trying to create peer: " + localProxy.peerId)
        //     this.peer.on('open', () => {
        //         document.getElementById("goLivePanel").remove()
        //         this.onConnectionOpen()
        //     })
        // }
    }

    createPeerWithId(peerId){
        localProxy.peerId = peerId;
        this.peer = new Peer(peerId);
        this.peer.on('open', () => {
            this.onConnectionOpen()
        });
    }

    onConnectionOpen() {
        chatBox(this);

        this.addMessageToChatBox("[RemoteController] Peer created with id: "+localProxy.peerId);
        peerIdDisplay(localProxy.peerId, this)
        friendManagement(this);

        // listen for new connection
        this.peer.on('connection', (newConnection) => {
            this.onConnectionConnect(newConnection)
        })

        // try connect to friends
        if(typeof localProxy.friendList !== 'undefined'){
            localProxy.friendList.forEach(friend => {
                if(friend !== localProxy.peerId){
                    this.connectToPeer(friend)
                }
            })
        }
        else {
            localProxy.friendList = [];
        }
    }

    onConnectionConnect(newConnection) {
        this.addMessageToChatBox('[RemoteController] new connection to peer: ' + newConnection.peer)
        this.connections.push(newConnection);
        
        setTimeout(() => {
            // not sure why this is needed but if we dont give the connection some time it wont send the message
            newConnection.send('{"type":"spawn", "pathname":"'+window.location.pathname+'"}')
        }, 1000);
        

        // listen to new data
        newConnection.on('data', (data) => {
            this.onReceiveData(newConnection, data)
        })
    }

    onReceiveData(connection, data) {
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error("[RemoteController:onReceiveData] Error while parsing data to JSON.\nData: "+data);
        }
        if(typeof jsonData.type !== 'undefined') {
            switch(jsonData.type) {
                case "chat": 
                    this.addMessageToChatBox(connection.peer+": "+jsonData.message)
                    break;
                case "spawn":
                    if(jsonData.pathname === window.location.pathname) {
                        console.log("would spawn: "+connection.peer)
                    }  
                    break;
            }
        }
    }

    connectToPeer(peerId) {
        console.log("[RemoteController] Trying connection to peer: " + peerId);
        const newConnection = this.peer.connect(peerId);

        // on new connection establish
        newConnection.on('open', () => {
            this.onConnectionConnect(newConnection);
        })
    }

    sendChatMessage(message) {
        this.connections.forEach(connection => {
            connection.send('{"type":"chat","message":"'+message+'"}');
        })
        this.addMessageToChatBox(localProxy.peerId+": "+message)
    }

    addMessageToChatBox(message) {
        const chat = document.getElementById("chatDisplay");
        chat.innerHTML = chat.innerHTML + "<br>" + message;
    }


}

export { RemoteController }