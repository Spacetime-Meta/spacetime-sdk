import localProxy from "../util/localProxy.js";

const friendManagementPanel = function(remoteController) {
    const friendManagementPanelWrapper = document.createElement("div");
    friendManagementPanelWrapper.id = "friendManagementPanelWrapper";
    friendManagementPanelWrapper.innerHTML = "Manage Friends";

    Object.assign(friendManagementPanelWrapper.style, {
        position: 'absolute',
        padding: '10px',
        top: '350px',
        transform: 'translate(0, -100%)',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 100,
        color: "rgba(256, 256, 256, 0.8)",
    })
    
    const friendList = document.createElement("ul");
    friendList.id = "friendList";
    Object.assign(friendList.style, {
        overflow: 'scroll',
        maxHeight: '100px',
        overflowX: 'hidden',
        overflowY: 'auto'
    })

    remoteController.updateFriendList();
    localProxy.friendList.forEach(friend => {
        friendListElement(friend, friendList);
    })

    function friendListElement(friend, parent) {
        const friendDisplay = document.createElement("li");
        friendDisplay.id = friend;
        friendDisplay.innerHTML = friend;
        
        const removeBtn = document.createElement("b");
        removeBtn.innerHTML = "     &#9746;";
        Object.assign(removeBtn.style, {
            cursor: 'pointer'
        })
        removeBtn.addEventListener('click', () => {
            //remove id from list
            let tempList = localProxy.friendList;
            const index = tempList.indexOf(friend);
            if (index > -1) tempList.splice(index, 1);
            localProxy.friendList = tempList;
            //remove from page
            friendDisplay.parentNode.removeChild(friendDisplay);
            //disconnect
            remoteController.disconnectPeer(friend);
        });

        const callBtn = document.createElement('b');
        callBtn.innerHTML = "      &#9742;";
        Object.assign(callBtn.style, {
            cursor: 'pointer'
        })
        callBtn.addEventListener('click', () => {
            //call audio
            remoteController.call(friend);
        });
        
        friendDisplay.appendChild(callBtn);
        friendDisplay.appendChild(removeBtn);

        parent.appendChild(friendDisplay);
        
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "close"
    closeButton.addEventListener('click', () => {
        friendManagementPanelWrapper.remove()
    })
    
    const remotePeerIdInput =  document.createElement("input");
    remotePeerIdInput.id = "remotePeerIdInput";

    const acceptRemotePeerIdButton = document.createElement("button")
    acceptRemotePeerIdButton.id = 'acceptRemotePeerIdButton';
    acceptRemotePeerIdButton.innerHTML = "Add & Connect"
    acceptRemotePeerIdButton.addEventListener('click', () => {

        // get value of the input field
        const remotePeerId = remotePeerIdInput.value;
        remotePeerIdInput.value = '';
        
        // tell remoteController to try connect
        remoteController.connectToPeer(remotePeerId);

        // add the friend to the friend list
        let tempList = localProxy.friendList
        tempList.push(remotePeerId);
        localProxy.friendList = tempList

        // add the friend to the friend panel
        friendListElement(remotePeerId, friendList);
    })
    
    friendManagementPanelWrapper.appendChild(remotePeerIdInput);
    friendManagementPanelWrapper.appendChild(acceptRemotePeerIdButton);
    friendManagementPanelWrapper.appendChild(friendList);
    friendManagementPanelWrapper.appendChild(closeButton)

    document.body.appendChild(friendManagementPanelWrapper); 
}

export default friendManagementPanel; 