const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const connectionProfilePath = path.resolve(__dirname, '../identity/connection-org1.json');
const walletPath = path.resolve(__dirname, '../identity/wallet');

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract('civicconnect');
  return { contract, gateway };
}

async function submitTx(func, ...args) {
  const { contract, gateway } = await getContract();
  const result = await contract.submitTransaction(func, ...args);
  await gateway.disconnect();
  return result.toString();
}

async function queryTx(func, ...args) {
  const { contract, gateway } = await getContract();
  const result = await contract.evaluateTransaction(func, ...args);
  await gateway.disconnect();
  return result.toString();
}

module.exports = { submitTx, queryTx };
