import { UiElement } from "../../../../../../UiElement.js";

export class MapPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }
        })

        this.appendChild( new UiElement({
            type: "button",
            innerHTML: "go back to map",
            onClick: ()=>{
                window.location.href = "https://www.spacetimemeta.io/#/map"
            }
        }))

        this.appendChild( new UiElement({
            innerHTML: "This will send you back to the spacetime meta website",
            style: {
                textAlign: "center"
            }
        }))
    }
}