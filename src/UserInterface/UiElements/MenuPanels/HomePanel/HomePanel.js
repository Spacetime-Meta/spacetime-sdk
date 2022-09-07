import { UiElement } from "../../UiElement.js";

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

        this.appendChildList([ 
            this.spacetimeLogo,
            this.spaceTextLogo
        ])
    }
}