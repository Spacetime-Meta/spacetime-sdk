const alertBox = function(title, content, f_accept = null) {
    const alertPanel = document.createElement("div");
    alertPanel.id = "alert-box";
    alertPanel.innerHTML = title;

    Object.assign(alertPanel.style, {
        position: 'absolute',
        padding: '2px',
        top: '30%',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(256, 256, 256, 0.3)",
        zIndex: 100,
        color: "rgba(256, 256, 256, 0.8)"
    })

    const acceptButton = document.createElement("button")
    acceptButton.id = 'accept';
    acceptButton.innerHTML = "Yes"
    acceptButton.addEventListener('click', () => {
        if(f_accept) f_accept();
        alertPanel.remove();
    })

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "Close"
    closeButton.addEventListener('click', () => {
        alertPanel.remove();
    })

    const message = document.createElement("p");
    message.innerHTML = content;

    alertPanel.appendChild(message);
    alertPanel.appendChild(acceptButton);
    alertPanel.appendChild(closeButton);
    document.body.appendChild(alertPanel); 
}

export default alertBox;