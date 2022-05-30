const callBox = function(remoteController) {
    const box = document.createElement('div');
    box.id = 'call-box';
    box.style.display = 'flex';

    // const endBtn = document.createElement('button');
    // endBtn.innerHTML = 'End Call';
    // endBtn.id = 'end-call';
    // Object.assign(endBtn.style, {
    //     padding: '5px',
    //     margin: '2px',
    //     cursor: 'pointer',
    //     textAlign: 'center',
    //     border: "1px solid rgba(256, 256, 256, 0.3)",
    //     background: "rgba(0, 0, 0, 0.2)",
    //     boxSizing: 'border-box',
    //     color: 'rgba(256, 256, 256, 0.8)'
    // })
    // endBtn.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     toggleCallBox;
    // });

    // box.appendChild(endBtn);

    document.body.appendChild(box);

    document.addEventListener('keydown', (event) => {
        if (event.key === "c") {
            toggleCallBox();
        }
    });
}

const addCamera = function(stream) {
    const box = document.getElementById('call-box');
    const video = document.createElement('video');
    video.id = 'camera-display';
    video.width = '300';
    video.height = '300';
    video.autoplay = 'autoplay';
    video.srcObject = stream;

    box.appendChild(video);
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