import { UiElement } from "../UiElement";

import nipplejs from 'nipplejs';

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

        this.isForward = true;
        this.isMaxed = false;
        this.quadrant = NaN;

        setTimeout(() => { 
            this.init()
            VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
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

    update() {
        if(this.joystick.isActive) {
            // calculate the joysticks angle from the 2d vector
            const joyAngle = Math.acos( this.joystick.frontPosition.x / Math.sqrt(Math.pow(this.joystick.frontPosition.x, 2) + Math.pow(this.joystick.frontPosition.y, 2)) ); 

            // calculate and update the quadrant
            this.quadrant = Math.round(joyAngle / Math.PI * 7);
        } else {
            this.quadrant = NaN;
        }

        
        // update the isMaxed state
        this.isMaxed = Math.sqrt(Math.pow(this.joystick.frontPosition.x, 2) + Math.pow(this.joystick.frontPosition.y, 2)) > 59.95;

        //update the isForward state
        this.isForward = this.joystick.frontPosition.y > 0;
    }
}

export { Joystick }; 