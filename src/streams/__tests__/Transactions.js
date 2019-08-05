import { first }         from 'rxjs/operators';

import DerivAPI          from '../../DerivAPI';
import Transaction       from '../../immutables/Transaction';
import { TestWebSocket } from '../../test_utils';
import Transactions      from '../Transactions';

let connection;
let transactions;

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

    connection.receive('transaction', { action: 'buy', ...tx_template });

    const current_transaction = transactions.list.slice(-1)[0];

    expect(current_transaction).toBeInstanceOf(Transaction);

    connection.receiveLater('transaction', { action: 'sell', ...tx_template });

    const last_transaction = await transactions.onUpdate().pipe(first()).toPromise();

    expect(last_transaction).toBeInstanceOf(Transaction);
    expect(transactions.list.slice(-2)[0]).toEqual(current_transaction);
    expect(transactions.list.slice(-1)[0]).toEqual(last_transaction);
});

test('Check transaction object', async () => {
    const now = parseInt((new Date().getTime()) / 1000, 10);

    connection.receive('transaction', {
        ...tx_template,
        action          : 'buy',
        amount          : 100,
        barrier         : 123.4,
        transaction_id  : 1234,
        transaction_time: now,
    });

    const [transaction] = transactions.list.slice(-1);

    expect(transaction.amount.display).toEqual('100.00');
    expect(transaction.barrier.pip_sized).toEqual('123.40');
    expect(transaction.time.isSame(now)).toBeTruthy();
    expect(transaction.id).toEqual(1234);
});

beforeAll(async () => {
    connection = new TestWebSocket({
        active_symbols: [{ symbol: 'R_100', pip: 0.01 }],
        transaction   : {},
    });

    const api = new DerivAPI({ connection });

    transactions = new Transactions(api);

    await transactions.init();
});
