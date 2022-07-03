import { UiElement } from "../UiElement.js";

import { Blocker } from "./Blocker/Blocker.js"; 
import { Menu } from "../Menu/Menu.js";

export class BlockerScreen extends UiElement {
    constructor(){
        super({
            id: "blockerScreen",
            style: {
                position: "absolute",
                top: "0",
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "350px 1fr",
            }
        })

        this.blocker = new Blocker();
        this.menu = new Menu()

        this.appendChildList([
            this.menu,
            this.blocker
        ])

        document.body.appendChild(this.element)
    }
}