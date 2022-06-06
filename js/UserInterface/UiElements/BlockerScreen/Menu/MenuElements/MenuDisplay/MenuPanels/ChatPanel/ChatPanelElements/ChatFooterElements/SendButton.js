import { UiElement } from "../../../../../../../../UiElement.js";

class SendButton extends UiElement {
    constructor() {
        super({
            id: "SendButton",
            type: "button",
            innerHTML: "send"
        })
    }
}
export { SendButton }