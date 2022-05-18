const avatarSelectPanel = function () {
    const element = document.createElement("div");
    element.id = "avatarPanel"

    Object.assign(element.style, {
        position: 'absolute',
        padding: '10px',
        top: '2px',
        right: 'calc(100% - 2px)',
        transform: 'translate(100%, 0)',
        width: '150px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        borderRadius: '10px',
        zIndex: 100,
        color: '#00FFF0'
    })

    element.innerHTML = "avatars"

    toggleButton(element);
    avatarButton("Vanguard", element, '../../../glb/avatars/vanguard.glb')
    avatarButton("xBot", element, '../../../glb/avatars/xBot.glb')
    avatarButton("yBot", element, '../../../glb/avatars/yBot.glb')

    document.body.appendChild(element);
    
    function avatarButton(name, parent, avatarUrl) {
        const avatarButtonElement = document.createElement("div");
        avatarButtonElement.id = "avatarPanel"+name;
        avatarButtonElement.className = "avatar";

        Object.assign(avatarButtonElement.style, {
            border: '1px solid #00FFF0',
            display: 'block',
            padding: '5px',
            margin: '2px',
            cursor: 'pointer'
        })
        
        avatarButtonElement.innerHTML = name

        avatarButtonElement.addEventListener("click", () => {
            window.player.avatarController.changeAvatar(avatarUrl, '../../../glb/animations/animation.glb')
        })

        parent.appendChild(avatarButtonElement)
    }

    function toggleButton(parent) {
        const toggleBtnElement = document.createElement("div");
        toggleBtnElement.id = "toggle";
        Object.assign(toggleBtnElement.style, {
            cursor: 'pointer',
            float: 'right'
        })
        toggleBtnElement.innerHTML = "&#x25BC;";
        toggleBtnElement.addEventListener("click", () => {
            const avatarElements = document.getElementsByClassName("avatar");
            for(let i = 0; i < avatarElements.length; i++) {
                if(avatarElements[i].style.display === 'block') {
                    avatarElements[i].style.display = 'none';
                    toggleBtnElement.innerHTML = "&#x25B2;";
                }else {
                    avatarElements[i].style.display = 'block';
                    toggleBtnElement.innerHTML = "&#x25BC;";
                }
            }
        })
        parent.appendChild(toggleBtnElement)
    }
}

export default avatarSelectPanel;