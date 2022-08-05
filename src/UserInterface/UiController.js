import { BlockerScreen } from './UiElements/BlockerScreen/BlockerScreen.js'
import { PlayScreen } from './UiElements/PlayScreen/PlayScreen.js'
import { Joystick } from "./UiElements/PlayScreen/Joystick.js";

export class UiController {

    /**
     * There are 2 levels to the UI, the first one is always active and the second 
     * one disappears when the controls are lock.
    */
    constructor() {
        document.body.style.fontFamily = "Space Mono, monospace";

        this.blockerScreen = new BlockerScreen();
        this.playScreen = new PlayScreen();

        // use this to prevent pointerLockControls from firing
        // this works since the 'onTouchStart' event fires when user press
        // and the 'onClick' is fired when user releases the press
        this.isTouchScreen = false;

        // references
        this.connectionsManagementDisplay = this.blockerScreen.menu.menuDisplay.multiplayerPanel.connectionsManagementDisplay;
        
        this.updatable = [];
        this.updatable.push(this.connectionsManagementDisplay);

        // add itself to the general update list
        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    handleControlsLock() {
        if(!this.isTouchScreen) {

            //setup the keyboard/mouse controls
            if(typeof VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls === "undefined") {
                VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.setupControls("keyboardMouse");
            }

            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.lock();

        } else {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.setupControls("mobile");
        }

        // toggle the view like normal
        this.blockerScreen.element.style.display = "none";
        this.playScreen.element.style.display = "block";
    }

    handleControlsUnlock() {
        this.blockerScreen.element.style.display = "grid";
        this.playScreen.element.style.display = "none";
    }

    handleNewMessage(message) {
        this.blockerScreen.menu.menuDisplay.chatPanel.chatOutputDisplay.displayNewMessage(message);
    }

    handleConnectionClose(peerId) {
        this.blockerScreen.menu.menuDisplay.multiplayerPanel.connectionsManagementDisplay.handleConnectionClose(peerId);
    }

    setupTimer() {
        this.hasTimer = true;
        this.playScreen.setupTimerBox();
        this.updatable.push(this.playScreen.timerBox);
    }

    setupTouchControls() {
        // change the controls instructions
        this.playScreen.controlsInstructions.setMobileInstructions();

        // create the ui elements of the
        // touch controls, like joystick and back button
        this.joystick = new Joystick();
        document.body.appendChild(this.joystick.element);
    }

    update(delta) {
        this.updatable.forEach(item => {
            item.update();
        })
    }
}