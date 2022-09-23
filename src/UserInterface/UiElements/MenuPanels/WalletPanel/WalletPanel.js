import { UiElement } from "../../UiElement.js";

import { AssetDisplayCard } from "./AssetDisplayCard.js"

export class WalletPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                marginBottom: "50px",
                display: "none"
            }
        })

        this.appendChild(new UiElement({
            innerHTML: "Cardano Assets",
            style: {
                width: "100%",
                fontWeight: "bold",
                fontSize: "25px",
                textAlign: "center",
                paddingTop: "50px"
            }
        }));
    }

    displayCNFTs() {
        VIRTUAL_ENVIRONMENT.cardanoConnector.assets.forEach(asset => {
            this.appendChild(new AssetDisplayCard(asset));            
        });
    }
}