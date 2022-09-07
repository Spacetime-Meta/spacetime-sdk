const l = require('../utils/loader/Loader');
const es = require('../environmentSimulator/EnvironmentSimulator');

class GameRoom {
    constructor(config) {
        
        // save the configs 
        this.config = config;

        this.environmentSimulator = new es.EnvironmentSimulator(this.config);
    }

    addPlayer(socket) {
        // save the location of the player in the socket so we can find him later
        socket.room = this.config.id;

        this.environmentSimulator.addPlayer(socket);

        console.log(`[${this.config.id}] Added player { id: ${socket.id} }`);
    }

    removePlayer(socket) {
        this.environmentSimulator.removePlayer(socket);
    }

    update(delta) {
        this.environmentSimulator.update(delta);

        const gameState = {}

        // collect the position of each player
        for (var player in this.environmentSimulator.playerList) {
            const tempPlayer = this.environmentSimulator.playerList[player]
            gameState[tempPlayer.socket.id] = {
                position: [
                    tempPlayer.position.x,
                    tempPlayer.position.y,
                    tempPlayer.position.z
                ],
                horizontalVelocity: [
                    tempPlayer.horizontalVelocity.x,
                    tempPlayer.horizontalVelocity.y,
                    tempPlayer.horizontalVelocity.z
                ],
                animation: tempPlayer.animation
            }
        }

        // send the game state to every player
        for (var player in this.environmentSimulator.playerList) {
            this.environmentSimulator.playerList[player].socket.emit("gameState", gameState);
        }
    }
}
module.exports = { GameRoom }