const peerIdSelectPanel = function(remoteController) {
    const panelWrapper = document.createElement("div");
    panelWrapper.id = "peerIdSelectPanel";
    panelWrapper.innerHTML = "Select a peer ID";

    Object.assign(panelWrapper.style, {
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
        const peerId = document.getElementById('peerIdInput').value;
        remoteController.createPeerWithId(peerId)
        document.getElementById("peerIdSelectPanel").remove()
    })

    panelWrapper.appendChild(peerIdInput);
    panelWrapper.appendChild(acceptPeerIdButton);
    document.body.appendChild(panelWrapper); 
}

export default peerIdSelectPanel; 