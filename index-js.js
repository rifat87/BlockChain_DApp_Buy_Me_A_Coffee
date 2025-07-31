import { createWalletClient, custom, createPublicClient } from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");

let walletClient;
let publicClient


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Welcome");
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })

        // Request accounts if needed from MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Now get the addresses via viem
        const addresses = await walletClient.getAddresses();
        console.log('Connected addresses:', addresses);

        connectButton.innerHTML = "Connected: " + addresses[0];
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`)


    if (typeof window.ethereum !== "undefined") {
        console.log("Welcome");
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })

        // Request accounts if needed from MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        await publicClient.simulateContract({
            // address ???
        })

        // Now get the addresses via viem
        const addresses = await walletClient.getAddresses();
        console.log('Connected addresses:', addresses);
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
