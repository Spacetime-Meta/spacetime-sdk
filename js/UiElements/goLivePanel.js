import peerIdSelectPanel from './peerIdSelectPanel.js';

const goLivePanel = function(remoteController) {
    const goLivePanel = document.createElement("div");
    goLivePanel.id = "goLivePanel";

    Object.assign(goLivePanel.style, {
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

    goLivePanel.innerHTML = "Start Multiplayer";

    goLivePanel.addEventListener('click', () => {
        goLivePanel.remove();
        peerIdSelectPanel(remoteController);
    })
    
    document.body.appendChild(goLivePanel); 
}

export default goLivePanel; 