import { UiElement } from "../../UiElement.js"

class Blocker extends UiElement {
    constructor(handleControlsLock){
        super({
            id: "blocker",
            style: {
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                color: "white"
            },
            onClick: handleControlsLock
        })
    }
}

export { Blocker };