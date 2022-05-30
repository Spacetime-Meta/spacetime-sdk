import avatarSelectPanel from './avatarSelectPanel.js';

const blocker = function() {

    const blockerWrapper = document.createElement("div");
    blockerWrapper.id = "blockerWrapper";
    Object.assign(blockerWrapper.style, {
        position: "absolute",
        top: "0",
        width: "100%",
        height: "100%"
    })

    const blocker = document.createElement("div");
    blocker.id = "blocker";
    blocker.addEventListener('click', () => {
        player.controls.lock()
        document.getElementById('blockerWrapper').style.display = "none";
    })

    Object.assign(blocker.style, {
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        color: "white"
    })

    blockerWrapper.appendChild(avatarSelectPanel())
    blockerWrapper.appendChild(blocker)
    document.body.appendChild(blockerWrapper);
}

export default blocker;