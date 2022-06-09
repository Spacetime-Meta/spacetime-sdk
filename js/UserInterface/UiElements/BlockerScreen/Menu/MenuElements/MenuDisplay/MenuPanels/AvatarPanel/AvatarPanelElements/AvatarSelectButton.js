import { UiElement } from "../../../../../../../UiElement.js";

export class AvatarSelectButton extends UiElement {
    constructor(name, avatarUrl, animationUrl, animationMapping){
        super({
            innerHTML: name,
            style: {
                padding: "10px",
                margin: "10px",
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
            }
        })

        this.element.addEventListener("click", ()=>{
            LOCAL_PLAYER.avatarController.changeAvatar(avatarUrl, animationUrl, animationMapping)
        })
    }
}