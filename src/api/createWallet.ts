const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');
require('dotenv').config();
const network = bitcoin.networks.bitcoin;
const fs = require('fs');

// console.log(bip39);

const bitPath = `m/44'/0'/0'/0/0`;



// generate wallet
const createBIP39Wallet = (name:string) => {

	let mnemonic = bip39.generateMnemonic();
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	let root = bip32.fromSeed(seed, network);

	let account = root.derivePath(bitPath);
	let node = account.derive(0).derive(0);

	let btcAddress = bitcoin.payments.p2pkh({
		pubkey: node.publicKey,
		network: network,
	}).address;

	console.log(`

Wallet generated:

- Address : ${btcAddress},
- Key : ${node.toWIF()},
- Mnemonic : ${mnemonic}

`);

	return {
		name: name,
		mnemonic: mnemonic,
		address: btcAddress,
	};
};








module.exports=createBIP39Wallet;


//  mnemonicToSeedSync: [Function: mnemonicToSeedSync],
//   mnemonicToSeed: [Function: mnemonicToSeed],
//   mnemonicToEntropy: [Function: mnemonicToEntropy],
//   entropyToMnemonic: [Function: entropyToMnemonic],
//   generateMnemonic: [Function: generateMnemonic],
//   validateMnemonic: [Function: validateMnemonic],
//   setDefaultWordlist: [Function: setDefaultWordlist],
//   getDefaultWordlist: [Function: getDefaultWordlist],



