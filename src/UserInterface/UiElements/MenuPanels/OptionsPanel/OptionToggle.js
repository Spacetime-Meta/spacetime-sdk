import { UiElement } from "../../UiElement.js";

export class OptionToggle extends UiElement {
    constructor(name, isActive, onToggle ) {
        super({
            style: {
                margin: "15px",
                display: "grid",
                gridTemplateColumns: "225px 1fr"
            },
            onClick: () => {
                this.toggle();
                onToggle();
            },
        })

        this.isActive = isActive;

        this.optionName = new UiElement({
            innerHTML: name,
        })

        this.toggleButton = new UiElement({
            style: {
                width: "45px",
                height: "25px",
                borderRadius: "12.5px",
                background: this.isActive ? "green" : "red",
                position: "relative",
                transition: "all 0.5s ease"
            }
        })

        this.pill = new UiElement({
            style: {
                position: "absolute",
                height: "20px",
                width: "20px",
                margin: "2.5px",
                borderRadius: "50%",
                background: "grey",
                right: this.isActive ? "0" : "20px",
                transition: "all 0.5s ease"
            }
        });

        this.toggleButton.appendChild(this.pill);

        this.appendChildList([
            this.optionName,
            this.toggleButton
        ]);
    }

    toggle() {
        if(this.isActive) {
            this.toggleButton.element.style.background = "red";
            this.pill.element.style.right = "20px";
        } else {
            this.toggleButton.element.style.background = "green";
            this.pill.element.style.right = "0px";
        }
        this.isActive = !this.isActive;
    }
}