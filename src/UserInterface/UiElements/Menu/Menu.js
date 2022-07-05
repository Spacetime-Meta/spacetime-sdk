import { UiElement } from "../UiElement.js";

import { MenuHeader } from "./MenuElements/MenuHeader.js";
import { MenuFooter } from "./MenuElements/MenuFooter.js";
import { MenuDisplay } from "./MenuElements/MenuDisplay.js";

export class Menu extends UiElement {
    constructor() {
        super({
            id: "Menu",
            style: {
                background: "white",
                overflow: "scroll",
                overflow: "auto"
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
        this.handleMenuPanelSelection("options");
    }

    handleMenuPanelSelection(panel) {
        this.menuDisplay.handleMenuPanelSelection(panel);
        this.menuHeader.handleMenuHeaderSelection(panel);
    }
}