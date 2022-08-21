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
        this.connectionsManagementDisplay = this.blockerScreen.menu.menuDisplay.peerToPeerPanel.connectionsManagementDisplay;
        
        this.updatable = [];
        this.updatable.push(this.connectionsManagementDisplay);

        // add itself to the general update list
        VIRTUAL_ENVIRONMENT.updatableObjects.push(this);
    }

    handleControlsLock() {
        if(this.isTouchScreen) {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.setupControls("mobile");
            this.joystick.element.style.display = "block";
        } else {
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.setupControls("keyboardMouse");
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.lock();
        }

        // toggle the view like normal
        this.blockerScreen.element.style.display = "none";
        this.playScreen.element.style.display = "block";
    }

    handleControlsUnlock() {
        if(this.isTouchScreen) {
            this.joystick.element.style.display = "none";
        }
        
        this.blockerScreen.element.style.display = "grid";
        this.playScreen.element.style.display = "none";
    }

    handleNewMessage(message) {
        this.blockerScreen.menu.menuDisplay.chatPanel.chatOutputDisplay.displayNewMessage(message);
    }

    handleConnectionClose(peerId) {
        this.blockerScreen.menu.menuDisplay.peerToPeerPanel.connectionsManagementDisplay.handleConnectionClose(peerId);
    }

    setupTimer() {
        this.hasTimer = true;
        this.playScreen.setupTimerBox();
        this.updatable.push(this.playScreen.timerBox);
    }

    setupTouchControls() {
        // create the ui elements of the
        // touch controls, like jump and back button
        this.playScreen.setupMobileDisplay();

        // creates and add the joystick
        this.joystick = new Joystick();
        document.body.appendChild(this.joystick.element);
    }

    togglePeerToPeer() {
        this.blockerScreen.menu.menuHeader.togglePeerToPeer()
    }

    update(delta) {
        this.updatable.forEach(item => {
            item.update();
        })
    }
}