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
                wordBreak: 'break-all',
                fontSize: "x-small",
            }
        })
    }

    displayNewMessage(message) {
        this.element.innerHTML += "<br>"+message;
    }
}
export { ChatOutputDisplay }