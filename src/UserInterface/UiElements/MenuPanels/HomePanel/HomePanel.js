import { UiElement } from "../../UiElement.js";

import { WalletConnection } from "./WalletConnection";

export class HomePanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                marginTop: "150px",
                textAlign: "center"
            }
        })

        this.spacetimeLogo = new UiElement({
            type: "img",
            style: {
                width: "200px"
            }
        })
        this.spacetimeLogo.element.src = "https://raw.githubusercontent.com/Spacetime-Meta/documentation/main/src/spacetime_logo.png";

        this.spaceTextLogo = new UiElement({
            type: "img",
            style: {
                width: "300px"
            }
        })
        this.spaceTextLogo.element.src = "https://raw.githubusercontent.com/Spacetime-Meta/documentation/main/src/NewTextLogo.png";

        this.walletConnection = new WalletConnection();

        this.appendChildList([ 
            this.spacetimeLogo,
            this.spaceTextLogo,
            this.walletConnection
        ])
    }

    walletIsLoading() {
        this.removeChild(this.walletConnection);
        this.walletConnection = new UiElement({
            innerHTML: `Loading ${VIRTUAL_ENVIRONMENT.cardanoConnector.walletName} wallet...`,
            style: {
                width: "350px",
                textAlign: "center",
                marginTop: "50px"
            }
        })

        this.appendChild(this.walletConnection);
    }

    walletIsLoaded() {
        this.removeChild(this.walletConnection);
        this.walletConnection = new UiElement({
            innerHTML: `Connected to ${VIRTUAL_ENVIRONMENT.cardanoConnector.walletName} wallet.\nBalance: ${VIRTUAL_ENVIRONMENT.cardanoConnector.balance / 1000000} ₳`,
            style: {
                width: "350px",
                textAlign: "center",
                marginTop: "50px",
            }
        })

        this.appendChildList([
            this.walletConnection,
            new UiElement({
                innerHTML: "See my assets",
                style: {
                    padding: "10px",
                    margin: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                    boxShadow: "0 2px 2px #888888",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.5s ease"
                },
                hover: {
                    background: "#d8d8d8"
                },
                onClick: () => {
                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.handleMenuPanelSelection("wallet");
                }
            })
        ]);
    }
}