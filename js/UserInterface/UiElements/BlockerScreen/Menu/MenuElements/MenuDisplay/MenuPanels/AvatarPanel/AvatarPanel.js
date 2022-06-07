import { UiElement } from "../../../../../../UiElement.js";
import { AvatarSelectButton } from "./AvatarPanelElements/AvatarSelectButton.js"

const defaultMapping = { walk: 1, idle: 2, run: 3, jump: 5, fall: 4 };
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
            type: "h3",
            innerHTML: "Select an Avatar",
        }));

        this.xBotAvatarSelectButton = new AvatarSelectButton(
            "xBot",
            '../../../resources/avatars/xBot.glb',
            defaultAnimations,
            defaultMapping
        );

        this.yBotAvatarSelectButton = new AvatarSelectButton(
            "yBot",
            '../../../resources/avatars/yBot.glb',
            defaultAnimations,
            defaultMapping
        );

        this.vanguardAvatarSelectButton = new AvatarSelectButton(
            "vanguard",
            '../../../resources/avatars/vanguard.glb',
            defaultAnimations,
            defaultMapping
        );

        this.businessManAvatarSelectButton = new AvatarSelectButton(
            "business man",
            '../../../resources/avatars/joe.glb',
            '../../../resources/animations/joe@animation.glb',
            { walk: 1, idle: 2, run: 3, jump: 4, fall: 5 }
        );

        this.maleAvatarSelectButton = new AvatarSelectButton(
            "male",
            '../../../resources/avatars/josh.glb',
            '../../../resources/animations/josh@animation.glb',
            { walk: 1, idle: 2, run: 3, jump: 4, fall: 5 }
        );

        this.femaleAvatarSelectButton = new AvatarSelectButton(
            "female",
            '../../../resources/avatars/megan.glb',
            '../../../resources/animations/megan@animation.glb',
            { walk: 1, idle: 2, run: 3, jump: 4, fall: 5 }
        );

        this.appendChildList([
            this.xBotAvatarSelectButton,
            this.yBotAvatarSelectButton,
            this.vanguardAvatarSelectButton,
            this.businessManAvatarSelectButton,
            this.maleAvatarSelectButton,
            this.femaleAvatarSelectButton
        ])
    } 
}