#! /usr/bin/env node


const axios = require('axios');
const { Command } = require('commander'); // add this line
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const createBIP39Wallet = require('./api/createWallet');
const displayWallets = require('./api/listAllWallets');
const importBIP39Wallet = require('./api/importWallet');
const getBitcoinBalance = require('./api/fetchBalance');
const getWalletTransactions = require('./api/getWalletTransaction');
const generateUnusedBitcoinAddressForWallet = require('./api/getUnusedBitcoinAddress');

const program = new Command();



console.log(figlet.textSync('Directory Manager'));

program
	.version('1.0.0')
	.description('An example CLI for managing a directory')
	.option('-l, --ls  [value]', 'List directory contents')
	.option('-m, --mkdir <value>', 'Create a directory')
	.option('-t, --touch <value>', 'Create a file')
	.parse(process.argv);

program
	.command('create <walletName>')
	.description('Generate a BIP39 wallet ')
	.action((walletName: string) => {
		// Your custom command logic here
		console.log('Executing create wallet command...');
		
		const newWallet = createBIP39Wallet(walletName);
		saveNewWallet(newWallet);
	});



program
	.command('import <walletName> <mnemonic>')
	.description('Generate a BIP39 wallet from BIP39 Mnemonic')
	.action((name: string, mnemonic: string) => {
		// Your custom command logic here
		console.log('Executing import wallet command...');
		console.log(name, mnemonic);

		const importedWallet = importBIP39Wallet(name, mnemonic);
		saveWallet(importedWallet);
	});

program
	.command('list')
	.description('List all wallets')
	.action(() => {
		// Your custom command logic here
		console.log('Executing Wallet list command...');
		const wallets = loadWallets();

		// Display the list of wallets
		displayWallets(wallets);
	});

// Get bitcoin balance of a wallet
program
	.command('balance <walletAddress>')
	.description('Get the bitcoin balance of a wallet')
	.action((walletAddress: string) => {
		// Your custom command logic here
		console.log('Executing wallet balance command...');
		getBitcoinBalance(walletAddress);
	});

// Get bitcoin transactions of a wallet
program
	.command('transactions <walletAddress>')
	.description('Get the bitcoin transactions of a wallet')
	.action((walletAddress: string) => {
		// Your custom command logic here
		console.log('Executing transaction command...');
		getWalletTransactions(walletAddress)
			.then((transactions:any) => {
				// Handle the transactions as needed
				console.log('Processed transactions:', transactions);
			})
			.catch((error:any) => {
				// Handle errors
				console.error('An error occurred:', error);
			});
	});

// Generate an unused bitcoin address for a wallet
program
	.command('generate <walletAddress>')
	.description('Generate an unused bitcoin address for a wallet')
	.action((walletAddress: string) => {
		// Your custom command logic here
		console.log('Executing generate command...');
		generateUnusedBitcoinAddressForWallet(walletAddress)
			.then((unusedAddress:string) => {
				console.log(
					`Unused Bitcoin Address for the wallet: ${unusedAddress}`
				);
			})
			.catch((error:any) => {
				console.error('An error occurred:', error);
			});
	});

    
program.parse(process.argv);



const options = program.opts();

async function listDirContents(filepath: string) {
	try {
		const files = await fs.promises.readdir(filepath);
		const detailedFilesPromises = files.map(async (file: string) => {
			let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
			const { size, birthtime } = fileDetails;
			return { filename: file, 'size(KB)': size, created_at: birthtime };
		});

		const detailedFiles = await Promise.all(detailedFilesPromises);
		console.table(detailedFiles);
	} catch (error) {
		console.error('Error occurred while reading the directory!', error);
	}
}

function createDir(filepath: string) {
	if (!fs.existsSync(filepath)) {
		fs.mkdirSync(filepath);
		console.log('The directory has been created successfully');
	}
}

function createFile(filepath: string) {
	fs.openSync(filepath, 'w');
	console.log('An empty file has been created');
}

if (options.ls) {
	const filepath = typeof options.ls === 'string' ? options.ls : __dirname;
	listDirContents(filepath);
}

if (options.mkdir) {
	createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
	createFile(path.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length) {
	program.outputHelp();
}





function loadWallets() {
	try {
		const data = fs.readFileSync('wallets.json');
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
}

function saveWallet(wallet: any) {
	const wallets = loadWallets();

	// Check if the wallet is already present
	const isWalletAlreadyPresent = wallets.some(
		(w: any) => w.address === wallet.address
	);

	console.log(isWalletAlreadyPresent);

	if (!isWalletAlreadyPresent) {
		wallets.push(wallet);
		fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
		console.log('Wallet saved successfully.');
	} else {
		console.log('Wallet already exists in storage, Not saving again.');
	}
}

function saveNewWallet(wallet: any) {
	const wallets = loadWallets();
	wallets.push(wallet);
	fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
}
