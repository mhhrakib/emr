'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let ccp;
let wallet;

async function initialize() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '../..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('lab');
        if (!identity) {
            console.log('An identity for the user "lab" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    } catch (error) {
        console.error(`Failed to evaluate or invoke transaction: ${error}`);
        process.exit(1);
    }
}
// async addEMR(ctx, userID, adder, ID, type, content)
async function addEMR(userEmail, adderEmail, emrID, type, content) {
    // create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'lab', discovery: { enabled: true, asLocalhost: true } });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // get the contract from the network.
    const contract = network.getContract('emr');
    var result;
    try {
        result = await contract.submitTransaction('addEMR', userEmail, adderEmail, emrID, type, content);
    }
    catch (error) {
        result = error;
        console.error(error.toString());
    } finally {
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);
        await gateway.disconnect();
        return result.toString();
    }
}


// // async addEMR(ctx, userID, adder, ID, type, content)
// async function addEMR(userEmail, adderEmail, emrID, type, content) {
//     // create a new gateway for connecting to our peer node.
//     const gateway = new Gateway();
//     await gateway.connect(ccp, { wallet, identity: 'lab', discovery: { enabled: true, asLocalhost: true } });

//     // get the network (channel) our contract is deployed to.
//     const network = await gateway.getNetwork('mychannel');

//     // get the contract from the network.
//     const contract = network.getContract('emr');
//     var result;
//     try {
//         result = await contract.submitTransaction('addEMR', userEmail, adderEmail, emrID, type, content);
//     }
//     catch (error) {
//         result = error;
//         console.error(error.toString());
//     } finally {
//         console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);
//         await gateway.disconnect();

//         return result.toString();
//     }

// }

// // async addEMR(ctx, userID, adder, ID, type, content)
// async function addEMR(userEmail, adderEmail, emrID, type, content) {
//     try {
//         // create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'lab', discovery: { enabled: true, asLocalhost: true } });

//         // get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('mychannel');

//         // get the contract from the network.
//         const contract = network.getContract('emr');
        
//         const result = await contract.submitTransaction('addEMR', userEmail, adderEmail, emrID, type, content);
        
//         console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

//         await gateway.disconnect();

//         return result.toString();
//     } catch (error) {
//         console.error(`addEMR: Failed to evaluate transaction: ${error}`);
//         return error;
//     }
// }


exports.initialize = initialize;
exports.addEMR = addEMR;
