import { UiElement } from "../../../../../../../UiElement.js";

export class AvatarSelectButton extends UiElement {
    constructor(name, avatarUrl, animationUrl, animationMapping){
        super({
            innerHTML: name,
            style: {
                border: "1px solid white",
                margin: "3px",
                padding: "3px",
                textAlign: "center",
                cursor: "pointer"
            }
        })

        this.element.addEventListener("click", ()=>{
            LOCAL_PLAYER.avatarController.changeAvatar(avatarUrl, animationUrl, animationMapping)
        })
    }
}