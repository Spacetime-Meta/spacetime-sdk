import { UiElement } from "../../../../UiElement.js";

import { MenuHeaderButtons } from "./MenuHeaderElements/MenuHeaderButtons.js"

class MenuHeader extends UiElement {
    constructor() {
        super({
            id: "MenuHeader",
            style: {
                display: "flex",
                flexDirection: "row",
                background: "#383838"
            }
        })
        
        this.chatPanelButton = new MenuHeaderButtons("chat");
        this.multiplayerPanelButton = new MenuHeaderButtons("multiplayer");
        this.avatarPanelButton = new MenuHeaderButtons("avatar");
        this.mapPanelButton = new MenuHeaderButtons("map");

        this.appendChildList([
            this.chatPanelButton,
            this.multiplayerPanelButton,
            this.avatarPanelButton,
            this.mapPanelButton
        ])
    }

    handleMenuHeaderSelection(panel) {
        this.closeAllHeaders()
        switch(panel) {
            case "chat":
                this.chatPanelButton.element.style.background = "grey";
                this.chatPanelButton.options.style.background = "grey";
                break;
            case "multiplayer":
                this.multiplayerPanelButton.element.style.background = "grey";
                this.multiplayerPanelButton.options.style.background = "grey";
                break;
            case "avatar":
                this.avatarPanelButton.element.style.background = "grey";
                this.avatarPanelButton.options.style.background = "grey";
                break;
            case "map":
                this.mapPanelButton.element.style.background = "grey";
                this.mapPanelButton.options.style.background = "grey";
        }
    }

    closeAllHeaders() {
        this.chatPanelButton.element.style.background = "#383838";
        this.chatPanelButton.options.style.background = "#383838";
        this.multiplayerPanelButton.element.style.background = "#383838";
        this.multiplayerPanelButton.options.style.background = "#383838";
        this.avatarPanelButton.element.style.background = "#383838";
        this.avatarPanelButton.options.style.background = "#383838";
        this.mapPanelButton.element.style.background = "#383838";
        this.mapPanelButton.options.style.background = "#383838";
    }
}
export { MenuHeader }