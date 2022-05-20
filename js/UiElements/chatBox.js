const chatBox = function(remoteController) {

    const chatBoxWrapper = document.createElement("div");
    chatBoxWrapper.id = 'chatBoxWrapper';
    Object.assign(chatBoxWrapper.style, {
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        boxSizing: 'border-box',
        zIndex: 100
    })

    const chatDisplay = document.createElement("div");
    chatDisplay.id = "chatDisplay";
    Object.assign(chatDisplay.style, {
        color: 'turquoise',
        maxHeight: '200px',
        maxWidth: '500px',
        overflow: 'scroll',
        overflowX: 'hidden',
        overflowY: 'auto',
        wordBreak: 'break-all'
    })

    const inputBar = document.createElement("input");
    inputBar.id = 'inputBar';
    inputBar.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(inputBar);
        }
    })
    Object.assign(inputBar.style, {
        width: '300px'
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

    chatBoxWrapper.appendChild(chatDisplay);
    chatBoxWrapper.appendChild(inputBar);
    chatBoxWrapper.appendChild(sendButton);

    document.body.appendChild(chatBoxWrapper);
}

export default chatBox;