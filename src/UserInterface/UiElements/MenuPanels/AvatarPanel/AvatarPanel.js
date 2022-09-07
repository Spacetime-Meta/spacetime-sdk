import { UiElement } from "../../UiElement.js";
import { AvatarSelectButton } from "./AvatarPanelElements/AvatarSelectButton.js"

const defaultMapping = { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 };
const defaultAnimations = 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb';

export class AvatarPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none"
            }
        })

        this.avatarButtonList = [];

        this.appendChild(new UiElement({
            innerHTML: "Select an Avatar",
            style: {
                width: "100%",
                fontWeight: "bold",
                fontSize: "25px",
                textAlign: "center",
                paddingTop: "50px"
            }
        }));
    }

    addNewAvatarButton(options) {
        if(!this.avatarButtonList.includes(options.name+options.mesh)) {
            const newButton = new AvatarSelectButton(options);
            this.avatarButtonList.push(options.name+options.mesh);
            this.appendChild(newButton);
        }
    }

    clear() {
        this.avatarButtonList.forEach(avatarButton => {
            this.removeElement(avatarButton);
        });
        this.avatarButtonList = [];
    }
}