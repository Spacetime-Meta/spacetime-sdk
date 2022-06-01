const roomSelectPanel = function(remoteController) {
    const roomSelectPanel = document.createElement("div");
    roomSelectPanel.id = "roomSelectPanel";
    roomSelectPanel.innerHTML = "Create your Room";

    Object.assign(roomSelectPanel.style, {
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

    const sessionInput =  document.createElement("input");
    sessionInput.id = "sessionInput";

    const acceptButton = document.createElement("button")
    acceptButton.id = 'acceptButton';
    acceptButton.innerHTML = "Go"
    acceptButton.addEventListener('click', () => {
        const sessionId = sessionInput.value;
        if(sessionId) {
            //TODO: create room or connect a room
            roomSelectPanel.remove()
        }
    })

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "close"
    closeButton.addEventListener('click', () => {
        roomSelectPanel.remove();
        //TODO: disconnect a room
    })

    const message = document.createElement("p");
    message.innerHTML = "<b>This feature is still experimental.<b><br>Come on our <a href=https://discord.gg/w6CzHy35E2>discord</a> if you have questions or need help."

    roomSelectPanel.appendChild(sessionInput);
    roomSelectPanel.appendChild(acceptButton);
    roomSelectPanel.appendChild(closeButton);
    roomSelectPanel.appendChild(message);
    document.body.appendChild(roomSelectPanel); 
}

export default roomSelectPanel; 