global.WebSocket = require('ws');
const { find } = require('rxjs/operators');
const DerivAPI = require('../dist/DerivAPI');

const token = process.env.DERIV_TOKEN;
const app_id = process.env.APP_ID || 1234;
const expected_payout = process.env.EXPECTED_PAYOUT || 19;

if (!token) {
    console.error('DERIV_TOKEN environment variable is not set');
    process.exit(1);
}
const api = new DerivAPI({ app_id });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        const account = await api.account(token);

        const { balance, currency } = account;

        console.log(`Your current balance is: ${balance.currency} ${balance.display}`);

        balance.onUpdate(() => {
            console.log(`Your new balance is: ${balance.currency} ${balance.display}`);
        });

	console.log("=============================going to call auth based");
	await sleep(30000);
	console.log("going to call auth based");
	const accountStatus = await api.basic.getAccountStatus({ get_account_status: 1 });
	console.log(accountStatus);

        const contract = await api.contract({
            contract_type: 'CALL',
            currency,
            amount: 10,
            duration: 5,
            duration_unit: 't',
            symbol: 'frxUSDJPY',
            basis: 'stake',
        });

        contract.onUpdate(({ status, payout, bid_price }) => {
            switch (status) {
                case 'proposal':
                    return console.log(
                        `Current payout: ${payout.currency} ${payout.display}`);
                case 'open':
                    return console.log(
                        `Current bid price: ${bid_price.currency} ${bid_price.display}`);
                default:
                    break;
            };
        });

        // Wait until payout is greater than USD 19
        await contract.onUpdate().pipe(find(({ payout }) => payout.value >= expected_payout)).toPromise();

        const buy = await contract.buy();

        console.log(`Buy price is: ${buy.price.currency} ${buy.price.display}`);

        // Wait until the contract is sold
        await contract.onUpdate().pipe(find(({ is_sold }) => is_sold)).toPromise();

        const { profit, status } = contract;

        console.log(`You ${status}: ${profit.currency} ${profit.display}`);

    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection and exit
        api.basic.disconnect();
    }
}

main();
