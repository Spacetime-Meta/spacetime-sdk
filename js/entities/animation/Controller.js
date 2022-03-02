class Controller {
    constructor(mixer, animations) {
        this.current = "none";
        this.animations = {};
        this.mixer = mixer;
        Object.entries(animations).forEach(([anim, clip]) => {
            this.animations[anim] = this.mixer.clipAction(clip);
        });
        this.lastChange = performance.now() - 250;
    }
    play(anim, time = 0.5) {
        if (anim === this.current) {
            return;
        }
        if (performance.now() - this.lastChange < 250) {
            return;
        }
        this.lastChange = performance.now();
        if (this.current !== "none") {
            this.animations[this.current].fadeOut(time);
        }
        this.current = anim;
        if (this.current !== "none") {
            this.animations[this.current].enabled = true;
            this.animations[this.current].reset();
            this.animations[this.current].fadeIn(time);
            this.animations[this.current].play();
        }
    }
}
export default Controller;