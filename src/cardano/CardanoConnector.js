import WalletApi, { Cardano, Wallet } from './nami.js';
 
export class CardanoConnector {
    constructor(blockfrostApiKey) {

        this.BLOCKFROST_API_KEY = blockfrostApiKey;

        // vars
        this.isConnected = false;
        this.assets = [];
        this.balance = 0;

        // check if the user has a pre selected wallet
        // in localStorage and attempt connection
        this.detect();

    }
    
    detect = async function () {
        const cardano_serialization_lib = await Cardano();

        // check local storage for a pre selected wallet
        this.walletName = localStorage.getItem('wallet_name');
        if(this.walletName){

            if(typeof window.cardano[this.walletName] !== "undefined"){
                const wallet = new Wallet(window.cardano[this.walletName])
                await wallet.isEnabled().then(async result => {
                    
                    VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.homePanel.walletIsLoading();

                    this.isConnected = await result;
                    
                    if(result) {
                        
                        console.log(`%c [Cardano Connector] Connected to predefined wallet: ${this.walletName}`, 'color:#bada55');
                        
                        let walletInnerApi = await wallet.enable();

                        const walletAPI = new WalletApi(
                            cardano_serialization_lib,
                            wallet,
                            walletInnerApi,
                            [0,this.BLOCKFROST_API_KEY]
                        );

                        await walletAPI.getBalance().then(result => {
                            this.handleLoadedAssets(result);
                        });
                    }
                    else { 
                        console.warn(`[Cardano Connector] Predefined wallet '${this.walletName}' not enabled in the page, removing from local storage.`)
                        localStorage.removeItem('wallet_name');
                    }
                })
            } else {
                console.error("[Cardano Connector] Predefined wallet not injected in window");
            }
        } else {
            console.log(`%c [Cardano Connector] No preselected wallet found`, 'color:#bada55');
        }
    }

    connect = async function (walletName) {

        localStorage.setItem('wallet_name', walletName)
        
        this.walletName = walletName;
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.homePanel.walletIsLoading();

        // Connects chosen wallet to current website 
        const  cardano_serialization_lib = await Cardano();

        if(typeof window.cardano[walletName] !== undefined) {
            const wallet = new Wallet(window.cardano[walletName])
            let walletInnerApi = await wallet.enable()

            this.isConnected = true;

            const walletAPI = new WalletApi(
                cardano_serialization_lib,
                wallet,
                walletInnerApi,
                [0,this.BLOCKFROST_API_KEY]
            )

            await walletAPI.getBalance().then(result => {
                this.handleLoadedAssets(result);
            })

            localStorage.setItem('wallet_name', walletName)
        } 
        else {
            console.log(`%c [Cardano Connector] You do not have ${walletName} wallet installed.`, 'color:#edad00');
        }
    }

    handleLoadedAssets(result) {

        this.assets = result.assets; 
        this.balance = result.lovelace; 
        
        console.log(`%c [Cardano Connector] Wallet balance is: ${result.lovelace / 1000000} ₳`, 'color:#bada55');
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.homePanel.walletIsLoaded();
        VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.walletPanel.displayCNFTs();

        // this.assets.forEach( (asset) => {
        //     if(asset.policy === "97e72e5296224499ca1911e52960a56426b0eebfbc875263547ce240") {
        //         VIRTUAL_ENVIRONMENT.UI_CONTROLLER.blockerScreen.menu.menuDisplay.avatarPanel.addNewAvatarButton({
        //             name: asset.name,
        //             mesh: 'https://elegant-truffle-070d6b.netlify.app/xBot.glb',
        //             animations: 'https://elegant-truffle-070d6b.netlify.app/defaultAnimations.glb',
        //             mapping: { walk: 1, idle: 2, run: 3, jump: 4, fall: 4 },
        //             scaleFactor: 0.01,
        //             offset: 0.75
        //         })
        //         console.log(asset.name);
        //     }
        // })
    }
}