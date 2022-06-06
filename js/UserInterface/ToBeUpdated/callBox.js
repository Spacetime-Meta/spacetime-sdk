const callBox = function(remoteController, peerId) {
    const box = document.createElement('div');
    box.id = 'call-box';
    box.style.display = 'flex';

    const endBtn = document.createElement('button');
    endBtn.innerHTML = 'End Call';
    endBtn.id = 'end-call';
    Object.assign(endBtn.style, {
        padding: '5px',
        margin: '2px',
        cursor: 'pointer',
        textAlign: 'center',
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        boxSizing: 'border-box',
        color: 'rgba(256, 256, 256, 0.8)'
    })
    endBtn.addEventListener('click', (e) => {
        e.preventDefault();
        remoteController.endcall();
    });

    box.appendChild(endBtn);

    document.body.appendChild(box);

    document.addEventListener('keydown', (event) => {
        if (event.key === "c") {
            toggleCallBox();
        }
    });
}

const addCamera = function(peerId, stream) {
    if(document.getElementById('camera-screen-' + peerId)) return;
    
    const box = document.getElementById('call-box');  
    const cameraScreen = document.createElement('div');
    cameraScreen.id = 'camera-screen-' + peerId;
    
    const peerName = document.createElement('div');
    peerName.id = 'username-' + peerId;
    peerName.innerHTML = peerId;
    Object.assign(peerName.style, {
        border: "1px solid rgba(256, 256, 256, 0.3)",
        background: "rgba(0, 0, 0, 0.2)",
        boxSizing: 'border-box',
        color: 'rgba(256, 256, 256, 0.8)'
    })
    cameraScreen.appendChild(peerName);

    const video = document.createElement('video');
    video.id = 'camera-display-' + peerId;
    video.width = '250';
    video.height = '200';
    video.autoplay = 'autoplay';
    video.srcObject = stream;
    cameraScreen.appendChild(video);

    box.appendChild(cameraScreen);
}

const toggleCallBox = function() {
    const box = document.getElementById('call-box');
    if (box.style.display === 'none') {
        box.style.display = 'flex';
    } else {
        box.style.display = 'none';
    }
}

export {callBox, addCamera, toggleCallBox};