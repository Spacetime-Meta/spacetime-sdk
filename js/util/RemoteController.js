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
        if(typeof localProxy.peerId !== 'undefined'){
            this.peer = new Peer(localProxy.peerId);
            console.log("[RemoteController] Trying to create peer: " + localProxy.peerId)
            this.peer.on('open', () => {
                document.getElementById("goLivePanel").remove()
                this.onConnectionOpen()
            })
        }
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

        // listen to new data
        newConnection.on('data', (data) => {
            this.onReceiveData(newConnection.peer, data)
        })
    }

    onReceiveData(peer, data) {
        this.addMessageToChatBox(peer+": "+data)
    }

    connectToPeer(peerId) {
        console.log("[RemoteController] Trying connection to peer: " + peerId);
        const newConnection = this.peer.connect(peerId);

        // on new connection establish
        newConnection.on('open', () => {
            this.onConnectionConnect(newConnection);
        })
    }

    disconnectPeer(peerId) {
        console.log("[RemoteController] Trying disconnect to peer: " + peerId);
        this.connections.forEach((connection, index) => {
            if(connection.peer === peerId) {
                connection.close();
                this.connections.splice(index, 1);
            }
        })
        this.addMessageToChatBox('[RemoteController] disconnect to peer: ' + peerId);
    }

    sendMessage(message) {
        this.connections.forEach(connection => {
            connection.send(message);
        })
        this.addMessageToChatBox(localProxy.peerId+": "+message)
    }

    addMessageToChatBox(message) {
        const chat = document.getElementById("chatDisplay");
        chat.innerHTML = chat.innerHTML + "<br>" + message;
    }

    updateFriendList() {
        let tempList = localProxy.friendList;
        this.connections.forEach(connection => {
            let peerId = connection.peer;
            if(localProxy.friendList.indexOf(peerId) <= -1) {
                tempList.push(peerId);
            }
        })
        localProxy.friendList = tempList;
    }
}

export { RemoteController }