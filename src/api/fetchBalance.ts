const axios = require('axios');
require('dotenv').config();

// fetch balance



async function getBitcoinBalance(address:string){
	 
	const apiUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${process.env.BITCOIN_NODE_TOKEN}`;

	try {
		const response = await axios.get(apiUrl);
		const balance = response.data.balance;

		console.log(`Bitcoin Address: ${address}`);
		console.log(`Balance: ${balance} Satoshi (${balance / 1e8} BTC)`);
	} catch (error) {
		console.error(error);
	}
};

module.exports=getBitcoinBalance;
