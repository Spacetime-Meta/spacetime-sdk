import { UiElement } from "../../../UiElement.js";

export class HoverInfoBox extends UiElement {
    constructor(){
        super({
            style: {
                background: "rgba(206, 206, 206, 0.8)",
                boxShadow: "0 4px 4px #484848",
                color: "white",
                padding: "5px",
                borderRadius: "5px",
                position: "absolute",
                display: "none",
                flexDirection: "row",
                alignItems: "center"
            }
        })

        this.image = new UiElement({
            type: "img",
            style: {
                height: "15px",
                width: "15px",
                borderRadius: "50%",
                paddingRight: "5px"
            }
        })
        this.image.element.src = "https://ipfs.io/ipfs/QmfD8B3U5pzKDxV5XC2SbmysVWUwDvQ4eVLrZuUfJMBGEt";

        this.name = new UiElement({
            innerHTML: "Spacetime Meta"
        })

        this.appendChildList([
            this.image,
            this.name
        ])
    }

    setInfoContent(info){
        this.image.element.src = info.logo;
        this.name.element.innerHTML = info.name;
    }
}