import { UiElement } from "../UiElement";

import nipplejs from 'nipplejs';

const FORWARD_QUADRANT_KEY_MAP = [
    {"d": true}, // 0
    {"d": true, "w": true}, // 1
    {"d": true, "w": true}, // 2
    {"w": true}, // 3
    {"w": true}, // 4
    {"a": true, "w": true}, // 5
    {"a": true, "w": true}, // 6
    {"a": true}, // 7
]

const BACKWARD_QUADRANT_KEY_MAP = [
    {"d": true}, // 0
    {"d": true, "s": true}, // 1
    {"d": true, "s": true}, // 2
    {"s": true}, // 3
    {"s": true}, // 4
    {"a": true, "s": true}, // 5
    {"a": true, "s": true}, // 6
    {"a": true}, // 7
]

class Joystick extends UiElement {
    constructor(){
        super({
            id: "joystick",
            style: {
                display: "block",
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "140px",
                height: "140px"
            }
        })

        setTimeout(() => { 
            this.init()
            this.ready = true 
        }, 100);
    }

    init() {
        const options = {
            zone: this.element,
            size: 120,
            multitouch: true,
            maxNumberOfNipples: 2,
            mode: 'static',
            restJoystick: true,
            shape: 'circle',
            position: { bottom: '80px', left: '80px' },
            dynamicPage: true,
        }
        
        // build the nipple manager according to the
        // documentation
        this.manager = nipplejs.create(options);
        
        // extract the joystick and apply the 
        // event listeners
        this.joystick = this.manager.get(0);
        this.joystick.on('start', () => { this.joystick.isActive = true });
        this.joystick.on('end', () => { this.joystick.isActive = false });
    }

    collectTouchKeys() {
        if(this.ready && this.joystick.isActive) {

            // calculate the joysticks angle from the 2d vector
            const joyAngle = Math.acos( this.joystick.frontPosition.x / Math.sqrt(Math.pow(this.joystick.frontPosition.x, 2) + Math.pow(this.joystick.frontPosition.y, 2)) ); 

            // calculate the quadrant
            const quadrant = Math.round(joyAngle / Math.PI * 7);

            // extract the keymap
            return this.joystick.frontPosition.y > 0 ? BACKWARD_QUADRANT_KEY_MAP[quadrant] : FORWARD_QUADRANT_KEY_MAP[quadrant];

        }
        return {};
    }
}

export { Joystick }; 