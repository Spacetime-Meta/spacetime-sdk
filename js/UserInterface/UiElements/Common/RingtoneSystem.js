class RingToneSystem {
    constructor(){
        this.audio = new Audio();
    }

    playCallTone() {
        this.audio.load();
        this.audio.src = '../../../resources/audios/ringtone.mp3';
        this.audio.loop = true;
        this.audio.play();
    }

    playNotifyTone() {
        this.audio.load();
        this.audio.src = '../../../resources/audios/notify.mp3';
        this.audio.loop = false;
        this.audio.play();
    }

    mute() {
        this.audio.load();
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}
export { RingToneSystem }