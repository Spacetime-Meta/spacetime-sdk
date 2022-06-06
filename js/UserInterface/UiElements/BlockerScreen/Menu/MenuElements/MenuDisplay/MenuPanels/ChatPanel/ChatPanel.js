import { UiElement } from "../../../../../../UiElement.js";

import { ChatOutputDisplay } from "./ChatPanelElements/ChatOutputDisplay.js";
import { ChatFooter } from "./ChatPanelElements/ChatFooter.js";

class ChatPanel extends UiElement {
    constructor(){
        super({
            id: "ChatPanel",
            style: { 
                height: "100%",
                display: "none",
                gridTemplateRows: "1fr 50px",
            }
        })

        this.chatOutputDisplay = new ChatOutputDisplay();
        this.chatFooter = new ChatFooter();

        this.appendChildList([
            this.chatOutputDisplay,
            this.chatFooter
        ])
    }
}
export { ChatPanel }