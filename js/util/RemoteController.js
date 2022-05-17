// PeerJs is injected in the window
const Peer = window.Peer;

class RemoteController {
    constructor() {
        this.peer = new Peer("temporary_peer_id");
         
        this.peer.on('open', function(id) {
            console.log("Peer created with id: "+id);
        })
    }
}

export { RemoteController }