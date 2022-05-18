import peerIdSelectPanel from './peerIdSelectPanel.js';

const peerIdDisplay = function(peerId, remoteController) {
    const element = document.createElement("div");
    element.id = "peerIdDisplay";

    Object.assign(element.style, {
        position: 'absolute',
        bottom: '2px',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer',
        zIndex: 100,
        color: '#00FFF0'
    })

    element.innerHTML = "Peer ID: " + peerId;

    element.addEventListener('click', () => {
        peerIdSelectPanel(remoteController);
        element.remove()
    })
    
    document.body.appendChild(element); 
}

export default peerIdDisplay; 