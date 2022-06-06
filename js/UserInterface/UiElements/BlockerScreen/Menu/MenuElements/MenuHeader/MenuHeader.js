import { UiElement } from "../../../../UiElement.js";

import { MenuHeaderButtons } from "./MenuHeaderElements/MenuHeaderButtons.js"

class MenuHeader extends UiElement {
    constructor() {
        super({
            id: "MenuHeader",
            style: {
                display: "flex",
                flexDirection: "row",
                background: "red"
            }
        })
        
        this.chatPanelButton = new MenuHeaderButtons("chat");
        this.multiplayerPanelButton = new MenuHeaderButtons("multiplayer")

        this.appendChildList([
            this.chatPanelButton,
            this.multiplayerPanelButton
        ])
    }
}
export { MenuHeader }