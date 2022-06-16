import { UiElement } from "../../../../../../../UiElement.js";

class CameraBox extends UiElement {
    constructor(peerId, stream){
        super({
            id: "camera-screen-" + peerId,
            style: {
                textAlign: "center"
            }
        })

        this.title = new UiElement({
            id: "user-" + peerId,
            style: {
                margin: "0 80px",
                border: "1px solid rgba(256, 256, 256, 0.3)",
                background: "rgba(0, 0, 0, 0.2)",
                color: 'rgba(256, 256, 256, 0.8)'
            },
            innerHTML: peerId
        });

        this.screen = new UiElement({
            id: "camera-display-" + peerId,
            type: "video",
            style: {
                height: '200px'
            },
            attributes: {
                volumn: 0,
                muted: 'muted',
                autoplay: 'autoplay',
                srcObject: stream
            }
        });

        this.appendChildList([
            this.title,
            this.screen
        ])
    }
}
export { CameraBox }