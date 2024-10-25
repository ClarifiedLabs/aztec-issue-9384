import { createPXEClient } from '@aztec/aztec.js';
import { deployInitialTestAccounts, getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import util from 'node:util';
import child_process from 'node:child_process';
const exec = util.promisify(child_process.exec);

import { ExampleContract } from './lib/Example'

// Pull the first aztec wallet address and secret key from the docker-compose sandbox logs
async function getDockerWalletInfo() {
    let address = '';
    let secret = '';
    const { stdout } = await exec(`
        docker-compose -p sandbox logs --no-log-prefix aztec \
         | egrep "^ (Address|Secret Key):" \
         | sed "s/^ //" | head -2
    `);
    stdout.split('\n').forEach(line => {
        if (line.startsWith('Address:')) {
            address = line.split(' ')[1];
        } else if (line.startsWith('Secret Key:')) {
            secret = line.split(' ')[2];
        }
    });
    return { address, secret };
}


async function main() {
    const pxe = createPXEClient('http://localhost:8080');
    const [wallet] = await getInitialTestAccountsWallets(pxe)

    const dockerWalletInfo = await getDockerWalletInfo();

    console.log('Wallet from getInitialTestAccountsWallets(): Secret Key:',
        wallet.getSecretKey().toString(), 'Address:', wallet.getAddress().toString());
    console.log('Wallet from docker-compose sandbox logs:     Secret Key:',
        dockerWalletInfo.secret, 'Address:', dockerWalletInfo.address);

    try {
        console.log("Attempting and failing to deploy ExampleContract...");
        // This will not work
        const example = await ExampleContract.deploy(wallet).send().deployed();
    } catch (e) {
        console.log('Error deploying ExampleContract:', e);

        console.log("Calling `deployInitialTestAccounts()`...");
        await deployInitialTestAccounts(pxe);

        console.log("Now attempting to deploy ExampleContract again (with success)...");
        const example = await ExampleContract.deploy(wallet).send().deployed();
        console.log('ExampleContract deployed:', example.address);
    }
}


main().catch((error) => {
    console.error(error);
    process.exit(1);
});

