import friendManagementPanel from '../friendManagementPanel.js';

const friendManagement = function(remoteController) {
    const element = document.createElement("div");
    element.id = "friendManagement";

    Object.assign(element.style, {
        position: 'absolute',
        padding: '10px',
        top: '50px',
        left: 'calc(100% - 2px)',
        transform: 'translate(-100%, 0)',
        width: '150px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        borderRadius: '10px',
        cursor: 'pointer',
        zIndex: 100,
        color: '#00FFF0'
    })
    element.innerHTML = "Manage Friends"

    element.addEventListener('click', () => {
        friendManagementPanel(remoteController);
    })
    
    document.body.appendChild(element); 
}

export default friendManagement; 