import { UiElement } from "../UiElement.js";

import { Blocker } from "./Blocker/Blocker.js"; 
import { Menu } from "./Menu/Menu.js";

class BlockerScreen extends UiElement {
    constructor(){
        super({
            id: "blockerScreen",
            style: {
                position: "absolute",
                top: "0",
                width: "100%",
                height: "100%"
            }
        })

        this.blocker = new Blocker();
        this.menu = new Menu()

        this.appendChildList([
            this.blocker.element,
            this.menu.element
        ])

        document.body.appendChild(this.element)
    }
}
export { BlockerScreen }