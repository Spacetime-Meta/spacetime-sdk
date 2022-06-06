import { UiElement } from "../../../../../UiElement.js";

class MenuHeaderButtons extends UiElement {
    constructor(text) {
        super({
            style: {
                color: "white",
                cursor: "pointer",
                background: "#383838",
                padding: "5px",
                border: "1px solid #383838"
            },
            hover: {
                background: "grey"
            },
            innerHTML: text
        })

        this.element.addEventListener("click", () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.handleMenuPanelSelection(text)
        })
    }
}
export { MenuHeaderButtons }