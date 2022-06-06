import { UiElement } from "../../../../../../../../../../../UiElement.js";

class ConnectionOptions extends UiElement {
    constructor(onClose) {
        super({
            style: {
                display: "flex",
                flexDirection: "row"
            }
        })

        this.closeConnection = new UiElement({
            innerHTML: "&#9746;",
            style: {
                padding: "3px",
                cursor: "pointer",
                color: "black"
            },
            hover: {
                color: "#383838"
            },
            onClick: onClose,
        })

        this.call = new UiElement({
            innerHTML: "&#9742;",
            style: {
                padding: "3px",
                cursor: "pointer",
                color: "black"
            },
            hover: {
                color: "#383838"
            }
        })

        this.appendChildList([
            this.call,
            this.closeConnection
        ])
    }
}
export { ConnectionOptions }