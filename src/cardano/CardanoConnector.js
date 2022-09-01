import WalletApi, { Cardano, Wallet } from './nami.js';
 
export class CardanoConnector {
    constructor() {

        // vars
        this.isConnected = false;

        // check if the user has a pre selected wallet
        // in localStorage and attempt connection
        this.detect();

    }
    
    detect = async function () {
        const cardano_serialization_lib = await Cardano();

        // check local storage for a pre selected wallet
        this.walletName = localStorage.getItem('wallet_name');
        if(this.walletName){

            this.walletName = this.migrateCCVaultToEternel(this.walletName);

            if(typeof window.cardano[this.walletName] !== "undefined"){
                const wallet = new Wallet(window.cardano[this.walletName])
                await wallet.isEnabled().then(async result => {
                    
                    this.isConnected = await result;
                    if(result) {
                        
                        console.log(`%c [Cardano Connector] Connected to predefined wallet: ${this.walletName}`, 'color:#bada55');
                        
                        let walletInnerApi = await wallet.enable();

                        const walletAPI = new WalletApi(
                            cardano_serialization_lib,
                            wallet,
                            walletInnerApi,
                            process.env.BLOCKFROST_API_KEY
                        );

                        await walletAPI.getBalance().then(result => {
                            this.assets = result.assets;
                            console.log(`%c [Cardano Connector] Wallet balance is: ${result.lovelace / 1000000} ₳`, 'color:#bada55');
                            this.lovelace = result.lovelace;
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
            console.log(`%c [Cardano Connector] No wallet found`, 'color:#bada55');
        }
    }

    migrateCCVaultToEternel(walletName) {
        if(walletName === "ccvault") {
            console.log(`%c [Cardano Connector] Converting ccvault to eternl`, 'color:#bada55');
            localStorage.removeItem('wallet_name');
            localStorage.setItem('wallet_name', 'eternl');

            return 'eternl';
        }

        return walletName;
    }
}