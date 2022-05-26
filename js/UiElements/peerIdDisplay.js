import peerIdSelectPanel from './peerIdSelectPanel.js';

const peerIdDisplay = function(peerId, remoteController) {
    const element = document.createElement("div");
    element.id = "peerIdDisplay";

    Object.assign(element.style, {
        position: 'absolute',
        bottom: '0px',
        padding: '2px',
        right: '0',
        cursor: 'pointer',
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 100,
        color: 'rgba(256, 256, 256, 0.8)',
        fontSize: "x-small"
    })

    element.innerHTML = "Peer ID: " + peerId;

    element.addEventListener('click', () => {
        peerIdSelectPanel(remoteController);
        element.remove()
    })
    
    document.body.appendChild(element); 
}

export default peerIdDisplay; 