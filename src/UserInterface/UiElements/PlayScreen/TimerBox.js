import { UiElement } from "../UiElement.js";

export class TimerBox extends UiElement {
    constructor() {
        super({
            innerHTML: "00000000",
            style: {
                position: "absolute",
                bottom: "0",
                right: "0",
                color: "white",
                fontWeight: "bold",
                fontSize: "25px"
            }
        })

        this.isVictory = false;

        document.body.addEventListener("keydown", (event) => {
            if(event.key === "r") {
                this.startTime = undefined;
                this.isVictory = false;
            }
        })
    }

    stopTimer() {
        this.isVictory = true;
    }

    startTimer() {
        this.startTime = Date.now();
    }

    update() {
        if(!this.isVictory) {
            const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
            this.element.innerHTML = `time: ${isNaN(elapsed) ? 0.00 : elapsed}s`
        }
    }
}