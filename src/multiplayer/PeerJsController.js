import { Vector3 } from 'three';
import { Peer } from 'peerjs';

import localProxy from "../util/localProxy.js";
import { AvatarController } from '../entities/AvatarController.js';

const ESCAPE_MAP = Object.freeze({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
});

const escapeHTML = function(input) {
	'use strict';
	if (input !== undefined) {
		return String(input).replace(/[&<>"']/g, function (match) {
			return ESCAPE_MAP[match];
		});
	} else {
		return input;
	}
}

export class PeerJsController {
    constructor() {
        this.connections = [];

        /* The following lines check if the user has a peerID in the local storage
         * and automatically creates a new peer if it finds one. This is a good feature for
         * production but is very annoying when testing. please leave like this until next
         * merge into the main branch.
         */ 
        if(typeof localProxy.peerId !== 'undefined'){
            this.peer = new Peer(localProxy.peerId);
            this.initPeer(this.peer)
        }

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    initPeer(peer) {
        peer.on('open', () => {
            this.onConnectionOpen();
        })

        peer.on("close", () => {
            window.VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuFooter.setIdDisplay("Not Connected")
        })
    }

    createPeerWithId(peerId){
        localProxy.peerId = peerId;
        this.peer = new Peer(peerId);
        this.initPeer(this.peer)
    }

    onConnectionOpen() {
        this.addMessageToChatBox("[info] Peer created with id: "+localProxy.peerId);
        window.VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.peerToPeerPanel.update();
        window.VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuFooter.setIdDisplay(`Connected as: ${localProxy.peerId}`);

        // listen for new connection
        this.peer.on('connection', (newConnection) => {
            window.VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.peerToPeerPanel.connectionsManagementDisplay.handleNewConnection(newConnection);
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
        
        this.connections.push(newConnection);
        
        // not sure why this is needed but if we don't give the connection some time it wont send the message
        setTimeout(() => {
            newConnection.send(this.jsonMessageFormatter("spawn"));
        }, 1000);
        

        // listen to new data
        newConnection.on('data', (data) => {
            this.onReceiveData(newConnection, data)
        })

        newConnection.on('close', ()=>{
            this.onConnectionClose(newConnection);
        })
    }

    onReceiveData(connection, data) {      
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error("[PeerJsController:onReceiveData] Error while parsing data to JSON.\nData: "+data);
        }
        if(typeof jsonData.type !== 'undefined') {
            switch(jsonData.type) {
                
                case "spawn":
                    if(jsonData.pathname === window.location.pathname) {
                        this.addMessageToChatBox("[info] Spawning: "+connection.peer);

                        // Spawn the other player
                        connection.avatarController = new AvatarController();
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

        let isValid = true;

        // verify that we are not connecting to self
        if(peerId === this.peer.id){
            console.warn("[PeerJsController:connectToPeer] You are trying to connect to your own peerId. Current id: " + localProxy.peerId);
            isValid = false;
        }

        // verify that we do not already have a connection to this peer
        this.connections.forEach(connection => {
            if(connection.peer === peerId){
                console.warn("[PeerJsController:connectToPeer] You are trying to duplicate a connection to peer: " + peerId);
                isValid = false;
            }
        })

        if(isValid) {
            this.addMessageToChatBox("[info] Trying connection to peer: " + peerId);
            const newConnection = this.peer.connect(peerId);
            window.window.VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.peerToPeerPanel.connectionsManagementDisplay.handleNewConnection(newConnection);

            // on new connection establish
            newConnection.on('open', () => {
                this.onConnectionConnect(newConnection);
            })

            // kill the attempt after a certain delay
            setTimeout(() => {
                if(!newConnection.open){ 
                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleConnectionClose(newConnection.peer)
                    newConnection.close();
                }
            }, 3000);
        }
    }

    onConnectionClose(connection) {
        if(typeof connection.avatarController !== "undefined"){
            connection.avatarController.removeAvatar();
        }
        const index = this.connections.indexOf(connection);
        this.connections.splice(index,1);
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleConnectionClose(connection.peer)
        this.addMessageToChatBox('[info] disconnected from peer: ' + connection.peer);
    }
    
    disconnectPeer(peerId) {
        this.connections.forEach((connection, index) => {
            if(connection.peer === peerId) {
                connection.close();
            }
        })
        
    }

    sendChatMessage(message) {
        let formatted = escapeHTML(message);

        if(typeof this.peer !== "undefined"){
            this.addMessageToChatBox("["+this.peer.id+"] "+formatted)
            this.connections.forEach(connection => {
                connection.send('{"type":"chat","message":"'+formatted+'"}');
            })
        } else {
            this.addMessageToChatBox("[info] You must connect to send messages in chat")
        }
    }

    addMessageToChatBox(message) {
        const formatted = escapeHTML(message);
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleNewMessage(formatted)
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

    jsonMessageFormatter(type) {
        let jsonMessage = {type: type}
        switch(type){
            case "spawn":
                jsonMessage.pathname = window.location.pathname;
            case "stream":
                jsonMessage.transform = {
                    position: VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position,
                    horizontalVelocity: VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.horizontalVelocity
                }; 
                jsonMessage.animation = [
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.currentAnimation,
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.currentAnimationTime
                ];
        }
        return JSON.stringify(jsonMessage);
    }

    update(delta) {
        this.connections.forEach(connection => {
            if(connection.needUpdate) {
                const position = VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position;
                const horizontalVelocity = VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.horizontalVelocity;

                connection.send(this.jsonMessageFormatter("stream"));

                if(typeof connection.transform !== 'undefined' && connection.avatarController){
                    connection.avatarController.update(delta, connection.transform.position, connection.transform.horizontalVelocity, connection.animation[0], connection.animation[1])
                }

                connection.needUpdate = false;
            }
        })
    }
}