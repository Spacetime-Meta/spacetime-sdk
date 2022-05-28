const loadingPage = function() {
    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = 'progress-bar-container';

    Object.assign(progressBarContainer.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    });

    const title = document.createElement('label');
    title.innerHTML = "Loading....";
    Object.assign(title.style, {
        color: 'rgba(256, 256, 256, 0.8)',
        fontSize: "x-small"
    });

    const progress = document.createElement('progress');
    progress.id = 'progress-bar';
    progress.value = 0;
    progress.max = 100;

    Object.assign(progress.style, {
        width: '30%',
        marginTop: '0.5%',
        height: '2%'
    });

    progressBarContainer.appendChild(title);
    progressBarContainer.appendChild(progress);
    document.body.appendChild(progressBarContainer);

}

const loadingBar = function(manager) {
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    progressBarContainer.style.display = 'flex';

    manager.onProgress = function(url, loaded, total) {
        progressBar.value = loaded/total * 100;
    }

    manager.onLoad = function() {
        progressBarContainer.style.display = 'none';
    }
}

export {loadingPage, loadingBar};