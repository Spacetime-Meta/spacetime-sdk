import { UiElement } from "../UiElement.js";

class AlertBox extends UiElement {
    constructor(title, message, onAccept = null){
        super({
            id: "AlertBox",
            style: { 
                position: 'absolute',
                padding: '2px',
                top: '30%',
                left: 'calc(50% - 150px)',
                width: '300px',
                textAlign: 'center',
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                border: "1px solid #e0e0e0",
                zIndex: 100,
                borderRadius: '10px'
            }
        })

        this.title = new UiElement({
            innerHTML: title,
            style: {
                background: "#d8d8d8"
            }
        });

        this.content = new UiElement({
            innerHTML: message
        });

        this.acceptButton = new UiElement({
            type: "button",
            innerHTML: "YES",
            style: {
                padding: "10px",
                margin: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease",
                width: '100px'
            },
            onClick: () => {
                this.element.remove();
                if(onAccept) onAccept();
            }
        })

        this.cancelButton = new UiElement({
            type: "button",
            innerHTML: "CANCEL",
            style: {
                padding: "10px",
                margin: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease",
                width: '100px'
            },
            onClick: () => {
                this.element.remove();
            }
        })

        this.appendChildList([
            this.title,
            this.content,
            this.acceptButton,
            this.cancelButton
        ])

        document.body.appendChild(this.element);
    }
}
export { AlertBox }