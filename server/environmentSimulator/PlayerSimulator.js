const THREE = require('three');

const c = require('./CapsuleSimulator');

const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const PLAYER_DIMENSIONS = {
    HEIGHT: 1.5,
    WIDTH: 0.25
}

class PlayerSimulator extends c.CapsuleSimulator {
    constructor(socket) {
        console.log(`[Player Sim] New Sim { id: ${socket.id} }`);
        
        super(
            PLAYER_DIMENSIONS.HEIGHT,
            PLAYER_DIMENSIONS.WIDTH
        );

        this.socket = socket;
        this.keyStack = [];
        this.animation = ["idle", 0.5];
        
        this.socket.on("keys", (data) => {
            this.keyStack.push(data);
        })

        this.position.y = 3;
    }  

    getForwardVector(controlObject) {
        var temp = new THREE.Vector3();
        temp.copy(controlObject);
        temp.y = 0;
        temp.normalize();
        temp.multiplyScalar(-1);
        return temp;
    }
    
    getSideVector(controlObject) {
        var temp = new THREE.Vector3();
        temp.copy(controlObject);
        temp.y = 0;
        temp.normalize();
        temp.cross(UP_VECTOR);
        temp.multiplyScalar(-1);
        return temp;
    }

    update(delta, collider) {

        //reset the animations
        this.animation = ["idle", 0.5];
        
        // sometimes when loading we have a lot of 
        // keyframes that accumulates, just skip these frames
        // and pretend that it is not a problem
        if(this.keyStack.length > 25) { 
            this.keyStack = [];
            return; 
        }

        // this is the estimated time between each item of the keyStack
        const subDelta = delta / this.keyStack.length;
        
        for( var i=0; i < this.keyStack.length ; i++ ) {
            const currentFrame = this.keyStack[i];
            if(Object.keys(currentFrame.keys).length > 0) {
                 // speedFactor depending on the run/walk state
                if(currentFrame.keys["shift"]) {
                    this.isRunning = true;
                }
                this.speedFactor = this.isRunning ? 0.15 : 0.05;

                this.animation = this.isRunning ? ["run", 0.5] : ["walk", 0.5];

                if (currentFrame.keys["w"]) {
                    this.horizontalVelocity.add(this.getForwardVector(currentFrame.controlObject).multiplyScalar(this.speedFactor * subDelta));
                }

                if (currentFrame.keys["s"]) {
                    this.horizontalVelocity.add(this.getForwardVector(currentFrame.controlObject).multiplyScalar(-this.speedFactor * subDelta));
                }

                if (currentFrame.keys["a"]) {
                    this.horizontalVelocity.add(this.getSideVector(currentFrame.controlObject).multiplyScalar(-this.speedFactor * subDelta));
                }

                if (currentFrame.keys["d"]) {
                    this.horizontalVelocity.add(this.getSideVector(currentFrame.controlObject).multiplyScalar(this.speedFactor * subDelta));
                }

                if (currentFrame.keys[' '] && this.canJump) {
                    this.animation = ["jump", 0]
                    this.velocity.y = 10.0;
                }

                // the 'r' key should send the player back to the spawn
                // point of the current world he is in
                if (currentFrame.keys['r']) {
                    this.position.set(0,3,0);
                }

            } else {
                this.isRunning = false;
                this.horizontalVelocity.multiplyScalar(0);
            }
            
            // after updating the velocity we need to update the collider
            for(let i=0; i<5; i++){
                super.update(subDelta/5, collider, this.keyStack.length);
            }

            
        }            
        
        this.keyStack = [];

        if (this.position.y < -20) {
            this.position.set(0, 3, 0);
            this.velocity = new THREE.Vector3();
        }
    }
}
module.exports = { PlayerSimulator }