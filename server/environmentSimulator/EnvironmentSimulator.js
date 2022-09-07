const THREE = require('three');

const l = require('../utils/loader/Loader');
const bu = require('../utils/BufferGeometryUtils');
const b = require('../utils/three-mesh-bvh');
const p = require('./PlayerSimulator');
const t = require('./SquareWalkOnTriggerSimulator');

/**
 * The config must always contain the following
 * {
 *      TERRAIN_URL: url,
 * }
 * 
 * The config can contain the following options,
 * will be defaulted if not included
 * {
 *      position: THREE.Vector3,
 *      scaleFactor: number,
 *      portalMap: map
 * }
*/

const clock = new THREE.Clock();

class EnvironmentSimulator {
    constructor(config) {
        this.config = config;
        console.log(`[${this.config.id} (ES)] Starting new simulation { terrain: ${this.config.socket.geometry} }`);

        // vars
        this.geometries = [];
        this.playerList = {};
        this.interactives = [];

        const defaultOptions = {
            position: new THREE.Vector3(),
            scaleFactor: 1,
            portalMap: {}
        };

        for (let opt in defaultOptions) {
            config[opt] = typeof config[opt] === 'undefined' ? defaultOptions[opt] : config[opt];
        };

        // THREE.GLTFLoader wrapper
        this.loader = new l.Loader();
        this.loader.loadOBJ(this.config.socket.geometry, (result) => {
            this.handleLoadedTerrain(result, this.config);  
        })
    }

    addPlayer(socket) {
        this.playerList[socket.id] = new p.PlayerSimulator(socket);
    }

    removePlayer(socket) {
        delete this.playerList[socket.id];
        for(var player in this.playerList) {
            this.playerList[player].socket.emit("disconnectPlayer", {
                id: socket.id
            })
        }
    }

    handleLoadedTerrain(terrain, config) {
        this.terrain = terrain;

        //apply configs
        this.terrain.position.copy(config.position);
        this.terrain.scale.set(config.scaleFactor, config.scaleFactor, config.scaleFactor);

        this.terrain.traverse(object => {
            if (object.isMesh) {

                //apply wold position from geometry 
                const cloned = new THREE.Mesh(object.geometry, object.material);
                object.getWorldPosition(cloned.position);
            }
            if (object.isLight) {
                object.parent.remove(object);
            }
        });

        this.terrain.traverse(object => {

            if (object.geometry && object.visible) {

                if(object.name.substring(0,5) === "_stm_") {
                    const type = object.name.substring(5).substring(0,object.name.substring(5).indexOf('_'));

                    switch (type) {

                        // case "spawnPoint": {
                        //     VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.spawnPoint = object.position;
                        //     VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.position.copy(object.position);
                        // } break;

                        case "portal": {
                            const id = object.name.substring(12, 12 + object.name.substring(12).indexOf('_'))
                            this.interactives.push( new t.SquareWalkOnTriggerSimulator(object, () => {
                        
                                // console.log(`Officer, we have detected portal no${id}!`);

                                // console.log(this.config);
                            }) );
                        } break;
                    }
                }



                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { 
                        cloned.deleteAttribute(key);
                    }
                }
                this.geometries.push(cloned);
            }
        });

        const mergedGeometry = bu.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new b.MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new THREE.Mesh(mergedGeometry);
        this.collider.bvh = mergedGeometry.boundsTree;
        // this.bvh = new b.MeshBVH(
        //     bu.mergeBufferGeometries(this.geometries, false), 
        //     { lazyGeneration: false }
        // );

        console.log(`[${this.config.id}] Collider loaded with ${this.interactives.length} interactive items`);
    }

    update(delta) {
        for(var player in this.playerList) {
            this.playerList[player].update(delta, this.collider);
        }

        for(var interactive in this.interactives) {
            this.interactives[interactive].update(delta, this.playerList);
        }
    }
}
module.exports = { EnvironmentSimulator }