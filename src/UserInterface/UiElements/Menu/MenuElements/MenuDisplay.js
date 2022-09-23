import { UiElement } from "../../UiElement.js";

import { ChatPanel } from "../../MenuPanels/ChatPanel/ChatPanel.js";
import { PeerToPeerPanel } from "../../MenuPanels/PeerToPeerPanel/PeerToPeerPanel.js";
import { AvatarPanel } from "../../MenuPanels/AvatarPanel/AvatarPanel.js";
import { WalletPanel } from "../../MenuPanels/WalletPanel/WalletPanel.js";
import { OptionsPanel } from "../../MenuPanels/OptionsPanel/OptionsPanel.js";
import { MapPanel } from "../../MenuPanels/MapPanel/MapPanel.js";
import { HomePanel } from "../../MenuPanels/HomePanel/HomePanel.js";

class MenuDisplay extends UiElement {
    constructor() {
        super({
            id: "MenuDisplay",
            style: {
                marginTop: "50px"
            }
        })
        
        this.chatPanel = new ChatPanel();
        this.peerToPeerPanel = new PeerToPeerPanel();
        this.avatarPanel = new AvatarPanel();
        this.walletPanel = new WalletPanel();
        this.optionsPanel = new OptionsPanel();
        this.mapPanel = new MapPanel();
        this.homePanel = new HomePanel();

        this.appendChildList([
            this.homePanel,
            this.chatPanel,
            this.peerToPeerPanel,
            this.avatarPanel,
            this.walletPanel,
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
                this.peerToPeerPanel.element.style.display = "block";
                break;
            case "avatar":
                this.avatarPanel.element.style.display = "block";
                break;
            case "wallet":
                this.walletPanel.element.style.display = "block";
                break;
            case "options":
                this.optionsPanel.element.style.display = "block";
                break;
            case "home":
                this.homePanel.element.style.display = "block";
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
        this.peerToPeerPanel.element.style.display = "none";
        this.avatarPanel.element.style.display = "none";
        this.walletPanel.element.style.display = "none";
        this.optionsPanel.element.style.display = "none";
        this.mapPanel.element.style.display = "none";
        this.homePanel.element.style.display = "none";
    }
}
export { MenuDisplay }