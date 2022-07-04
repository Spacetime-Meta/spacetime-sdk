import { UiElement } from "../../../UiElement.js";

class ChatFooter extends UiElement {
    constructor(){
        super({
            id: "ChatFooter",
            style: {
                background: "#c8c8c8",
                padding: "5px",
            }
        })

        this.inputBar = new UiElement({
            id: "InputBar",
            type: "input",
            style: {
                width: "280px"
            }
        });

        this.inputBar.element.addEventListener("keypress", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.handleSendMessage();
            }
        })

        this.sendButton = new UiElement({
            id: "SendButton",
            type: "button",
            innerHTML: "send", 
            onClick: () => this.handleSendMessage()
        });

        this.appendChildList([
            this.inputBar,
            this.sendButton,
        ])
    }

    handleSendMessage() {
        const message = this.inputBar.element.value;
        if(message !== ""){
            this.inputBar.element.value = "";
            VIRTUAL_ENVIRONMENT.remoteController.sendChatMessage(message);
        }
    }

    handleCreateJoinRoom() {
        const sessionId = this.inputBar.element.value;
        if(sessionId !== ""){
            this.inputBar.element.value = "";
            VIRTUAL_ENVIRONMENT.remoteController.createRoom(sessionId);
        }
    }
}
export { ChatFooter }