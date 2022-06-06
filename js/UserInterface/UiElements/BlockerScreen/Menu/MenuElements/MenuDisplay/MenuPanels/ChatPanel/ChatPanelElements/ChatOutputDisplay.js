import { UiElement } from "../../../../../../../UiElement.js";

class ChatOutputDisplay extends UiElement {
    constructor(){
        super({
            id: "ChatOutputDisplay",
            style: {
                height: "100%",
                background: "white",
                overflow: 'scroll',
                overflowX: 'hidden',
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