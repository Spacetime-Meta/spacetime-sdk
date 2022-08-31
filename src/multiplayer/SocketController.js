import { io } from 'socket.io-client'
import { Vector3, Mesh, BoxGeometry } from 'three' 

import { AvatarController } from '../entities/AvatarController.js';

const tempVector = new Vector3();

export class SocketController {
    constructor() {

        this.socket = io();

        this.playerList = {};

        // this.socket.on("connect", () => {});

        this.socket.on("disconnect", () => {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = undefined;
            console.log(`%c [Socket Controller] Disconnected from server`, 'color:#bada55');
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuFooter.setIdDisplay("Not Connected");
        });

        this.socket.on("disconnectPlayer", (data) => {
            this.playerList[data.id].removeAvatar();
            delete this.playerList[data.id];
        })

        this.socket.on("intro", (data) => {
            this.socket.id = data.id;
            console.log(`%c [Socket Controller] Connected to server as: ${this.socket.id}`, 'color:#bada55');
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuFooter.setIdDisplay(`Connected as: ${this.socket.id}`);
        });

        this.socket.on("gameState", (data) => {
            for(var entry in data) {
                if(parseInt(entry) === this.socket.id) {

                    tempVector.fromArray(data[entry].position)
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = tempVector;
                    
                    if(this.serverHitbox) {
                        this.serverHitbox.position.copy(tempVector);
                        this.serverHitbox.position.y -= 0.75;
                    }

                } else {
                    if(this.playerList[entry]) {
                        
                        // execute this when the player is already created
                        this.playerList[entry].serverState.position.fromArray(data[entry].position);
                        this.playerList[entry].serverState.horizontalVelocity.fromArray(data[entry].horizontalVelocity);
                        this.playerList[entry].serverState.animation = data[entry].animation;
                    } else {

                        // execute this when we receive inf for a player that is not existent
                        console.log(`%c [Socket Controller] Connected to new player: ${entry}`, 'color:#bada55');
                        this.playerList[entry] = new AvatarController();
                        this.playerList[entry].spawnAvatar({
                            name: "yBot",
                            mesh: 'https://elegant-truffle-070d6b.netlify.app/yBot.glb',
                            animations: 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb',
                            mapping: { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 },
                            scaleFactor: 0.01,
                            offset: 0.75
                        });

                        this.playerList[entry].serverState = {
                            position: new Vector3(data[entry].position),
                            horizontalVelocity: new Vector3(data[entry].horizontalVelocity),
                            animation: data[entry].animation
                        };
                    }
                }
            }
        })

        this.socket.on("distribute", (data) => {
            console.log(`%c [Socket Controller] Migrating to game server: ${data.server}`, 'color:#bada55');
            this.socket.disconnect();
            this.socket = io(data.server);
        });

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    toggleServerHitbox() {
        if(this.serverHitbox) {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.remove(this.serverHitbox);
            delete this.serverHitbox;
        } else {
            // multiplayer debugger
            this.serverHitbox = new Mesh(new BoxGeometry( 
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.radius * 2, 
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.size + VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.radius * 2,
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.radius * 2 
            ));
            this.serverHitbox.material.wireframe = true;
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.add(this.serverHitbox);
        }
    }

    update(delta) {
        for (var player in this.playerList) {
            this.playerList[player].update(
                delta,
                this.playerList[player].serverState.position,
                this.playerList[player].serverState.horizontalVelocity,
                this.playerList[player].serverState.animation[0],
                this.playerList[player].serverState.animation[1]
            );
        }
    }
}