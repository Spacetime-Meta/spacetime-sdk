import { UiElement } from "../../UiElement.js";

export class WalletPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                marginTop: "150px"
            }
        })
    }
}