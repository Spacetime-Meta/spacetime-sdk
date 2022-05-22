import goLivePanel from "./goLivePanel.js";

const peerIdSelectPanel = function(remoteController) {
    const peerIdSelectPanel = document.createElement("div");
    peerIdSelectPanel.id = "peerIdSelectPanel";
    peerIdSelectPanel.innerHTML = "Create your Peer ID";

    Object.assign(peerIdSelectPanel.style, {
        position: 'absolute',
        padding: '10px',
        top: '40%',
        transform: 'translate(0, -100%)',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        borderRadius: '10px',
        zIndex: 100,
        color: '#00FFF0'
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
        goLivePanel(remoteController);
    })

    peerIdSelectPanel.appendChild(peerIdInput);
    peerIdSelectPanel.appendChild(acceptPeerIdButton);
    peerIdSelectPanel.appendChild(closeButton);
    document.body.appendChild(peerIdSelectPanel); 
}

export default peerIdSelectPanel; 