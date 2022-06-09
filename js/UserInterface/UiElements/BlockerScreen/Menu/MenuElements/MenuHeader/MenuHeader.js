import { UiElement } from "../../../../UiElement.js";

import { MenuHeaderButtons } from "./MenuHeaderElements/MenuHeaderButtons.js"

class MenuHeader extends UiElement {
    constructor() {
        super({
            id: "MenuHeader",
            style: {
                display: "flex",
                flexDirection: "row",
                boxShadow: "0 4px 4px #888888",
                zIndex: "100",
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
                this.chatPanelButton.element.style.background = "#c8c8c8";
                this.chatPanelButton.options.style.background = "#c8c8c8";
                break;
            case "multiplayer":
                this.multiplayerPanelButton.element.style.background = "#c8c8c8";
                this.multiplayerPanelButton.options.style.background = "#c8c8c8";
                break;
            case "avatar":
                this.avatarPanelButton.element.style.background = "#c8c8c8";
                this.avatarPanelButton.options.style.background = "#c8c8c8";
                break;
            case "map":
                this.mapPanelButton.element.style.background = "#c8c8c8";
                this.mapPanelButton.options.style.background = "#c8c8c8";
        }
    }

    closeAllHeaders() {
        this.chatPanelButton.element.style.background = "#e0e0e0";
        this.chatPanelButton.options.style.background = "#e0e0e0";
        this.multiplayerPanelButton.element.style.background = "#e0e0e0";
        this.multiplayerPanelButton.options.style.background = "#e0e0e0";
        this.avatarPanelButton.element.style.background = "#e0e0e0";
        this.avatarPanelButton.options.style.background = "#e0e0e0";
        this.mapPanelButton.element.style.background = "#e0e0e0";
        this.mapPanelButton.options.style.background = "#e0e0e0";
    }
}
export { MenuHeader }