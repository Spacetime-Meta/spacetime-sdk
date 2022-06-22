import { UiElement } from "../../../../../../UiElement.js";

import { SpacetimeMap } from "./MapPanelElements/SpacetimeMap.js";

const IPFS = function(CID) { return `https://ipfs.io/ipfs/${CID}` }

export class MapPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                flexDirection: "column",
                alignItems: "center"
            }
        })

        this.portalLocation = "https://stdkit-dev.netlify.app/examples/spawn-planet/index.html";

        this.spacetimeMap = new SpacetimeMap(this);
        this.appendChild(this.spacetimeMap);

        this.visitWorldButton = new UiElement({
            style: {
                padding: "10px",
                margin: "20px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "rgb(245,245,245)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8"
            },
            onClick: ()=>{
                window.location.href = this.portalLocation;
            }
        })

        this.locationLoc = new UiElement({
            innerHTML: "x:0 y:0 z:0"
        })

        this.locationName = new UiElement({
            innerHTML: "Spacetime Meta"
        })

        this.locationImg = new UiElement({
            type: "img",
            style: {
                width: "300px"
            }
        })

        this.locationImg.element.src = "https://cdn.discordapp.com/attachments/925045793780543568/984261788549918802/newBack.png"
        this.visitWorldButton.appendChildList([
            this.locationLoc,
            this.locationName,
            this.locationImg,
            new UiElement({ innerHTML: "Enter Location"})
        ]);

        this.appendChild( this.visitWorldButton )
    }

    setPortalPanelInfo(information){
        this.locationLoc.element.innerHTML = `x:${information.location.x} y:${information.location.y} z:${information.location.z}`;
        this.locationName.element.innerHTML = information.name;

        if(information.image.substring(0,2) === "Qm"){
            information.image = IPFS(information.image);
        }
        this.locationImg.element.src = information.image;

        this.portalLocation = information.portal;
    }
}