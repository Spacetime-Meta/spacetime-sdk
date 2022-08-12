import { io } from 'socket.io-client'
import { Vector3 } from 'three' 

const tempVector = new Vector3();

export class SocketController {
    constructor() {

        this.socket = io();

        // this.socket.on("connect", () => {});
        this.socket.on("disconnect", () => {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = undefined;
        })

        this.socket.on("intro", (data) => {
            this.socket.id = data.id;
            console.log(`%c [Socket Controller] Connected to server as: ${this.socket.id}`, 'color:#bada55');
        });

        this.socket.on("position", (data) => {
            
            tempVector.fromArray(data.position);
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.serverTransform = tempVector;

            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.multiplayerDebugHitBox.position.fromArray(data.position);
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.multiplayerDebugHitBox.position.y -= 0.75;
        })

        this.socket.on("distribute", (data) => {
            console.log(`%c [Socket Controller] Migrating to game server: ${data.server}`, 'color:#bada55');
            this.socket.disconnect();
            this.socket = io(data.server);
        });

        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    update(delta) {

    }
}