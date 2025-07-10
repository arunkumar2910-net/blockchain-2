const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Connect to local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use the first account's private key from Hardhat node (for local only)
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

// Load ABI
const abiPath = path.join(__dirname, "../hardhat-simple/artifacts/contracts/AuthManager.sol/AuthManager.json");
const abi = JSON.parse(fs.readFileSync(abiPath)).abi;

// Contract address from deployment
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Create contract instance
const authManager = new ethers.Contract(contractAddress, abi, wallet);

// Example usage: call a contract function
async function test() {
  const user = await authManager.getUser(wallet.address);
  console.log(user);
}

test();