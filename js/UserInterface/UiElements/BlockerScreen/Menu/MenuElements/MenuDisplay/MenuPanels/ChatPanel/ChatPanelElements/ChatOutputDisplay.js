import { UiElement } from "../../../../../../../UiElement.js";

class ChatOutputDisplay extends UiElement {
    constructor(){
        super({
            id: "ChatOutputDisplay",
            style: {
                background: "white",
                overflow: 'scroll',
                overflowX: 'hidden',
                overflowY: 'auto',
                wordBreak: 'break-all'
            }
        })
    }

    displayNewMessage(message) {
        this.element.innerHTML = message;
    }
}
export { ChatOutputDisplay }