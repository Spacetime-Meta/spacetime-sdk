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
        });
        
        this.togglePerformances = new OptionToggle( "Show Performances" , false, function() {
            VIRTUAL_ENVIRONMENT.toggleStats();
        })

        this.toggleHitbox = new OptionToggle( "Show Local Hitbox", false, function() {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.toggleHitbox();
        });

        this.toggleServerHitbox = new OptionToggle( "Show Server Hitbox", false, function() {
            VIRTUAL_ENVIRONMENT.socketController.toggleServerHitbox();
        });

        this.toggleCollider = new OptionToggle( "Show Collider", false, function() {
            VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
        });

        this.toggleTriggers = new OptionToggle( "Show Triggers", false, function() {
            VIRTUAL_ENVIRONMENT.terrainController.toggleInteractiveDebugBox();
        });

        this.togglePeerToPeer = new OptionToggle("Peer To Peer", false, function() {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.togglePeerToPeer();
            VIRTUAL_ENVIRONMENT.activatePeerToPeer();
        });

        this.appendChildList([
            this.toggleShadows,
            this.togglePerformances,
            this.toggleHitbox,
            this.toggleServerHitbox,
            this.toggleCollider,
            this.toggleTriggers,
            this.togglePeerToPeer    
        ]);
    }

    synchronize() {
        if(this.toggleCollider.isActive) {
            // VIRTUAL_ENVIRONMENT.terrainController.toggleViewCollider();
        }
    }
}