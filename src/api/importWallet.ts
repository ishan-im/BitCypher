const fs = require('fs');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');




const network = bitcoin.networks.bitcoin;

// console.log(bip39);

const bitPath = `m/44'/0'/0'/0/0`;

// Function to import a wallet from BIP39 mnemonic
 function importBIP39Wallet(name:string, mnemonic:string) {
	try {
		if (!bip39.validateMnemonic(mnemonic)) {
			throw new Error('Invalid BIP39 mnemonic provided.');
		}

        // Derive the HD wallet from the mnemonic
   
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	let root = bip32.fromSeed(seed, network);

	let account = root.derivePath(bitPath);
	let node = account.derive(0).derive(0);

	let btcAddress = bitcoin.payments.p2pkh({
		pubkey: node.publicKey,
		network: network,
	}).address;

	console.log(`

Wallet imported:
- Name: ${name},
- Address : ${btcAddress},
- Key : ${node.toWIF()},
- Mnemonic : ${mnemonic}

`);
		
		const wallet = { name: name, mnemonic: mnemonic, address: btcAddress };

	
		
	return wallet;


	} catch (error) {
		console.error('Error importing wallet:', error);
		process.exit(1);
	}
}





// Example usage:
 // Replace with your actual arguments


module.exports=importBIP39Wallet;


// Function to save the wallet locally

// 1LonwhNoUF6tH3WZGxvr2qeR2WT1o2rA3f

// 1LonwhNoUF6tH3WZGxvr2qeR2WT1o2rA3f

// heart father clog payment rapid clown soda short possible response leopard worth

// Function to load existing wallets


// Get the name and mnemonic for the new wallet from the user

//1NajF482nJ5Hy48DvvbqTk4Kf8tr7k55m5
//1NajF482nJ5Hy48DvvbqTk4Kf8tr7k55m5