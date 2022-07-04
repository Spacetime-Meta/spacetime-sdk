import { UiElement } from "../../UiElement.js";
import { AvatarSelectButton } from "./AvatarPanelElements/AvatarSelectButton.js"

const defaultMapping = { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 };
const defaultAnimations = '../../../resources/animations/defaultAvatar.glb';

export class AvatarPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none"
            }
        })

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

        this.xBotAvatarSelectButton = new AvatarSelectButton(
            "xBot",
            'https://elegant-truffle-070d6b.netlify.app/xBot.glb',
            defaultAnimations,
            defaultMapping
        );

        this.yBotAvatarSelectButton = new AvatarSelectButton(
            "yBot",
            'https://elegant-truffle-070d6b.netlify.app/yBot.glb',
            defaultAnimations,
            defaultMapping
        );

        this.vanguardAvatarSelectButton = new AvatarSelectButton(
            "vanguard",
            'https://elegant-truffle-070d6b.netlify.app/vanguard.glb',
            defaultAnimations,
            defaultMapping
        );

        this.appendChildList([
            this.xBotAvatarSelectButton,
            this.yBotAvatarSelectButton,
            this.vanguardAvatarSelectButton,
        ])
    } 
}