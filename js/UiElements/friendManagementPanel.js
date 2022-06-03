import localProxy from "../util/localProxy.js";

class friendManagementPanel{
    constructor(remoteController) {
        this.remoteController = remoteController;

        this.friendManagementPanelWrapper = document.createElement("div");
        this.friendManagementPanelWrapper.id = "friendManagementPanelWrapper";
        this.friendManagementPanelWrapper.innerHTML = "Manage Friends";

        Object.assign(this.friendManagementPanelWrapper.style, {
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
            display: "none"
        })
        
        const friendList = document.createElement("div");
        friendList.id = "friendList";
        Object.assign(friendList.style, {
            overflow: 'scroll',
            maxHeight: '100px',
            overflowX: 'hidden',
            overflowY: 'auto',
            listStyle: 'none',
        })

        remoteController.updateFriendList();
        localProxy.friendList.forEach(friend => {
            friendListElement(friend, friendList);
        })

        function friendListElement(friend, parent) {
            const friendDisplay = document.createElement("div");
            friendDisplay.id = friend;
            friendDisplay.innerHTML = friend;
            Object.assign(friendDisplay.style, {
                border: "1px solid red",
                margin: "2px",
                padding: "3px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            })

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
            
            const options = document.createElement("div");
            
            options.appendChild(callBtn);
            options.appendChild(removeBtn);
            friendDisplay.appendChild(options);

            parent.appendChild(friendDisplay);
        }

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "close"
        closeButton.addEventListener('click', () => {
            this.friendManagementPanelWrapper.style.display = "none"
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
        
        this.friendManagementPanelWrapper.appendChild(remotePeerIdInput);
        this.friendManagementPanelWrapper.appendChild(acceptRemotePeerIdButton);
        this.friendManagementPanelWrapper.appendChild(friendList);
        this.friendManagementPanelWrapper.appendChild(closeButton)

        document.body.appendChild(this.friendManagementPanelWrapper); 
    }

    update() {
        this.remoteController.connections.forEach(connection => {
            
        })
    }
}

export { friendManagementPanel }; 