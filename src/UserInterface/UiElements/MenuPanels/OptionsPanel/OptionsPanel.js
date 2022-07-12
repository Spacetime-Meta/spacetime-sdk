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

        this.optionList = [
            
            new OptionToggle( "Toggle Shadows" ,true , function() {
                VIRTUAL_ENVIRONMENT.MAIN_SCENE.toggleShadows();
            }),
            
            new OptionToggle( "Show Performances" ,false , function() {
                VIRTUAL_ENVIRONMENT.toggleStats();
            }),

            new OptionToggle( "Show Hitbox" ,false , function() {
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.toggleHitbox();
            }),

            new OptionToggle( "Show Collider" ,false , function() {
                VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
            }),

            new OptionToggle( "Show Triggers" ,false , function() {
                VIRTUAL_ENVIRONMENT.terrainController.toggleInteractiveDebugBox();
            })
        ];

        this.appendChildList( this.optionList );
    } 

    synchronize() {
        this.optionList.forEach(option => {
            option.synchronize()
        })
    }
}