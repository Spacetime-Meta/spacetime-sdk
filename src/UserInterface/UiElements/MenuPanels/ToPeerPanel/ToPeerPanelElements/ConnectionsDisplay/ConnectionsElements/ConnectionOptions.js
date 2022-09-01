import { UiElement } from "../../../../../UiElement.js";

class ConnectionOptions extends UiElement {
    constructor(onClose, starState, onStar, onCall) {
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

        this.starConnection = new UiElement({
            innerHTML: starState ? "&#9733;" : "&#9734;",
            style: {
                padding: "3px",
                cursor: "pointer",
                color: "black"
            },
            hover: {
                color: "#383838"
            },
            onClick: onStar,
        })

        // this.call = new UiElement({
        //     innerHTML: "&#9742;",
        //     style: {
        //         padding: "3px",
        //         cursor: "pointer",
        //         color: "black"
        //     },
        //     hover: {
        //         color: "#383838"
        //     },
        //     onClick: onCall,
        // })

        this.appendChildList([
            // this.call,
            this.starConnection,
            this.closeConnection
        ])
    }

    setStar(state) {
        if(state === "star"){
            this.starConnection.element.innerHTML = "&#9733;";
        } else {
            this.starConnection.element.innerHTML = "&#9734;";
        }
    }
}
export { ConnectionOptions }