const THREE = require('three');

const l = require('../utils/loader/Loader');
const bu = require('../utils/BufferGeometryUtils');
const b = require('../utils/three-mesh-bvh');
const p = require('./PlayerSimulator');

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
        console.log(`[${this.config.ID} (ES)] Starting new simulation { terrain: ${config.TERRAIN_URL} }`);

        // vars
        this.geometries = [];
        this.playerList = {};

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
        this.loader.loadOBJ(config.TERRAIN_URL, (result) => {
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

        console.log(`[${this.config.ID}] Collider loaded`);
    }

    update(delta) {
        for(var player in this.playerList) {
            this.playerList[player].update(delta, this.collider);
        }
    }
}
module.exports = { EnvironmentSimulator }