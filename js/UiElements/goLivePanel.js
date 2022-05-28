import peerIdSelectPanel from './peerIdSelectPanel.js';

const goLivePanel = function(remoteController) {

    // create a wrapper to center the button div
    const panelWrapper = document.createElement('div');
    panelWrapper.id = "panelWrapper";
    Object.assign(panelWrapper.style, {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        color: "rgba(256, 256, 256, 0.8)",
        display: "flex",
        justifyContent: "center",
        fontSize: "x-small"
    })
    document.body.appendChild(panelWrapper)



    const goLivePanel = document.createElement("div");
    goLivePanel.id = "goLivePanel";

    Object.assign(goLivePanel.style, {
        background: "rgba(0, 0, 0, 0.2)",
        padding: "2px",
        border: "1px solid rgba(256, 256, 256, 0.3)",
        cursor: 'pointer',
        zIndex: 100,
    })

    goLivePanel.innerHTML = "Start Multiplayer";

    goLivePanel.addEventListener('click', () => {
        goLivePanel.remove();
        peerIdSelectPanel(remoteController);
    })
    
    panelWrapper.appendChild(goLivePanel); 
}

export default goLivePanel; 