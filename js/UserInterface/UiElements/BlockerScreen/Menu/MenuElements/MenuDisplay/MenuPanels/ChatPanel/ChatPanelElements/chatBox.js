import roomSelectPanel from "./roomSelectPanel.js";

const chatBox = function(remoteController) {


    const inputBar = document.createElement("input");
    inputBar.id = 'inputBar';
    inputBar.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(inputBar);
        }
    })
    Object.assign(inputBar.style, {
        width: '200px'
    })

    const sendButton = document.createElement("button");
    sendButton.id = "sendButton";
    sendButton.innerHTML = "Send";
    sendButton.addEventListener("click", () => {
        sendMessage(inputBar);
    })

    function sendMessage(input) {
        remoteController.sendChatMessage(input.value)
        input.value = "";
    }

    const createRoomButton = document.createElement("button");
    createRoomButton.id = "createRoomButton";
    createRoomButton.innerHTML = "Create Room";
    createRoomButton.addEventListener("click", () => {
        if(remoteController.isConnected()) {
            remoteController.disconnectRoom();
        }else {
            roomSelectPanel(remoteController);
        }
    });

    chatBoxWrapper.appendChild(chatDisplay);
    chatBoxWrapper.appendChild(inputBar);
    chatBoxWrapper.appendChild(sendButton);
    chatBoxWrapper.appendChild(createRoomButton);

    document.body.appendChild(chatBoxWrapper);
}

const toggleConnectRoom = function(remoteController) {
    const createRoomButton = document.getElementById('createRoomButton');
    if(remoteController.isConnected()) {
        createRoomButton.innerHTML = "Disconnect";
    } else {
        createRoomButton.innerHTML = "Create Room";
    }
}

export {chatBox, toggleConnectRoom};