import peerIdSelectPanel from './peerIdSelectPanel.js';

const goLivePanel = function(remoteController) {
    const element = document.createElement("div");
    element.id = "goLivePanel";

    Object.assign(element.style, {
        position: 'absolute',
        padding: '10px',
        bottom: '2px;',
        transform: 'translate(0, -100%)',
        left: '40%',
        width: '200px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: '10px',
        zIndex: 100,
        color: '#00FFF0'
    })

    element.innerHTML = "Start Multiplayer";

    element.addEventListener('click', () => {
        document.getElementById("goLivePanel").remove();
        peerIdSelectPanel(remoteController);
    })
    
    document.body.appendChild(element); 
}

export default goLivePanel; 