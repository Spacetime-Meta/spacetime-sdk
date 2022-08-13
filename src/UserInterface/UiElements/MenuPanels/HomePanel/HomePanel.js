import { UiElement } from "../../UiElement.js";

export class HomePanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                marginTop: "150px"
            }
        })

        this.appendChild( new UiElement({
            innerHTML: "Home page"
        }))
    }
}