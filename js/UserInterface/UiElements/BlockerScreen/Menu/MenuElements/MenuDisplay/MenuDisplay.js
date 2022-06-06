import { UiElement } from "../../../../UiElement.js";

import { ChatPanel } from "./MenuPanels/ChatPanel/ChatPanel.js";
import { MultiplayerPanel } from "./MenuPanels/MultiplayerPanel/MultiplayerPanel.js";
import { AvatarPanel } from "./MenuPanels/AvatarPanel/AvatarPanel.js";

class MenuDisplay extends UiElement {
    constructor() {
        super({
            id: "MenuDisplay",
        })
        
        this.chatPanel = new ChatPanel();
        this.multiplayerPanel = new MultiplayerPanel();
        this.avatarPanel = new AvatarPanel();

        this.appendChildList([
            this.chatPanel,
            this.multiplayerPanel,
            this.avatarPanel
        ])
    }

    handleMenuPanelSelection(panel) {
        this.closeAllPanels()
        switch(panel) {
            case "chat":
                this.chatPanel.element.style.display = "grid";
                break;
            case "multiplayer":
                this.multiplayerPanel.element.style.display = "block";
                break;
            case "avatar":
                this.avatarPanel.element.style.display = "block";
                break;
        }
    }

    closeAllPanels() {
        this.chatPanel.element.style.display = "none";
        this.multiplayerPanel.element.style.display = "none";
        this.avatarPanel.element.style.display = "none";
    }
}
export { MenuDisplay }