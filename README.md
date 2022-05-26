# Spacetime Standard Kit 
The Spacetime standard kit provide developers with turnkey virtual environments. This package will provide multiple metaverse features like multiplayer, custom avatars, vehicle and blockchain connection. 

We are making this codebase open source and free to use by our [community]([discord-url]) members and partners in order to facilitate the standardization of the metaverse.

[![Discord][discord]][discord-url] [![Twitter Follow][twitter]][twitter-url]  
![GitHub][licence] ![GitHub release (latest by date)][version] ![GitHub top language](https://img.shields.io/github/languages/top/Spacetime-Meta/spacetime-standard-kit)  
![GitHub issues](https://img.shields.io/github/issues-raw/Spacetime-Meta/spacetime-standard-kit) ![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/Spacetime-Meta/spacetime-standard-kit) 

---

The environments are built using [ThreeJs]([three]).  
[![GitHub Repo stars](https://img.shields.io/github/stars/mrdoob/three.js?label=ThreeJS%20-%20Stars&style=social)][three]  

The peer to peer multiplayer is built using [PeerJs]([peerjs]).  
[![GitHub Repo stars](https://img.shields.io/github/stars/peers/peerjs?label=PeerJS%20-%20Stars&style=social)][peerjs]


## Main Focus

This standard kit project was initially started to populate [this universe](https://www.spacetimemeta.io/#/map) with uniquely generated worlds. It has now extended to much more. As multiple other projects use our open source kit to create their own virtual environments and connect them to the spacetime metaverse. 

**Partners and contributors should keep in mind that; even as the project gets more traction, our main focus will always be on populating the space chunks with complete worlds and valuable experiences. Also, every feature will be reviewed and developed in orientation to the spacetime meta roadmap.**

## Basic Usage

Create a simple environment with avatar, ui and multiplayer:

```javascript
// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('terrain.glb');
    virtualEnvironment.spawnPlayer('avatar.glb');
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}
```
If everything works properly, you should see something like [this base template](https://stdkit-dev.netlify.app/examples/base-template/index.html)

[discord-url]: https://discord.gg/w6CzHy35E2
[discord]: https://img.shields.io/discord/685241246557667386?logo=discord
[licence]: https://img.shields.io/github/license/Spacetime-Meta/spacetime-standard-kit
[version]: https://img.shields.io/github/v/release/Spacetime-Meta/spacetime-standard-kit
[three]: (https://github.com/mrdoob/three.js)
[peerjs]: (https://github.com/peers/peerjs)
[twitter]: https://img.shields.io/twitter/follow/Spacetime_Meta?style=social
[twitter-url]: https://twitter.com/intent/follow?screen_name=Spacetime_Meta
