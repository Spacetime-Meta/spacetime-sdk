import { UiElement } from "../../../../../../../UiElement.js";

import { getSearchBarQuery } from './graphqlCaller.js';

import { ResultDisplayItem } from "./ResultDisplayItem.js"

export class SearchBar extends UiElement {
    constructor(map) {
        super({
            style: {
                position: "absolute",
                padding: "5px",
                margin: "10px",
                marginLeft: "45px",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                background: "rgb(255,255,255)",
                boxShadow: "0 2px 2px #888888",
                transition: "all 0.5s ease",
                width: "260px",
                
            }
        })

        this.refToMap = map;

        this.searchByName = true;

        this.inputRow = new UiElement({
            style: {
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }
        })

        this.optionIcon = new UiElement({
            type: "img",
            style: {
                width: "10px",
                marginRight: "5px",
                cursor: "pointer",
            },
            onClick: () => {
                this.toggleSearchMode()
            }
        })
        this.optionIcon.element.src = "../../resources/images/settings.png";
    
        this.inputBar = new UiElement({
            type: "input",
            style: {
                width: "250px",
                background: "rgb(255,255,255)",
                border: "none",
                padding: "3px",
            }
        })

        this.inputLocation = new UiElement({
            style: {
                display: "none",
                flexDirection: "row",
            }
        })
        
        this.inputX = new UiElement({
            type: "input",
            style: {
                width: "30px",
                background: "rgb(255,255,255)",
                border: "none",
                marginRight: "10px"
            }
        })
        this.inputY = new UiElement({
            type: "input",
            style: {
                width: "30px",
                background: "rgb(255,255,255)",
                border: "none",
                marginRight: "10px"
            }
        })
        this.inputZ = new UiElement({
            type: "input",
            style: {
                width: "30px",
                background: "rgb(255,255,255)",
                border: "none",
                marginRight: "10px"
            }
        })
        this.inputLocation.appendChildList([
            new UiElement({
                innerHTML: " x:"
            }),
            this.inputX,
            new UiElement({
                innerHTML: " y:"
            }),
            this.inputY,
            new UiElement({
                innerHTML: " z:"
            }),
            this.inputZ
        ])

        this.searchIcon = new UiElement({
            type: "img",
            style: {
                width: "10px",
                marginLeft: "5px",
                cursor: "pointer",
            },
            onClick: (event) => {
                event.preventDefault()
                this.handleSearch()
            }
        });
        this.searchIcon.element.src = "../../resources/images/search.png";

        this.clearIcon = new UiElement({
            innerHTML: "X",
            style: {
                display: "none",
                cursor: "pointer",
            },
            onClick: () => {
                this.resetSearch();
                this.inputBar.element.value = ""
                this.inputX.element.value = ""
                this.inputY.element.value = ""
                this.inputZ.element.value = ""
            }
        })
        
        this.inputX.element.addEventListener("change", ()=>{this.resetSearch()})
        this.inputY.element.addEventListener("change", ()=>{this.resetSearch()})
        this.inputZ.element.addEventListener("change", ()=>{this.resetSearch()})
        this.inputBar.element.addEventListener("change", () => {this.resetSearch()})

        this.inputRow.appendChildList([
            this.optionIcon,
            this.inputLocation,
            this.inputBar,
            this.searchIcon,
            this.clearIcon
        ]);

        this.resultDisplay = new UiElement({
            style: {
                borderTop: "1px solid black",
                display: "none",
                paddingTop: "10px",
                marginTop: "10px",
                maxHeight: "400px",
                overflow: "scroll",
                overflow: "auto"
            }
        })

        this.appendChildList([
            this.inputRow,
            this.resultDisplay
        ]);
    }

    toggleSearchMode() {
        if(this.searchByName) {
            this.inputBar.element.style.display = "none",
            this.inputLocation.element.style.display = "flex"
        } else {
            this.inputBar.element.style.display = "block",
            this.inputLocation.element.style.display = "none"
        }

        this.searchByName = !this.searchByName; 
    }

    handleSearch() {

        this.searchIcon.element.style.display = "none";
        this.resultDisplay.element.innerHTML = "";
        this.resultDisplay.element.style.display = "none";
        this.clearIcon.element.style.display = "block";

        let inputValue = undefined;
        if(this.searchByName) {
            inputValue = this.inputBar.element.value;
        } else {
            inputValue = {
                x: this.inputX.element.value,
                y: this.inputY.element.value,
                z: this.inputZ.element.value
            }
        }

        getSearchBarQuery(inputValue).then(data => {
            if(typeof data !== "undefined") {
                if(typeof data.search_chunks_aggregate !== "undefined"){
                    data = data.search_chunks_aggregate.nodes
                } else {
                    data = data.spaceState_v3
                }

                if(data.length > 0) {
                    this.resultDisplay.element.style.display = "block"

                    data.forEach(entry => {
                        this.resultDisplay.appendChild( new ResultDisplayItem(entry, this))
                    })
                } else {
                    this.resultDisplay.element.innerHTML = "not results";
                    this.resultDisplay.element.style.display = "block";
                    setTimeout(() => {
                        this.resetSearch();
                    }, 3000);
                }

            } else {
                this.resultDisplay.element.innerHTML = "not a valid search";
                this.resultDisplay.element.style.display = "block";
                setTimeout(() => {
                    this.resetSearch();
                }, 3000);
            }
        });
    }

    resetSearch() {
        this.clearIcon.element.style.display = "none";
        this.searchIcon.element.style.display = "block";
        this.resultDisplay.element.innerHTML = "";
        this.resultDisplay.element.style.display = "none";
    }
}