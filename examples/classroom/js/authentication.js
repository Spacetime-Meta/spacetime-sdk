const TOKEN_ADDRESS = '0x04b425ad6dd6ae0eb2d90e67086df69440fcd1b4';
// const TOKEN_ADDRESS = '';
const TOKEN_ID = 63;

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
            if(account) {
                const api = `https://api-nft.airclass.io/nft/${account}/testnet`;
                fetchAsync(api);
            }
        })
        .catch((err) => console.error(err.message));
    
        ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                console.log(`Using account ${accounts[0]}`);
                const api = `https://api-nft.airclass.io/nft/${accounts[0]}/testnet`;
                fetchAsync(api);
            }
        });
        
        ethereum.on("message", (message) => console.log(message));
    }
    
});

logo.addEventListener('click', function(e) {
    window.location.href = 'index.html';
});

async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    data.nft.map((nft, index) => {
        const tokenAddress = nft.token_address;
        const tokenId = nft.token_id;
        if(tokenAddress === TOKEN_ADDRESS && tokenId == TOKEN_ID) {
            connectWallet.innerHTML = "Enter Metaverse";
            connectWallet.classList.add("valid");
        }
    });

    if(!connectWallet.classList.contains("valid")) 
        labelError.innerHTML = "You do not have NFT key to access the metaverse";
    
    return data;
}