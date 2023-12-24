const axios = require('axios');
require('dotenv').config();
const fs = require('fs');




function displayWallets(wallets:any) {
	if (wallets.length === 0) {
		console.log('No wallets found.');
	} else {
		console.log('Wallet List:');
		wallets.forEach((wallet:any, index:any) => {
			console.log(`${index + 1}. ${wallet.name} (${wallet.address})`);
		});
	}
}

module.exports = displayWallets;
		
