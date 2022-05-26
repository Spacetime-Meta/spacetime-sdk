const controlInstructions = function () {
    
    // create a wrapper to center the instruction div
    const panelWrapper = document.createElement('div');
    panelWrapper.id = "panelWrapper";
    Object.assign(panelWrapper.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        color: "rgba(256, 256, 256, 0.8)",
        display: "flex",
        justifyContent: "center",
        fontSize: "x-small"
    })
    document.body.appendChild(panelWrapper)

    // create the visible border box
    const borderBox = document.createElement('div');
    borderBox.id = "borderBox";
    Object.assign(borderBox.style, {
        background: "rgba(0, 0, 0, 0.2)",
        padding: "2px",
        border: "1px solid rgba(256, 256, 256, 0.3)"
    })
    panelWrapper.appendChild(borderBox);

    borderBox.innerHTML = "<b>WASD</b> move, <b>SHIFT</b> run, <b>SPACE</b> jump, <b>V</b> view, <b>P</b> play/pause, <b>R</b> rewind";
}

export default controlInstructions;