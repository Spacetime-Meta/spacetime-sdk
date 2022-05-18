const connectPeerTestPanel = function(remoteController) {
    const panelWrapper = document.createElement("div");
    panelWrapper.id = "connectPeerTestPanel";
    panelWrapper.innerHTML = "Select a peer ID";

    Object.assign(panelWrapper.style, {
        position: 'absolute',
        padding: '10px',
        top: '20%',
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
    
    

    const remotePeerIdInput =  document.createElement("input");
    remotePeerIdInput.id = "remotePeerIdInput";

    const acceptRemotePeerIdButton = document.createElement("button")
    acceptRemotePeerIdButton.id = 'acceptRemotePeerIdButton';
    acceptRemotePeerIdButton.innerHTML = "Go"
    acceptRemotePeerIdButton.addEventListener('click', () => {
        const remotePeerId = document.getElementById('remotePeerIdInput').value;
        remoteController.connectToPeer(remotePeerId)
    })

    panelWrapper.appendChild(remotePeerIdInput);
    panelWrapper.appendChild(acceptRemotePeerIdButton);
    document.body.appendChild(panelWrapper); 
}

export default connectPeerTestPanel; 