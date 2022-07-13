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

            
        this.toggleShadows = new OptionToggle( "Toggle Shadows" , true, function() {
            VIRTUAL_ENVIRONMENT.MAIN_SCENE.toggleShadows();
        }),
        
        this.togglePerformances = new OptionToggle( "Show Performances" , false, function() {
            VIRTUAL_ENVIRONMENT.toggleStats();
        }),

        this.toggleHitbox = new OptionToggle( "Show Hitbox", false, function() {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.toggleHitbox();
        }),

        this.toggleCollider = new OptionToggle( "Show Collider", false, function() {
            VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
        }),

        this.toggleTriggers = new OptionToggle( "Show Triggers", false, function() {
            VIRTUAL_ENVIRONMENT.terrainController.toggleInteractiveDebugBox();
        })

        this.appendChildList([
            this.toggleShadows,
            this.togglePerformances,
            this.toggleHitbox,
            this.toggleCollider,
            this.toggleTriggers    
        ]);
    }

    synchronize() {
        if(this.toggleCollider.isActive) {
            // VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
        }
    }
}