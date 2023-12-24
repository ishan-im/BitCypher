
const axios = require('axios');

require('dotenv').config();

const args = process.argv.slice(2);

const apiUrl = `https://api.blockcypher.com/v1/btc/main/addrs?token=${process.env.BITCOIN_NODE_TOKEN}&bech32=true`;

// Function to generate a new Bitcoin address
async function generateBitcoinAddress() {
	try {
		const response = await axios.post(apiUrl);
		console.log(response.data);
		const newAddress = response.data.address;
		console.log(`Generated Bitcoin Address: ${newAddress}`);
		return newAddress;
	} catch (error) {
		console.error('Error generating Bitcoin address:', error);
		throw error;
	}
}

// Function to check if a specific address has transactions
async function hasTransactionsForAddress(address:string) {
	const transactions = await getBitcoinTransactions(address);
	return transactions.length > 0;
}

// Function to get Bitcoin transactions for a specific address
async function getBitcoinTransactions(address:string) {
	const transactionsUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${process.env.BITCOIN_NODE_TOKEN}`;
	try {
		const response = await axios.get(transactionsUrl);
		return response.data.txs || [];
	} catch (error) {
		console.error('Error fetching transactions:', error);
		throw error;
	}
}

// Function to generate an unused Bitcoin address for a specific wallet address
async function generateUnusedBitcoinAddressForWallet(walletAddress:string) {
	let address;
	let attempts = 0;

	// Try generating a new address until an unused one is found
	do {
		address = await generateBitcoinAddress();
		attempts++;
	} while ((await hasTransactionsForAddress(walletAddress)) && attempts < 15); // Limit the number of attempts

	if (attempts === 15) {
		throw new Error(
			'Unable to find an unused address for the wallet. Please try again later.'
		);
	}

	return address;
}

// Example usage with a specific wallet address:


// generateUnusedBitcoinAddressForWallet(args[0])
// 	.then((unusedAddress) => {
// 		console.log(
// 			`Unused Bitcoin Address for the specific wallet: ${unusedAddress}`
// 		);
// 	})
// 	.catch((error) => {
// 		console.error('An error occurred:', error.message);
// 	});


module.exports = generateUnusedBitcoinAddressForWallet;