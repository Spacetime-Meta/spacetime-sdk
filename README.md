# 👋 Spacetime SDK 🛰️
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

## How to run in `local`

**Goal: Run a simple environment with avatar, ui, multiplayer and cardano wallet connection:**  
*If you are just looking to develop an environment, the [base template](https://github.com/Spacetime-Meta/base-template) is probably what you are looking for. The spacetime-sdk is meant for developpers who wants to add new features into the metaverse.*

**First**, clone the repo and install the dependencies a the root.
```
git clone https://github.com/Spacetime-Meta/spacetime-sdk.git
cd spacetime-sdk
npm install
```
**Second**, configure the cardano connection.
For this you need to create a config file in `src/cradano/config.js`.
This config file must contains your blockfrost api keys in the following format:
```javascript
const blockfrostApiKey = {
    0: "testnet...", // testnet
    1: "mainnet..." // mainnet
}
export default blockfrostApiKey;
```
**Third**, install the dependencies of the cardano folder.
```
cd src/cardano
npm install
cd ../..
```
**Finaly**, once all the steps are completed, you will be able to run the sdk using `npm run start`.
This will start a server on your local machine and the examples will be available at `http://localhost:8080/`

## How to use the sdk

To use the sdk in your webpage, you first need to get it from a source.
```
<script src="http://localhost:8080/bundle.min.js"></script>
```

Then you have access to the `VirtualEnvironment` class in the window.
To instanciate a new VirtualEnvironment, you need to pass it a config.

```javascript
// simply call the virtual env with your config 
const virtualEnvironment = new VirtualEnvironment("./configs/devPlanet.json");

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}
```
If everything works properly, you should see something like [this world](https://www.spacetimemeta.io/metaverse/spawn-planet)

## Contributors
![contrib][contributors]

Thanks to our contributors 💎🚀

[discord-url]: https://discord.gg/w6CzHy35E2
[discord]: https://img.shields.io/discord/685241246557667386?logo=discord
[licence]: https://img.shields.io/github/license/Spacetime-Meta/spacetime-standard-kit
[version]: https://img.shields.io/github/v/release/Spacetime-Meta/spacetime-standard-kit
[three]: (https://github.com/mrdoob/three.js)
[peerjs]: (https://github.com/peers/peerjs)
[twitter]: https://img.shields.io/twitter/follow/Spacetime_Meta?style=social
[twitter-url]: https://twitter.com/intent/follow?screen_name=Spacetime_Meta
[contributors]: https://contrib.rocks/image?repo=Spacetime-Meta/spacetime-standard-kit
