import { UiElement } from "../../../../../../../UiElement.js";

import { InputBar } from "./ChatFooterElements/InputBar.js";
import { SendButton } from "./ChatFooterElements/SendButton.js";

class ChatFooter extends UiElement {
    constructor(){
        super({
            id: "ChatFooter",
            style: {
                background: "grey",
            }
        })

        this.inputBar = new InputBar();
        this.sendButton = new SendButton();

        this.appendChildList([
            this.inputBar,
            this.sendButton
        ])
    }
}
export { ChatFooter }