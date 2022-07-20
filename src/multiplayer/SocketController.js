import { io } from 'socket.io-client'

export class SocketController {
    constructor() {
        const socket = io();

        socket.on("transform", function (data) {
            // console.log(data);
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.fromArray(data.playerObject.position);
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.horizontalVelocity.fromArray(data.playerObject.horizontalVelocity);
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.velocity.fromArray(data.playerObject.velocity);
        })
    }
}