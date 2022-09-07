var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');

const SERVER_CONFIG = {
    PORT: 2000,
    ID: "STM MAIN SERVER",
    TARGET_TPS: 10,
    DEFAULT_WORLD: {
        CHUNK_LOCATION: "0,0,0", 
        CONFIG: "./server/client/configs/spawnPlanet.json",
    }
}

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
server.listen((process.env.PORT || SERVER_CONFIG.PORT), function () {
    console.log(`[${SERVER_CONFIG.ID}] Server started on port: ${SERVER_CONFIG.PORT}`);
});

//┌─────────────────────────────────────────────────────────────────────────┐
//│ World Pool setup                                                        │
//└─────────────────────────────────────────────────────────────────────────┘

const gr = require('./gameRoom/GameRoom.js');
const WORLD_POOL = {};

// load the default world config
let rawData = fs.readFileSync(SERVER_CONFIG.DEFAULT_WORLD.CONFIG);
const SPAWN_CONFIG = JSON.parse(rawData);

// assign the id
SPAWN_CONFIG.id = SERVER_CONFIG.DEFAULT_WORLD.CHUNK_LOCATION;

// always init the spawn planet as it is the default world
WORLD_POOL[SPAWN_CONFIG.id] = new gr.GameRoom(SPAWN_CONFIG);

//┌─────────────────────────────────────────────────────────────────────────┐
//│ SocketIo setup                                                          │
//└─────────────────────────────────────────────────────────────────────────┘

const io = require('socket.io')(server, {});
io.sockets.on('connection', (socket) => {

    // give unique id to the socket connection
    socket.id = Math.round(Math.random() * 0xffffff);
    console.log(`[${SERVER_CONFIG.ID}] New socket connection { id: ${socket.id} }`);
    socket.emit("intro", {id: socket.id});

    socket.on("disconnect", () => {
        console.log(`[${SERVER_CONFIG.ID}] Disconnected socket { id: ${socket.id} }`);
        WORLD_POOL[socket.room].removePlayer(socket);
    });

    socket.on("intro", (data) => {

        // add user to the given world
        if(WORLD_POOL[data.location]) {
            WORLD_POOL[data.location].addPlayer(socket);
        } else {

            // get config of the specified world

            // create new game room

            // add player to this new game room

        }
    })
});

//┌─────────────────────────────────────────────────────────────────────────┐
//│ Game loop                                                               │
//└─────────────────────────────────────────────────────────────────────────┘

setInterval(() => {
    for(var world in WORLD_POOL) {
        WORLD_POOL[world].update(1 / SERVER_CONFIG.TARGET_TPS)
    }
}, 1000 / SERVER_CONFIG.TARGET_TPS);