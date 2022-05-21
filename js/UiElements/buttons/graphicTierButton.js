const settings = ["Low", "Medium", "High", "Ultra"];

const graphicTierButton = function(graphicTier, onClick) {
    const element = document.createElement("div");
    element.id = "graphicTierButton";

    Object.assign(element.style, {
        position: 'absolute',
        padding: '10px',
        top: '2px',
        left: 'calc(100% - 2px)',
        transform: 'translate(-100%, 0)',
        width: '150px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        borderRadius: '10px',
        cursor: 'pointer',
        zIndex: 100,
        color: '#00FFF0'
    })

    element.innerHTML = "Light: " + settings[graphicTier];

    element.addEventListener("click", onClick);
    
    document.body.appendChild(element); 
}

export default graphicTierButton; 