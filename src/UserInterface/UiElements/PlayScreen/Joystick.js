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

        setTimeout(() => { this.init() }, 100);
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
        
        this.manager = nipplejs.create(options);
    }

    collectTouchKeys() {
        if(this.manager) {
            const joystick = this.manager.get(0);
                // console.log(joystick.computeDirection())
            
        } else {

        }
        return {};
    }
}

export { Joystick }; 