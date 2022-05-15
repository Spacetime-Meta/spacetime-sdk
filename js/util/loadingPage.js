const loadingPage = function(waiting) {
    var loadingScreen;
    if(document.getElementById('loading-screen')) {
        loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = waiting ? 'flex' : 'none';
        return;
    }
    loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';

    //======style====
    var style = 'position: absolute;';
    style += 'height: 100%;';
    style += 'width: 100%;';
    style +=  waiting ?'display: flex;' : 'display: none;';
    style += 'color: white;';
    style += 'background-color: rgba(3, 69, 65, 0.455);';
    style += 'z-index: 1000;';
    style += 'flex-direction: row;';
    style += 'justify-content: center;';
    style += 'align-items: center;';

    //======attach style====
    loadingScreen.style.cssText = style;

    //======loading======
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = 'Loading...';

    //======append loading page====
    loadingScreen.appendChild(loadingDiv);
    document.body.appendChild(loadingScreen);

    return waiting;
}



export default loadingPage;