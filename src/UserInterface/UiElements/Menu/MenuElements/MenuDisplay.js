import { UiElement } from "../../UiElement.js";

import { ChatPanel } from "../../MenuPanels/ChatPanel/ChatPanel.js";
import { MultiplayerPanel } from "../../MenuPanels/MultiplayerPanel/MultiplayerPanel.js";
import { AvatarPanel } from "../../MenuPanels/AvatarPanel/AvatarPanel.js";
import { OptionsPanel } from "../../MenuPanels/OptionsPanel/OptionsPanel.js";
import { MapPanel } from "../../MenuPanels/MapPanel/MapPanel.js";

class MenuDisplay extends UiElement {
    constructor() {
        super({
            id: "MenuDisplay",
            style: {
                marginTop: "50px"
            }
        })
        
        this.chatPanel = new ChatPanel();
        this.multiplayerPanel = new MultiplayerPanel();
        this.avatarPanel = new AvatarPanel();
        this.optionsPanel = new OptionsPanel();
        this.mapPanel = new MapPanel();

        this.appendChildList([
            this.chatPanel,
            this.multiplayerPanel,
            this.avatarPanel,
            this.optionsPanel,
            this.mapPanel
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
            case "options":
                this.optionsPanel.element.style.display = "block";
                break;
            case "map":
                this.mapPanel.element.style.display = "flex";
                if(!this.mapPanel.isLoaded) {
                    this.mapPanel.initMap();
                }
                break;
        }
    }

    closeAllPanels() {
        this.chatPanel.element.style.display = "none";
        this.multiplayerPanel.element.style.display = "none";
        this.avatarPanel.element.style.display = "none";
        this.optionsPanel.element.style.display = "none";
        this.mapPanel.element.style.display = "none";
    }
}
export { MenuDisplay }