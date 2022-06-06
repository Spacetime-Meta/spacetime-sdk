import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import localProxy from "./localProxy.js";
// import goLivePanel from '../UserInterface/UiElements/goLivePanel.js';
// import peerIdDisplay from '../UserInterface/UiElements/peerIdDisplay.js';
// import {chatBox, toggleConnectRoom} from '../UserInterface/UiElements/chatBox.js';
// import friendManagement from '../UserInterface/buttons/friendManagement.js';
// import { friendManagementPanel } from '../UserInterface/UiElements/friendManagementPanel.js';
import { AvatarController } from '../entities/AvatarController.js';
// import { toggleCallBox, callBox, addCamera } from '../UserInterface/UiElements/callBox.js';
import { PeerGroup, escapeHTML } from './peerjs-groups.js';
// import alertBox from '../UserInterface/UiElements/alertBox.js';

// PeerJs is injected in the window
const Peer = window.Peer;
const SIGNALLING_OPTIONS =  {
    secure: 'wss://',
    host: 'spacetime-peerserver.herokuapp.com',
    port: 443
};
let connected = false;
let group, myUserID;
let joinRequests = [];


class RemoteController {
    constructor(manager) {
        this.connections = [];
        this.manager = manager;
        this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if(!this.getUserMedia) console.log('Your browser doesn\'t support getUserMedia.');
        
        // goLivePanel(this);

        /* The following lines check if the user has a peerID in the local storage
         * and automatically creates a new peer if it finds one. This is a good feature for
         * production but is very annoying when testing. please leave like this until next
         * merge into the main branch.
         */ 
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
        // callBox(this, peerId);

        // listen for a call
        // this.answer();
    }

    onConnectionOpen() {
        // chatBox(this);

        this.addMessageToChatBox("[info] Peer created with id: "+localProxy.peerId);
        // peerIdDisplay(localProxy.peerId, this)
        // this.friendManagementPanel = new friendManagementPanel(this);
        // friendManagement(this, this.friendManagementPanel);

        // listen for new connection
        this.peer.on('connection', (newConnection) => {
            this.onConnectionConnect(newConnection)
        })

        this.initFriendList()
    }

    initFriendList() {
        // try connect to friends
        if(typeof localProxy.friendList !== 'undefined'){
            localProxy.friendList.forEach(friend => {
                this.connectToPeer(friend)
            })
        }
        else {
            localProxy.friendList = [];
        }
    }

    onConnectionConnect(newConnection) {
        this.addMessageToChatBox('[info] new connection to peer: ' + newConnection.peer)

        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.multiplayerPanel.connectionsManagementDisplay.handleNewConnection(newConnection);
                
        newConnection.connectionStatus = 1;
        this.connections.push(newConnection);
        
        // not sure why this is needed but if we dont give the connection some time it wont send the message
        setTimeout(() => {
            newConnection.send(this.jsonMessageFormatter("spawn"));
        }, 500);
        

        // listen to new data
        newConnection.on('data', (data) => {
            this.onReceiveData(newConnection, data)
        })

        newConnection.on('close', ()=>{
            this.onConnectionTimeOut(newConnection);
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
                    connection.connectionStatus = 2;
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
        if(peerId !== localProxy.peerId){
            console.log("[info] Trying connection to peer: " + peerId);
            const newConnection = this.peer.connect(peerId);

            newConnection.connectionStatus = 1;

            // on new connection establish
            newConnection.on('open', () => {
                this.onConnectionConnect(newConnection);
            })

            // kill the attempt after a certain delay
            setTimeout(() => {
                if(newConnection.connectionStatus === 1){
                    this.onConnectionTimeOut(newConnection)
                }
            }, 3000);

        } else {
            console.warn("[RemoteController:connectToPeer] You are trying to connect to your own peerId. Current id: "+localProxy.peerId);
        }
    }

    onConnectionTimeOut(connection) {
        console.log("[info] No response from peer, connection time out: " + connection.peer);
        connection.avatarController.removeAvatar();
        const index = this.connections.indexOf(connection);
        this.connections.splice(index,1);
        connection.close();
    }
    
    disconnectPeer(peerId) {
        console.log("[info] Trying disconnect to peer: " + peerId);
        this.connections.forEach((connection, index) => {
            if(connection.peer === peerId) {
                connection.close();
                this.connections.splice(index, 1);
            }
        })
        this.addMessageToChatBox('[info] disconnected from peer: ' + peerId);
    }

    sendChatMessage(message) {
        let formatted = escapeHTML(message);
        if (connected) {
            group.send(formatted);
        } else {
            this.connections.forEach(connection => {
                connection.send('{"type":"chat","message":"'+formatted+'"}');
            })
        }
        
        this.addMessageToChatBox("["+localProxy.peerId+"] "+formatted)
    }

    addMessageToChatBox(message) {
        const formatted = escapeHTML(message);
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleNewMessage(formatted)
    }

    update(delta) {
        this.connections.forEach(connection => {
            if(connection.needUpdate) {
                const position = LOCAL_PLAYER.position;
                const horizontalVelocity = LOCAL_PLAYER.horizontalVelocity;

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
                    position: LOCAL_PLAYER.position,
                    horizontalVelocity: LOCAL_PLAYER.horizontalVelocity
                }; 
                jsonMessage.animation = [
                    LOCAL_PLAYER.currentAnimation,
                    LOCAL_PLAYER.currentAnimationTime
                ];
        }
        return JSON.stringify(jsonMessage);
    }

    initializeNetworking() {
        let me = this;
        group = new PeerGroup(
            function (error) {
                console.error(error.type + ': ' + error);
                debugger;
            },
            SIGNALLING_OPTIONS
        );
    
        group.addEventListener('connected', function (event) {
            if(!event.administrator) {
                alertBox("Information", `Connected to ${event.sessionID}. Waiting for permission to join the conversation&hellip;`);
            }
        });

        group.addEventListener('joined', function (event) {        
            me.addMessageToChatBox(`[Info] You're in room ${event.sessionID}`);
            me.addMessageToChatBox(`${event.userID} is present.`);
        });

        group.addEventListener('joinrequest', function (event) {
            joinRequests.push(event.userID);
            if (joinRequests.length == 1) {
                alertBox("Wants to Join the Conversation", `Do you want to accept ${event.userID}'s request to join?`, () => {
                    var userID = joinRequests.shift();
	                group.acceptUser(userID);
                });
            }
        });
    
        group.addEventListener('userpresent', function (event) {
            me.addMessageToChatBox(`${event.userID} is present.`);
        });
    
        group.addEventListener('userleft', function (event) { 
            me.addMessageToChatBox(`${event.userID} is left.`);
        });
    
        group.addEventListener('message', function (event) {
            me.addMessageToChatBox(`${event.userID}: ${event.message}`);
        });
    }

    createRoom(sessionId) {
        this.addMessageToChatBox(`[Info] accessing room ${sessionId}...`);
        this.initializeNetworking();
        connected = true;
        group.connect(sessionId, localProxy.peerId);
        toggleConnectRoom(this);
    }

    disconnectRoom() {
        if(connected) {
            group.disconnect();
            connected = false;
            this.addMessageToChatBox(`${localProxy.peerId}: has left this conversation`);
            toggleConnectRoom(this);
        }
    }

    isConnected() {
        return group && connected;
    }
}

export { RemoteController }