import { UiElement } from "../../../../../../../../../UiElement.js";

class GoLiveButton extends UiElement {
    constructor(onClick) {
        super({
            id: "GoLiveButton",
            type: "button",
            innerHTML: "Go live",
            onClick: onClick
        })
    }
}
export { GoLiveButton }