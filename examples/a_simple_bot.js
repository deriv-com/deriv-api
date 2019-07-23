global.WebSocket = require('ws');
const DerivAPI = require('../dist/DerivAPI').default;

const token = process.env.DERIV_TOKEN;

if (!token) {
	console.error('DERIV_TOKEN environment variable is not set');
	process.exit(1);
}

const api = new DerivAPI();

async function main() {
	const account = await api.account(token);

	const { balance } = account;

	console.log(`Your current balance is: ${balance.currency} ${balance.value}`);

	balance.onUpdate(() => {
		console.log(`Your new balance is: ${balance.currency} ${balance.value}`);
	});
}

main().then(console.log).catch(console.log);
