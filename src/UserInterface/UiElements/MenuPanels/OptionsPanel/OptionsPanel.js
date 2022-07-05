import { UiElement } from "../../UiElement.js";

import { OptionToggle } from "./OptionToggle.js";

export class OptionsPanel extends UiElement {
    constructor(){
        super({
            style: {
                height: "100%",
                display: "none",
                marginTop: "150px"
            }
        })

        this.appendChild( new OptionToggle( "Toggle Shadows" ,true , function() {
            MAIN_SCENE.toggleShadows();
        }));
        
        this.appendChild( new OptionToggle( "Show Performances" ,false , function() {
            VIRTUAL_ENVIRONMENT.toggleStats();
        }));

        this.appendChild( new OptionToggle( "Show Hitbox" ,false , function() {
            LOCAL_PLAYER.toggleHitbox();
        }));

        this.appendChild( new OptionToggle( "Show Collider" ,false , function() {
            VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
        }));

        this.appendChild( new OptionToggle( "Show Triggers" ,false , function() {
            MAIN_SCENE.toggleInteractiveDebugBox();
        }));
    } 
}