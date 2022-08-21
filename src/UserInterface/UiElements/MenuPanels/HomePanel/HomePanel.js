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
        this.spaceTextLogo.element.src = "https://github.com/Spacetime-Meta/documentation/blob/main/src/NewTextLogo.png?raw=true";


        this.appendChildList([ 
            this.spacetimeLogo,
            this.spaceTextLogo
        ])
    }
}