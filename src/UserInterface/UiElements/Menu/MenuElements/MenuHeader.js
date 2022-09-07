import { UiElement } from "../../UiElement.js";

import { MenuHeaderButtons } from "./MenuHeaderButtons.js"

class MenuHeader extends UiElement {
    constructor() {
        super({
            id: "MenuHeader",
            style: {
                boxShadow: "0 4px 4px #888888",
                background: "#E0E0E0",
                zIndex: "100",
                height: "50px",
                position: "absolute",
                width: "350px",
                transition: "all 0.5s ease",
                overflow: "hidden"
            }
        })

        this.isOpen = false;
        this.isPeerToPeer = false;

        this.toggleMenuButton = new UiElement({
            innerHTML: "☰",
            style: {
                padding: "10px",
                cursor: "pointer",

            },
            onClick: () => {
                this.toggleMenu();
            }
        })

        // this.chatPanelButton = new MenuHeaderButtons("chat", this);
        this.peerToPeerPanelButton = new MenuHeaderButtons("multiplayer", this);
        this.peerToPeerPanelButton.element.style.display = "none";
        this.avatarPanelButton = new MenuHeaderButtons("avatar", this);
        this.optionsPanelButton = new MenuHeaderButtons("options", this);
        this.mapPanelButton = new MenuHeaderButtons("map", this);
        this.homePanelButton = new MenuHeaderButtons("home", this);
        
        this.optionList = new UiElement({
            style: {
                display: "none",
                marginTop: "50px",
            }
        })

        this.optionList.appendChildList([
            this.homePanelButton,
            // this.chatPanelButton,
            this.peerToPeerPanelButton,
            this.avatarPanelButton,
            this.optionsPanelButton,
            this.mapPanelButton,
        ])

        this.appendChildList([
            this.toggleMenuButton,
            this.optionList
        ])
    }

    handleMenuHeaderSelection(panel) {
        this.closeAllHeaders()
        switch(panel) {
            case "home":
                this.homePanelButton.element.style.background = "#c8c8c8";
                this.homePanelButton.options.style.background = "#c8c8c8";
                break;
            // case "chat":
            //     this.chatPanelButton.element.style.background = "#c8c8c8";
            //     this.chatPanelButton.options.style.background = "#c8c8c8";
            //     break;
            case "multiplayer":
                this.peerToPeerPanelButton.element.style.background = "#c8c8c8";
                this.peerToPeerPanelButton.options.style.background = "#c8c8c8";
                break;
            case "avatar":
                this.avatarPanelButton.element.style.background = "#c8c8c8";
                this.avatarPanelButton.options.style.background = "#c8c8c8";
                break;
            case "options":
                this.optionsPanelButton.element.style.background = "#c8c8c8";
                this.optionsPanelButton.options.style.background = "#c8c8c8";
                break;
            case "map":
                this.mapPanelButton.element.style.background = "#c8c8c8";
                this.mapPanelButton.options.style.background = "#c8c8c8";
                break;
        }
    }

    toggleMenu() {
        if(this.isOpen){
            this.element.style.height = "50px";
            this.toggleMenuButton.element.innerHTML = "☰";
            this.optionList.element.style.display = "none"; 
        } else {
            this.element.style.height = "350px";
            this.toggleMenuButton.element.innerHTML = "X";
            this.optionList.element.style.display = "block"; 
        }
        this.isOpen = !this.isOpen;
    }

    closeAllHeaders() {
        // this.chatPanelButton.element.style.background = "#e0e0e0";
        // this.chatPanelButton.options.style.background = "#e0e0e0";
        this.peerToPeerPanelButton.element.style.background = "#e0e0e0";
        this.peerToPeerPanelButton.options.style.background = "#e0e0e0";
        this.avatarPanelButton.element.style.background = "#e0e0e0";
        this.avatarPanelButton.options.style.background = "#e0e0e0";
        this.optionsPanelButton.element.style.background = "#e0e0e0";
        this.optionsPanelButton.options.style.background = "#e0e0e0";
        this.mapPanelButton.element.style.background = "#e0e0e0";
        this.mapPanelButton.options.style.background = "#e0e0e0";
        this.homePanelButton.element.style.background = "#e0e0e0";
        this.homePanelButton.options.style.background = "#e0e0e0";
    }

    togglePeerToPeer() {
        if(this.isPeerToPeer) {
            this.peerToPeerPanelButton.element.style.display = "none";
        } else {
            this.peerToPeerPanelButton.element.style.display = "block";
        }
        this.isPeerToPeer = !this.isPeerToPeer;
    }
}
export { MenuHeader }