const TOKEN_ADDRESS = '0x04b425ad6dd6ae0eb2d90e67086df69440fcd1b4';
// const TOKEN_ADDRESS = '';
const TOKEN_ID = 63;

const connectWallet = document.getElementById('connect-wallet');
const noWallet = document.getElementById('no-wallet');
const labelError = document.getElementById('error');

connectWallet.addEventListener('click', function(e) {
    if (window.ethereum) {
        ethereum.request({ method: "eth_requestAccounts" })
        .then(() => console.log("Connected"))
        .catch((err) => console.error(err.message));

        ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                console.log(`Using account ${accounts[0]}`);
                const api = `https://api-nft.airclass.io/nft/${accounts[0]}/testnet`;
                fetchAsync(api);
            }
        });
        
        ethereum.on("message", (message) => console.log(message));
        
    } else {
        labelError.innerHTML = "Please Install a Wallet";
    }
});

noWallet.addEventListener('click', function(e) {
    window.location.href = 'index.html';
});

async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    const tokenAddress = data.nft[0].token_address;
    const tokenId = data.nft[0].token_id;
    if(tokenAddress === TOKEN_ADDRESS && tokenId == TOKEN_ID) {
        window.location.href = 'index.html';
    } else{
        labelError.innerHTML = "No permission to access!";
    }
    return data;
}