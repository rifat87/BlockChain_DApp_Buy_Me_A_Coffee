import { createWalletClient, custom, createPublicClient, parseEther, defineChain, fromEther } from "https://esm.sh/viem";
import {contractAddress, abi} from "./constants-js.js"

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton")

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

        const [connectedAccount]  = await walletClient.requestAddressess()
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        const {request} = await publicClient.simulateContract({
            // address ???
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount),
        })

        const hash = await walletClient.writeContract(request)

        // Now get the addresses via viem
        const addresses = await walletClient.getAddresses();
        console.log('Connected addresses:', addresses);
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"],
            },
        },
    })
    return currentChain;
}

async function getbalance() {
    if(typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const balance = await publicClient.getBalance({
            address: contractAddress
        })
    }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getbalance

// Completed without typescript added