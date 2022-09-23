import { UiElement } from "../../UiElement.js";

export class AssetDisplayCard extends UiElement {
    constructor(asset) {
        super({
            innerHTML: asset.name,
            style: {
                padding: "10px",
                margin: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                // cursor: "pointer",
                // transition: "all 0.5s ease"
            },
            // hover: {
            //     background: "#d8d8d8"
            // },
            // onClick: () => {
            //     this.toggleExpand();
            // } 
        })

        // this.asset = asset
        // this.isExpanded = false;

        // this.cardDisplay = new UiElement({
        //     type: "img",
        //     style: {
        //         width: "250px",
        //         height: "250px"
        //     },
        // })
        // console.log(this.asset);
        // this.cardDisplay.element.src = "https://ipfs.io/" + this.asset.metadata.onchain_metadata.image
    }

    // toggleExpand() {

    //     if(this.isExpanded === true) {
    //         this.element.style.height = "auto";
    //         this.removeChild(this.cardDisplay);
    //     } else {
    //         this.element.style.height = "350px";
    //         this.appendChild(this.cardDisplay);
    //     }


    //     this.isExpanded = !this.isExpanded;
    // }
}