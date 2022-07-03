import { UiElement } from "../../UiElement.js";

export class OptionsPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none"
            }
        })

        this.appendChild( new UiElement({
            innerHTML: "options",
        }))

        this.appendChild( new UiElement({
            innerHTML: "options",
        }))

        this.appendChild( new UiElement({
            innerHTML: "options",
        }))
    } 
}