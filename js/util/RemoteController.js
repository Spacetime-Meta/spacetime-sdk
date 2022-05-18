import localProxy from "./localProxy.js";
import goLivePanel from '../UiElements/goLivePanel.js';
import peerIdDisplay from '../UiElements/peerIdDisplay.js';
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
        this.peer.on('open', () => {this.onConnectionOpen()});
    }

    onConnectionOpen() {
        console.log("[RemoteController] Peer created with id: "+localProxy.peerId);
        peerIdDisplay(localProxy.peerId, this)
        friendManagement(this);

        // listen for new connection
        this.peer.on('connection', (newConnection) => {
            this.onConnectionConnect(newConnection)
        })

        // try connect to friends
        if(typeof localProxy.friendList !== 'undefined'){
            localProxy.friendList.forEach(friend => {
                if(friend !== localProxy.peerId)
                this.connectToPeer(friend)
            })
        }
        else {
            localProxy.friendList = [];
        }
    }

    onConnectionConnect(newConnection) {
        console.log('[RemoteController] new connection to peer: ' + newConnection.peer)

        // listen to new data
        newConnection.on('data', (data) => {
            console.log(data)
        })
    }

    connectToPeer(peerId) {
        console.log("[RemoteController] Trying connection to peer: " + peerId);
        const newConnection = this.peer.connect(peerId);

        // on new connection establish
        newConnection.on('open', () => {
            this.onConnectionConnect(newConnection);
        })
    }
}

export { RemoteController }