import { first }     from 'rxjs/operators';

import DerivAPIBasic from '../../DerivAPI/DerivAPIBasic';
import Transaction   from '../../Immutables/Transaction';
import Transactions  from '../Transactions';

let api;
let transactions;
let global_req_id;

global.WebSocket = jest.fn();

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    transactions = new Transactions(api);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        const request                    = JSON.parse(msg);
        const { req_id, active_symbols } = request;

        global_req_id = req_id;

        if (active_symbols) return sendMessage('active_symbols', [{ symbol: 'R_100', pip: 0.01 }]);

        return sendMessage('transaction', {});
    });

    await transactions.init();
});

const tx_template = {
    symbol      : 'R_100',
    amount      : 10,
    currency    : 'USD',
    display_name: 'Volatility 100 Index',
};

test('Request for transactions', async () => {
    expect(transactions).toBeInstanceOf(Transactions);

    expect(() => { transactions.list = []; }).toThrow(Error);

    expect(transactions.list).toBeInstanceOf(Array);
    expect(transactions.list).toHaveLength(0);

    sendMessage('transaction', { action: 'buy', ...tx_template });

    const current_transaction = transactions.list.slice(-1)[0];

    expect(current_transaction).toBeInstanceOf(Transaction);

    setTimeout(() => sendMessage('transaction', { action: 'sell', ...tx_template }), 100);

    const last_transaction = await transactions.onUpdate().pipe(first()).toPromise();

    expect(last_transaction).toBeInstanceOf(Transaction);
    expect(transactions.list.slice(-2)[0]).toEqual(current_transaction);
    expect(transactions.list.slice(-1)[0]).toEqual(last_transaction);
});

test('Check transaction object', async () => {
    const now = new Date();

    sendMessage('transaction', {
        ...tx_template,
        action        : 'buy',
        amount        : 100,
        barrier       : 123.4,
        time          : now.getTime(),
        transaction_id: 1234,
    });

    const [transaction] = transactions.list.slice(-1);

    expect(transaction.amount.display).toEqual('100.00');
    expect(transaction.barrier.pip_sized).toEqual('123.40');
    expect(transaction.time.isSame(now)).toBeTruthy();
    expect(transaction.id).toEqual(1234);
});

function sendMessage(type, obj) {
    api.connection.onmessage({
        data: JSON.stringify({
            req_id  : global_req_id,
            msg_type: type,
            [type]  : obj,
        }),
    });
}
