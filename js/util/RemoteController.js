import localProxy from "./localProxy.js";
import goLivePanel from '../UiElements/goLivePanel.js';
import peerIdDisplay from '../UiElements/peerIdDisplay.js';

// PeerJs is injected in the window
const Peer = window.Peer;

class RemoteController {
    constructor() {
        // check if the user has a peerID in the local storage
        if(typeof localProxy.peerId !== 'undefined'){
            this.peer = new Peer(localProxy.peerId);
            this.peer.on('open', () => {this.onConnectionOpen()})
        }
        else {
            goLivePanel(this);
        }
    }

    createPeerWithId(peerId){
        localProxy.peerId = peerId;
        this.peer = new Peer(peerId);
        this.peer.on('open', () => {this.onConnectionOpen()});
    }

    onConnectionOpen() {
        console.log("Peer created with id: "+localProxy.peerId);
        peerIdDisplay(localProxy.peerId, this)
    }
}

export { RemoteController }