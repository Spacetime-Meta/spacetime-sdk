var express = require('express');
var app = express();
var server = require('http').Server(app);

/**
 * The config must always contain the following
 * {
 *      PORT: number,
 *      ID: string,
 *      TARGET_TPS: number,
 * }
*/
const CONFIG = require('./config.js');

//┌─────────────────────────────────────────────────────────────────────────┐
//│ Start Express Server                                                    │
//└─────────────────────────────────────────────────────────────────────────┘

// when going to an empty path like localhost:2000, the app will
// send you to the lobby
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/client/index.html');
});

// this allows us to access any file in the /client repo
app.use('/client', express.static(__dirname + '/client'));

// the server will listen to port from config file
server.listen((process.env.PORT || CONFIG.PORT), function () {
    console.log(`[${CONFIG.ID}] Server started on port: ${CONFIG.PORT}`);
});

//┌─────────────────────────────────────────────────────────────────────────┐
//│ World Pool setup                                                        │
//└─────────────────────────────────────────────────────────────────────────┘

const gr = require('./gameRoom/GameRoom.js');
const WORLD_POOL = {};

//┌─────────────────────────────────────────────────────────────────────────┐
//│ Lobby Room                                                              │
//└─────────────────────────────────────────────────────────────────────────┘

WORLD_POOL["LOBBY"] = new gr.GameRoom({
    ID: "LOBBY",
    TERRAIN_URL: "./server/client/assets/devPlanet.obj" 
});

//┌─────────────────────────────────────────────────────────────────────────┐
//│ SocketIo setup                                                          │
//└─────────────────────────────────────────────────────────────────────────┘

const io = require('socket.io')(server, {});
io.sockets.on('connection', function (socket) {

    // give unique id to the socket connection
    socket.id = Math.round(Math.random() * 0xffffff);
    console.log(`[${CONFIG.ID}] New socket connection { id: ${socket.id} }`);
    socket.emit("intro", {id: socket.id});

    socket.on("disconnect", () => {
        console.log(`[${CONFIG.ID}] Disconnected socket { id: ${socket.id} }`);
        WORLD_POOL[socket.room].removePlayer(socket);
    });

    // send user to the LOBBY room
    WORLD_POOL["LOBBY"].addPlayer(socket);
});

//┌─────────────────────────────────────────────────────────────────────────┐
//│ Game loop                                                               │
//└─────────────────────────────────────────────────────────────────────────┘

setInterval(() => {
    for(var world in WORLD_POOL) {
        WORLD_POOL[world].update(1 / CONFIG.TARGET_TPS)
    }
}, 1000 / CONFIG.TARGET_TPS);