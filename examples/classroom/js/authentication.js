const TOKEN_ADDRESS = '0xb592a499c2bd9c57761078a48e6e5af71b68bde2';
const TOKEN_ID = '11';

// const TOKEN_ADDRESS = '0x04b425ad6dd6ae0eb2d90e67086df69440fcd1b4';
// const TOKEN_ID = '63';

const connectWallet = document.getElementById('connect-wallet');
// const noWallet = document.getElementById('no-wallet');
const labelError = document.getElementById('error');
const logo = document.getElementById('logo');

connectWallet.addEventListener('click', function(e) {
    if(connectWallet.classList.contains("valid")) {
        window.location.href = 'index.html';
    } else {
        ethereum.request({ method: "eth_requestAccounts" })
        .then(() => {
            console.log("Connected");
            let account = ethereum.selectedAddress;
            let network = getNetWork(ethereum.chainId);
            
            validateNFT(account, network);
            
        })
        .catch((err) => console.error(err.message));
    
        ethereum.on("accountsChanged", (accounts) => {
            let network = getNetWork(ethereum.chainId);
            if (accounts.length > 0 && network) {
                console.log(`Using account ${accounts[0]}`);
                validateNFT(accounts[0], network);
            }
        });

        ethereum.on('chainChanged', (_chainId) => window.location.reload());
        
        ethereum.on("message", (message) => console.log(message));
    }
    
});

logo.addEventListener('click', function(e) {
    window.location.href = 'index.html';
});

async function validateNFT(account, network) {
    if(account && network) {
        const api = `https://api-nft.airclass.io/nft/${account}/${network}`;
        let response = await fetch(api);
        let data = await response.json();
        data.nft.map((nft, index) => {
            const tokenAddress = nft.token_address;
            const tokenId = nft.token_id;
            const ownerOf = nft.owner_of;
            if(tokenAddress === TOKEN_ADDRESS && tokenId === TOKEN_ID && ownerOf === account) {
                connectWallet.innerHTML = "Enter Metaverse";
                connectWallet.classList.add("valid");
            }
        });
    }
    

    if(!connectWallet.classList.contains("valid")) {
        connectWallet.innerHTML = "Connect Wallet";
        labelError.innerHTML = "You do not have NFT key to access the metaverse";
    }
}

function getNetWork(hex) {
    if(hex) {
        let chainId = parseInt(hex, 16);
        switch(chainId) {
            case 4:
                return 'rinkeby'
            case 80001:
                return 'testnet'
        }
    }
    return '';
}