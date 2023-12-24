const axios = require('axios');
require('dotenv').config();
// const args = process.argv.slice(2);


function formatDateTime(dateString:any) {
	const dateObject = new Date(dateString);

	// Format the date and time components
	const year = dateObject.getFullYear();
	const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
	const day = ('0' + dateObject.getDate()).slice(-2);
	const hours = ('0' + dateObject.getHours()).slice(-2);
	const minutes = ('0' + dateObject.getMinutes()).slice(-2);
	const seconds = ('0' + dateObject.getSeconds()).slice(-2);

	// Create a human-readable date and time string
	const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

	return formattedDateTime;
}


async function getWalletTransactions(address:string) {
	const apiUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${process.env.BITCOIN_NODE_TOKEN}`;

	try {
		const response = await axios.get(apiUrl);

		if (response.data.txs.length === 0) {
			throw new Error(`No transactions found for address ${address}`);
		}

		// Map the transactions
		const transactions = response.data.txs.map((tx:any) => {
			return {
				transactionId: tx.hash,
				transactionDate: formatDateTime(tx.received),
				transactionAmount:
					tx.inputs.reduce(
						(sum: any, input: any) => sum + input.output_value,
						0
					) /
						1e8 +
					' BTC',
				confirmations: tx.confirmations,
			};
		});

		// Log or return the transactions
		console.log(transactions);
		return transactions;
	} catch (error) {
		console.error('Error fetching transactions:', error);
		throw error;
	}
}

// Example usage:




module.exports = getWalletTransactions;

