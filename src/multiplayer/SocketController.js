import { io } from 'socket.io-client'

export class SocketController {
    constructor() {

        this.socket = io();
        this.socket.on("connect", () => {
            this.socket.emit("intro", {
                config: VIRTUAL_ENVIRONMENT.configObject
            })
        });

        this.socket.on("intro", (data) => {
            this.socket.id = data.id;
            console.log(`%c [Socket Controller] Connected to server as: ${this.socket.id}`, 'color:#bada55');
        });

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