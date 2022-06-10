import { UiElement } from "../../UiElement.js";

import { MenuHeader } from "./MenuElements/MenuHeader/MenuHeader.js";
import { MenuFooter } from "./MenuElements/MenuFooter/MenuFooter.js";
import { MenuDisplay } from "./MenuElements/MenuDisplay/MenuDisplay.js";

class Menu extends UiElement {
    constructor() {
        super({
            id: "Menu",
            style: {
                background: "white",
                display: "grid",
                gridTemplateRows: "50px 1fr auto"
            }
        })

        this.menuHeader = new MenuHeader();
        this.menuDisplay = new MenuDisplay();
        this.menuFooter = new MenuFooter();

        this.appendChildList([
            this.menuHeader,
            this.menuDisplay,
            this.menuFooter
        ])

        // set multiplayer as default panel
        this.handleMenuPanelSelection("multiplayer");
    }

    handleMenuPanelSelection(panel) {
        this.menuDisplay.handleMenuPanelSelection(panel);
        this.menuHeader.handleMenuHeaderSelection(panel);
    }
}
export { Menu }