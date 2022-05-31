import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import localProxy from "./localProxy.js";
import goLivePanel from '../UiElements/goLivePanel.js';
import peerIdDisplay from '../UiElements/peerIdDisplay.js';
import chatBox from '../UiElements/chatBox.js';
import friendManagement from '../UiElements/buttons/friendManagement.js';
import { AvatarController } from '../entities/AvatarController.js';
import { toggleCallBox, callBox, addCamera } from '../UiElements/callBox.js';

// PeerJs is injected in the window
const Peer = window.Peer;

class RemoteController {
    constructor(manager, scene) {
        this.connections = [];
        this.scene = scene;
        this.manager = manager;
        this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if(!this.getUserMedia) console.log('Your browser doesn\'t support getUserMedia.');
        
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
            this.onConnectionOpen();
        });
        // add video call box
        callBox(this, peerId);
        // listen for a call
        this.answer();
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
            newConnection.send(this.jsonMessageFormatter("spawn"));
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
                
                 case "spawn":
                    if(jsonData.pathname === window.location.pathname) {
                        this.addMessageToChatBox("[info] Spawning: "+connection.peer);

                        // Spawn the other player
                        connection.avatarController = new AvatarController(this.manager);
                        connection.avatarController.spawnAvatar({})
                    }

                case "stream":
                    /* To maintain synchronization in the environment, we do not update the avatar controller every time we receive the stream information.
                     * Instead we simply update the connections data and the update method will tak care of updating the avatarController only once per render cycle. */
                    this.handleNewTransform(connection, jsonData);
                    break;
                
                case "chat": 
                    this.addMessageToChatBox("["+connection.peer+"] "+jsonData.message)
                    break;
            }
        }
    }

    handleNewTransform(connection, jsonData) {
        connection.transform = {
            position: new Vector3(jsonData.transform.position.x, jsonData.transform.position.y, jsonData.transform.position.z),
            horizontalVelocity: new Vector3(jsonData.transform.horizontalVelocity.x, 0, jsonData.transform.horizontalVelocity.z)
        }
        connection.animation = jsonData.animation

        connection.needUpdate = true;
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

    update(delta) {
        this.connections.forEach(connection => {
            if(connection.needUpdate) {
                const position = player.position;
                const horizontalVelocity = player.horizontalVelocity;

                connection.send(this.jsonMessageFormatter("stream"));

                if(typeof connection.transform !== 'undefined' && connection.avatarController){
                    connection.avatarController.update(delta, connection.transform.position, connection.transform.horizontalVelocity, connection.animation[0], connection.animation[1])
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

    call(peerId) {
        let o = this;
        this.getUserMedia({video: true, audio: true}, function(stream) {
            addCamera(localProxy.peerId, stream);
            var call = o.peer.call(peerId, stream);
            o.currentCall = call;
            call.on('stream', function(incomingStream) {
                o.sendChatMessage(`Calling ${call.peer}`);
                addCamera(call.peer, incomingStream);
            });
          }, function(err) {
                console.log('Failed to get local stream' ,err);
          });
    }

    answer() {
        let o = this;
        this.peer.on('call', function(call) {
            o.getUserMedia({video: true, audio: true}, function(stream) {
              addCamera(localProxy.peerId, stream);
              call.answer(stream);
              o.currentCall = call;
              call.on('stream', function(incomingStream) {
                o.sendChatMessage(`Received a call from ${call.peer}`);
                addCamera(call.peer, incomingStream);
              });
            }, function(err) {
                    console.log('Failed to get local stream' ,err);
            });
        });
    }

    endcall() {
        if(this.currentCall) {
            this.sendChatMessage(`End call with ${this.currentCall.peer}`);
            this.currentCall.close();
            toggleCallBox();
        } 
    }

    jsonMessageFormatter(type) {
        let jsonMessage = {type: type}
        switch(type){
            case "spawn":
                jsonMessage.pathname = window.location.pathname;
            case "stream":
                jsonMessage.transform = {
                    position: player.position,
                    horizontalVelocity: player.horizontalVelocity
                }; 
                jsonMessage.animation = [
                    window.player.currentAnimation,
                    window.player.currentAnimationTime
                ];
        }
        return JSON.stringify(jsonMessage);
    }
}

export { RemoteController }