const blocker = function(onClick) {
    const element = document.createElement("div");
    element.id = "blocker";
    element.addEventListener('click', onClick)

    Object.assign(element.style, {
        position: "absolute",
        top: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        color: "Turquoise"
    })

    const playElement = document.createElement("p");
    playElement.innerHTML = "click to play"
    element.appendChild(playElement)

    const instructions = document.createElement("p");
    instructions.innerHTML = "<b>WASD</b> move, <b>SHIFT</b> run, <b>SPACE</b> jump, <b>V</b> view";
    element.appendChild(instructions);

    const videoInstructions = document.createElement("p");
    videoInstructions.innerHTML = "<b>P</b> play/pause, <b>R</b> rewind";
    element.appendChild(videoInstructions);

    document.body.appendChild(element);

    const bTag = document.getElementsByTagName("b");
    for(let index = 0 ; index < bTag.length; index++) {
        bTag[index].style.cssText = "color: orange;";
    }
}

export default blocker;