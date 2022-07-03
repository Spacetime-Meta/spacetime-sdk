export const LocationManager = {
    getLocation() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            x: parseInt(urlParams.get("x")), 
            y: parseInt(urlParams.get("y")),
            z: parseInt(urlParams.get("z"))
        }
    }
}