import { UiElement } from "../../../../../UiElement.js";

class MenuHeaderButtons extends UiElement {
    constructor(text, className = null, display = null) {
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

        if(className) this.element.className = className;
        if(display) this.element.style.display = display;

        this.element.addEventListener("click", () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.handleMenuPanelSelection(text)
        })
    }

    toggleMenuHeader(className, display) {
        for (let menuHeader of document.getElementsByClassName(className)) 
            menuHeader.style.display = display;
    }
}
export { MenuHeaderButtons }