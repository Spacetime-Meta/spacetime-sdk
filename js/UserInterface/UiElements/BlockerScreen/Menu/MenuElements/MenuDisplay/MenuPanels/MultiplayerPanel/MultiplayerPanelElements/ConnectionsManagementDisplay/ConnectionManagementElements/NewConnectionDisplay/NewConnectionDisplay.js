import { UiElement } from "../../../../../../../../../../UiElement.js";

class NewConnectionDisplay extends UiElement {
    constructor(){
        super({
            id: "NewConnectionDisplay",
            style: {
                padding: "10px",
                margin: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "rgb(255,255,255)",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center"
            }
        })

        this.title = new UiElement({
            innerHTML: "Connect to peers",
            style: {
                fontWeight: "bold",
                fontSize: "25px",
                
            }
        });

        this.remoteIdInput = new UiElement({
            type: "input",
        });
        
        this.connectToPeer = new UiElement({
            type: "button",
            innerHTML: "connect",
            onClick: () => {
                VIRTUAL_ENVIRONMENT.remoteController.connectToPeer(this.remoteIdInput.element.value);
                this.remoteIdInput.element.value = "";
            }
        })

        this.info = new UiElement({
            innerHTML: "Enter a peerId to attempt connection."
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