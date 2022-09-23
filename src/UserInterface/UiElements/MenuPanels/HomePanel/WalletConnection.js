import { UiElement } from "../../UiElement.js";

import { WalletConnectButton } from "./WalletConnectButton.js";

export class WalletConnection extends UiElement {
    constructor() {
        super({
            innerHTML: "log to wallet",
            style: {
                margin: "5px",
                marginTop: "50px"
            }
        });

        this.eternlConnection = new WalletConnectButton("eternl");
        this.namiConnection = new WalletConnectButton("nami");
        this.yoroiConnection = new WalletConnectButton("yoroi");

        this.appendChildList([
            this.eternlConnection,
            this.namiConnection,
            this.yoroiConnection
        ]);
    }
}