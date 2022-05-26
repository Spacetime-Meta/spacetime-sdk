const avatarSelectPanel = function () {
    const element = document.createElement("div");
    element.id = "avatarPanel"

    Object.assign(element.style, {
        position: 'absolute',
        padding: '2px',
        top: '0',
        left: '0',
        textAlign: 'center',
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        boxSizing: 'border-box',
        zIndex: 100,
        color: 'rgba(256, 256, 256, 0.8)',
        fontSize: "x-small"
    })

    element.innerHTML = "avatars"

    toggleButton(element);
    avatarButton("female", element, '../../../resources/avatars/megan.glb', '../../../resources/animations/megan@animation.glb')
    avatarButton("male", element, '../../../resources/avatars/josh.glb', '../../../resources/animations/josh@animation.glb')
    avatarButton("business man", element, '../../../resources/avatars/joe.glb', '../../../resources/animations/joe@animation.glb')
    avatarButton("vanguard", element, '../../../resources/avatars/vanguard.glb', '../../../resources/animations/animation.glb')
    avatarButton("xBot", element, '../../../resources/avatars/xBot.glb', '../../../resources/animations/animation.glb')
    avatarButton("yBot", element, '../../../resources/avatars/yBot.glb', '../../../resources/animations/animation.glb')
    
    function avatarButton(name, parent, avatarUrl, animationUrl) {
        const avatarButtonElement = document.createElement("div");
        avatarButtonElement.id = "avatarPanel"+name;
        avatarButtonElement.className = "avatar";

        Object.assign(avatarButtonElement.style, {
            border: '1px solid rgba(256, 256, 256, 0.8)',
            display: 'none',
            padding: '5px',
            margin: '2px',
            cursor: 'pointer'
        })
        
        avatarButtonElement.innerHTML = name

        avatarButtonElement.addEventListener("click", () => {
            window.player.avatarController.changeAvatar(avatarUrl, animationUrl)
        })

        parent.appendChild(avatarButtonElement)
    }

    function toggleButton(parent) {
        const toggleBtnElement = document.createElement("div");
        toggleBtnElement.id = "toggle";
        Object.assign(toggleBtnElement.style, {
            cursor: 'pointer',
            float: 'right',
            paddingLeft: '5px',
            paddingRight: '5px'
        })
        toggleBtnElement.innerHTML = "&#x25BC;";
        toggleBtnElement.addEventListener("click", () => {
            const avatarElements = document.getElementsByClassName("avatar");
            for(let i = 0; i < avatarElements.length; i++) {
                if(avatarElements[i].style.display === 'block') {
                    avatarElements[i].style.display = 'none';
                    toggleBtnElement.innerHTML = "&#x25BC;";
                }else {
                    avatarElements[i].style.display = 'block';
                    toggleBtnElement.innerHTML = "&#x25B2;";
                }
            }
        })
        parent.appendChild(toggleBtnElement)
    }

    return element;
}

export default avatarSelectPanel;