const blocker = function(onClick) {
    const element = document.createElement("div");
    element.id = "blocker";

    Object.assign(element.style, {
        position: "absolute",
        top: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        color: "Turquoise"
    })

    element.innerHTML = "click to play"

    element.addEventListener('click', onClick)

    document.body.appendChild(element);
}

export default blocker;