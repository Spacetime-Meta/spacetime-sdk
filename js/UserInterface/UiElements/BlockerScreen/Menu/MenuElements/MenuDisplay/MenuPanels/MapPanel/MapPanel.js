import { UiElement } from "../../../../../../UiElement.js";

import { SpacetimeMap } from "./MapPanelElements/SpacetimeMap.js";

export class MapPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center"
            }
        })

        this.spacetimeMap = new SpacetimeMap();
        this.appendChild(this.spacetimeMap);

        this.appendChild( new UiElement({
            innerHTML: "go back to map",
            style: {
                padding: "20px",
                margin: "20px",
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