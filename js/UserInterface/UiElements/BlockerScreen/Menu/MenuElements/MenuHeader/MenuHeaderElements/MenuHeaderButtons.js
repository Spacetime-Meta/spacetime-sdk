import { UiElement } from "../../../../../UiElement.js";

class MenuHeaderButtons extends UiElement {
    constructor(text) {
        super({
            style: {
                color: "back",
                cursor: "pointer",
                padding: "5px",
                fontWeight: "bold",
                width: "100%",
                textAlign: "center",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8",
                color: "#3a3a3a",
            },
            innerHTML: text
        })

        this.element.addEventListener("click", () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.handleMenuPanelSelection(text)
        })
    }
}
export { MenuHeaderButtons }