import { BlockerScreen } from './UiElements/BlockerScreen/BlockerScreen.js'
import { PlayScreen } from './UiElements/PlayScreen/PlayScreen.js'

export class UiController {

    /**
     * There are 2 levels to the UI, the first one is always active and the second 
     * one disappears when the controls are lock.
    */
    constructor() {
        document.body.style.fontFamily = "Space Mono, monospace";

        this.blockerScreen = new BlockerScreen();
        this.playScreen = new PlayScreen();

        // vars
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
            VIRTUAL_ENVIRONMENT.LOCAL_PLAYER.controls.lock();
        }

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

    handleTouchControlsLock() {

        // use this to prevent pointerLockControls from firing
        this.isTouchScreen = true;
        
        console.log(`%c [UI Controller] Touch screen detected.`, 'color:#bada55');
    }

    setupTimer() {
        this.playScreen.setupTimerBox();
        this.updatable.push(this.playScreen.timerBox);
    }

    update(delta) {
        this.updatable.forEach(item => {
            item.update();
        })
    }
}