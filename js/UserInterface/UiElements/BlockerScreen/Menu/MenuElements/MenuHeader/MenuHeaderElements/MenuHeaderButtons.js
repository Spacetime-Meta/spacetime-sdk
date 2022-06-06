import { UiElement } from "../../../../../UiElement.js";

class MenuHeaderButtons extends UiElement {
    constructor(text) {
        super({
            style: {
                color: "blue",
                cursor: "pointer",
                background: "grey",
                padding: "5px",
                border: "1px solid #9e9e9e"
            },
            hover: {
                background: "yellow"
            },
            innerHTML: text
        })

        this.element.addEventListener("click", () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.handleMenuPanelSelection(text)
        })
    }
}
export { MenuHeaderButtons }