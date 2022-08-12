import { io } from 'socket.io-client'
import { Vector3 } from 'three' 

import { AvatarController } from '../entities/AvatarController.js';

const tempVector = new Vector3();

export class SocketController {
    constructor() {

        this.socket = io();

        this.playerList = {};

        // this.socket.on("connect", () => {});
        this.socket.on("disconnect", () => {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = undefined;
        });

        this.socket.on("disconnectPlayer", (data) => {
            this.playerList[data.id].removeAvatar();
            delete this.playerList[data.id];
        })

        this.socket.on("intro", (data) => {
            this.socket.id = data.id;
            console.log(`%c [Socket Controller] Connected to server as: ${this.socket.id}`, 'color:#bada55');
        });

        this.socket.on("gameState", (data) => {
            for(var entry in data) {
                if(parseInt(entry) === this.socket.id) {

                    tempVector.fromArray(data[entry].position)
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = tempVector;
                    
                    // send this to socket class
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.multiplayerDebugHitBox.position.copy(tempVector);
                    VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.multiplayerDebugHitBox.position.y -= 0.75;

                } else {
                    if(this.playerList[entry]) {
                        this.playerList[entry].serverState.position.fromArray(data[entry].position);
                        this.playerList[entry].serverState.horizontalVelocity.fromArray(data[entry].horizontalVelocity);
                        this.playerList[entry].serverState.animation = data[entry].animation;
                    } else {
                        console.log(`%c [Socket Controller] Connected to new player: ${entry}`, 'color:#bada55');
                        this.playerList[entry] = new AvatarController();
                        this.playerList[entry].spawnAvatar({});

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