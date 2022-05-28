import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import localProxy from "./localProxy.js";
import goLivePanel from '../UiElements/goLivePanel.js';
import peerIdDisplay from '../UiElements/peerIdDisplay.js';
import chatBox from '../UiElements/chatBox.js';
import friendManagement from '../UiElements/buttons/friendManagement.js';
import { AvatarController } from '../entities/AvatarController.js';

// PeerJs is injected in the window
const Peer = window.Peer;

class RemoteController {
    constructor(scene) {
        this.connections = [];
        this.scene = scene;
        
        goLivePanel(this);

        // check if the user has a peerID in the local storage
        // if(typeof localProxy.peerId !== 'undefined'){
        //     this.peer = new Peer(localProxy.peerId);
        //     console.log("[info] Trying to create peer: " + localProxy.peerId)
        //     this.peer.on('open', () => {
        //         document.getElementById("goLivePanel").remove()
        //         this.onConnectionOpen()
        //     })
        // }
    }

    createPeerWithId(peerId){
        localProxy.peerId = peerId;
        this.peer = new Peer(peerId);
        this.peer.on('open', () => {
            this.onConnectionOpen()
        });
    }

    onConnectionOpen() {
        chatBox(this);

        this.addMessageToChatBox("[info] Peer created with id: "+localProxy.peerId);
        peerIdDisplay(localProxy.peerId, this)
        friendManagement(this);

        // listen for new connection
        this.peer.on('connection', (newConnection) => {
            this.onConnectionConnect(newConnection)
        })

        // try connect to friends
        if(typeof localProxy.friendList !== 'undefined'){
            localProxy.friendList.forEach(friend => {
                if(friend !== localProxy.peerId){
                    this.connectToPeer(friend)
                }
            })
        }
        else {
            localProxy.friendList = [];
        }
    }

    onConnectionConnect(newConnection) {
        this.addMessageToChatBox('[info] new connection to peer: ' + newConnection.peer)
        this.connections.push(newConnection);
        
        // not sure why this is needed but if we dont give the connection some time it wont send the message
        setTimeout(() => {
            newConnection.send('{"type":"spawn", "pathname":"'+window.location.pathname+'"}')
        }, 1000);
        

        // listen to new data
        newConnection.on('data', (data) => {
            this.onReceiveData(newConnection, data)
        })
    }

    onReceiveData(connection, data) {
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error("[RemoteController:onReceiveData] Error while parsing data to JSON.\nData: "+data);
        }
        if(typeof jsonData.type !== 'undefined') {
            switch(jsonData.type) {
                
                case "stream":
                    /* To maintain synchronization in the environment, we do not update the avatar controller every time we receive the stream information.
                     * Instead we simply update the connections data and the update method will tak care of updating the avatarController only once per render cycle. */
                    connection.transform = {
                        position: new Vector3(jsonData.transform.position.x, jsonData.transform.position.y, jsonData.transform.position.z),
                        horizontalVelocity: new Vector3(jsonData.transform.horizontalVelocity.x, 0, jsonData.transform.horizontalVelocity.z)
                    }
                    connection.animation = jsonData.animation

                    connection.needUpdate = true;
                    break;
                
                case "chat": 
                    this.addMessageToChatBox(connection.peer+": "+jsonData.message)
                    break;
                
                case "spawn":

                    // first verify that both users are in the same world
                    if(jsonData.pathname === window.location.pathname) {
                        this.addMessageToChatBox("[info] Spawning: "+connection.peer);

                        // Spawn the other player
                        connection.avatarController = new AvatarController("../../glb/animations/animation.glb", "../../glb/avatars/yBot.glb", this.scene);

                        /* At this point, we want to start sending data to this peer so he can display us. 
                         * To do this, we add the 'needUpdate' tag to our connection and the update method will take care of it */
                        connection.needUpdate = true;
                    }  
                    break;
            }
        }
    }

    connectToPeer(peerId) {
        console.log("[info] Trying connection to peer: " + peerId);
        const newConnection = this.peer.connect(peerId);

        // on new connection establish
        newConnection.on('open', () => {
            this.onConnectionConnect(newConnection);
        })
    }
    
    disconnectPeer(peerId) {
        console.log("[info] Trying disconnect to peer: " + peerId);
        this.connections.forEach((connection, index) => {
            if(connection.peer === peerId) {
                connection.close();
                this.connections.splice(index, 1);
            }
        })
        this.addMessageToChatBox('[info] disconnect to peer: ' + peerId);
    }

    sendChatMessage(message) {
        this.connections.forEach(connection => {
            connection.send('{"type":"chat","message":"'+message+'"}');
        })
        this.addMessageToChatBox("["+localProxy.peerId+"] "+message)
    }

    addMessageToChatBox(message) {
        const chat = document.getElementById("chatDisplay");
        chat.innerHTML = chat.innerHTML + "<br>" + message;
    }

    update(delta, frustum) {
        this.connections.forEach(connection => {
            if(connection.needUpdate) {
                const position = window.player.position;
                const horizontalVelocity = window.player.horizontalVelocity;

                connection.send('{"type":"stream", "transform":{ "position":{"x":'+position.x+', "y":'+position.y+', "z":'+position.z+'}, "horizontalVelocity": {"x":'+horizontalVelocity.x+', "y":0, "z":'+horizontalVelocity.z+'}}, "animation": ["'+window.player.currentAnimation+'", '+window.player.currentAnimationTime+']}');

                if(typeof connection.transform !== 'undefined'){
                    connection.avatarController.update(delta, frustum, connection.transform.position, connection.transform.horizontalVelocity, connection.animation[0], connection.animation[1])
                }

                connection.needUpdate = false;
            }
        })
    }

    updateFriendList() {
        let tempList = localProxy.friendList;
        this.connections.forEach(connection => {
            let peerId = connection.peer;
            if(localProxy.friendList.indexOf(peerId) <= -1) {
                tempList.push(peerId);
            }
        })
        localProxy.friendList = tempList;
    }
}

export { RemoteController }