import { UiElement } from "../../../../../../../../../../UiElement.js";

class NewConnectionDisplay extends UiElement {
    constructor(){
        super({
            id: "NewConnectionDisplay",
        })

        this.title = new UiElement({
            type: "h3",
            innerHTML: "Connect to peers"
        });

        this.remoteIdInput = new UiElement({
            type: "input"
        });
        
        this.connectToPeer = new UiElement({
            type: "button",
            innerHTML: "connect",
            onClick: () => {
                VIRTUAL_ENVIRONMENT.remoteController.connectToPeer(this.remoteIdInput.element.value);
            }
        })

        this.info = new UiElement({
            innerHTML: "Enter the peer id of your friends to connect"
        })

        this.appendChildList([
            this.title,
            this.remoteIdInput,
            this.connectToPeer,
            this.info
        ]);
    }
}
export { NewConnectionDisplay }