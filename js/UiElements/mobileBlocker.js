const mobileBlocker = function() {
    const mobileBlocker = document.createElement('div');
    mobileBlocker.id = 'mobileBlocker';

    //======style====
    var style = 'position: absolute;';
    style += 'height: 100%;';
    style += 'width: 100%;';
    style += 'display: flex;';
    style += 'color: turquoise;';
    style += 'background-color: black;';
    style += 'z-index: 1000;';
    style += 'flex-direction: row;';
    style += 'justify-content: center;';
    style += 'align-items: center;';

    //======attach style====
    mobileBlocker.style.cssText = style;

    //======loading======
    var mobileBlockerText = document.createElement('div');
    mobileBlockerText.id = 'mobileBlockerText';
    mobileBlockerText.innerHTML = 'This app is not available on mobile.';

    //======append loading page====
    mobileBlocker.appendChild(mobileBlockerText);
    document.body.appendChild(mobileBlocker);
}

export default mobileBlocker;