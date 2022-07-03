import { BlockerScreen } from './UiElements/BlockerScreen/BlockerScreen.js'
import { PlayScreen } from './UiElements/PlayScreen/PlayScreen.js'

class UiController {

    /**
     * There are 2 levels to the UI, the first one is always active and the second 
     * one disappears when the controls are lock.
    */
    constructor() {
        this.blockerScreen = new BlockerScreen();
        this.playScreen = new PlayScreen();

        // references
        this.connectionsManagementDisplay = this.blockerScreen.menu.menuDisplay.multiplayerPanel.connectionsManagementDisplay;
    
        
        this.updatable = [];
        this.updatable.push(this.connectionsManagementDisplay);
    }

    handleControlsLock() {
        LOCAL_PLAYER.controls.lock();
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
        this.playScreen.setupTimerBox();
        this.updatable.push(this.playScreen.timerBox);
    }

    update() {
        this.updatable.forEach(item => {
            item.update();
        })
    }
}
export { UiController }