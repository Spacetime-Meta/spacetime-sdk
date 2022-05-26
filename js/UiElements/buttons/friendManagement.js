import friendManagementPanel from '../friendManagementPanel.js';

const friendManagement = function(remoteController) {
    const element = document.createElement("div");
    element.id = "friendManagement";

    Object.assign(element.style, {
        position: 'absolute',
        padding: '2px',
        top: '0',
        right: '0',
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        cursor: 'pointer',
        fontSize: "x-small",
        zIndex: 100,
        color: "rgba(256, 256, 256, 0.8)"
    })
    element.innerHTML = "Manage Friends"

    element.addEventListener('click', () => {
        friendManagementPanel(remoteController);
    })
    
    document.body.appendChild(element); 
}

export default friendManagement; 