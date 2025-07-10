const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const ca = new FabricCAServices(caInfo.url);

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userExists = await wallet.get('appUser');
    if (userExists) return console.log('User already exists');

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) throw new Error('Admin identity not found');

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: 'appUser',
      role: 'client'
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: 'appUser',
      enrollmentSecret: secret
    });

    const identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };

    await wallet.put('appUser', identity);
    console.log('✅ User registered');
  } catch (error) {
    console.error('❌ Failed to register user:', error);
  }
}

main();
