import { Vector3 } from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';

import { UiElement } from "../../../../../../../UiElement.js";

export class ResultDisplayItem extends UiElement {
    constructor(entry, searchBar){
        super({
            style: {
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer"
            },
            onClick: () => {
                searchBar.refToMap.handleNavigateMap(new Vector3(
                    entry.x,
                    entry.y,
                    entry.z
                ))
                searchBar.resetSearch();
            }
        })

        this.logo = new UiElement({
            type: "img",
            style: {
                height: "15px",
                width: "15px",
                borderRadius: "50%",
                paddingRight: "5px"
            }
        })

        if(entry.logo.substring(0,2) === "Qm") {
            entry.logo = `https://ipfs.io/ipfs/${entry.logo}`
        }

        if(entry.logo === "") {
            this.logo.element.src = "https://ipfs.io/ipfs/QmfD8B3U5pzKDxV5XC2SbmysVWUwDvQ4eVLrZuUfJMBGEt";
        } else {
            this.logo.element.src = entry.logo;
        }

        this.name = new UiElement({
            innerHTML: entry.name === "" ? "New Planet" : entry.name,
            style: {
                fontSize: "xx-small"
            }
        })

        this.logoName = new UiElement({
            style: {
                display: "flex",
                flexDirection: "row"
            }
        })
        this.logoName.appendChildList([
            this.logo,
            this.name
        ])

        this.appendChildList([
            this.logoName,
            new UiElement({
                innerHTML: entry.loc,
                style: {
                    fontSize: "xx-small"
                }
            })
        ])
    }
}