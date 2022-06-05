import { BlockerScreen } from './UiElements/BlockerScreen/BlockerScreen.js'
import { PlayScreen } from './UiElements/PlayScreen/PlayScreen.js'

class UiController {

    /**
     * There are 2 levels to the UI, the first one is always active and the second 
     * one disappears when the controls are lock.
    */
    constructor() {
        this.blockerScreen = new BlockerScreen(() => {this.handleControlsLock()});
        this.playScreen = new PlayScreen();
    }

    handleControlsLock () {
        LOCAL_PLAYER.controls.lock();
        this.blockerScreen.element.style.display = "none";
        this.playScreen.element.style.display = "block";
    }

    // handleControlsLock () {
    //     this.blockerScreen.element.style.display = "block";
    //     this.playScreen.element.style.display = "none";
    // }

    update() {}
}
export { UiController }