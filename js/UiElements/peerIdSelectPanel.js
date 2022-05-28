import goLivePanel from "./goLivePanel.js";
import peerIdDisplay from "./peerIdDisplay.js";

const peerIdSelectPanel = function(remoteController) {
    const peerIdSelectPanel = document.createElement("div");
    peerIdSelectPanel.id = "peerIdSelectPanel";
    peerIdSelectPanel.innerHTML = "Create your Peer ID";

    Object.assign(peerIdSelectPanel.style, {
        position: 'absolute',
        padding: '2px',
        top: '30%',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        background: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(256, 256, 256, 0.3)",
        zIndex: 100,
        color: "rgba(256, 256, 256, 0.8)"
    })

    const peerIdInput =  document.createElement("input");
    peerIdInput.id = "peerIdInput";

    const acceptPeerIdButton = document.createElement("button")
    acceptPeerIdButton.id = 'acceptPeerIdButton';
    acceptPeerIdButton.innerHTML = "Go"
    acceptPeerIdButton.addEventListener('click', () => {
        const peerId = peerIdInput.value;
        if(peerId) {
            remoteController.createPeerWithId(peerId)
            peerIdSelectPanel.remove()
        }
    })

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "close"
    closeButton.addEventListener('click', () => {
        peerIdSelectPanel.remove();

        // verify if the user already has a PeerId
        if(typeof remoteController.peer !== 'undefined') {
            peerIdDisplay(remoteController.peer.id, remoteController)
        }
        else {
            goLivePanel(remoteController);
        }
    })

    const message = document.createElement("p");
    message.innerHTML = "<b>This feature is still experimental.<b><br>Share your peer id with your friends so they can connect to you.<br><br>Come on our <a href=https://discord.gg/w6CzHy35E2>discord</a> if you have questions or need help."

    peerIdSelectPanel.appendChild(peerIdInput);
    peerIdSelectPanel.appendChild(acceptPeerIdButton);
    peerIdSelectPanel.appendChild(closeButton);
    peerIdSelectPanel.appendChild(message);
    document.body.appendChild(peerIdSelectPanel); 
}

export default peerIdSelectPanel; 