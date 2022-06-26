import { UiElement } from "../../../../../UiElement.js";

export class MenuHeaderButtons extends UiElement {
    constructor(text, menu) {
        super({
            style: {
                color: "back",
                cursor: "pointer",
                padding: "5px",
                fontWeight: "bold",
                textAlign: "center",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8",
                color: "#3a3a3a",
            },
            innerHTML: text,
            onClick: () => {
                VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.handleMenuPanelSelection(text);
                menu.toggleMenu();
            }
        })
    }
}