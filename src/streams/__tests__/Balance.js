import { first }         from 'rxjs/operators';

import DerivAPI          from '../../DerivAPI';
import { TestWebSocket } from '../../test_utils';
import Balance           from '../Balance';

let connection;
let balance;

test('Initiallize balance with initial value', async () => {
    expect(balance).toBeInstanceOf(Balance);

    // Set initial balance
    const promise = balance.init({ balance: 100, currency: 'USD' });

    // Check initial balance
    expect(balance.value).toEqual(100);
    expect(balance.display).toEqual('100.00');
    expect(balance.currency).toEqual('USD');

    await promise;
});

test('Request for balance', async () => {
    expect(() => { balance.currency = 'AUD'; }).toThrow(Error);

    connection.receive('balance', { balance: 1000, currency: 'USD' });

    expect(balance.value).toEqual(balance.amount.value);
    expect(balance.value).toEqual(1000);
    expect(balance.display).toEqual('1,000.00');

    connection.receive('balance', { balance: 2000, currency: 'USD' });

    expect(balance.value).toEqual(2000);

    connection.receiveLater('balance', { balance: 4000, currency: 'USD' });

    const new_balance = await balance.onUpdate().pipe(first()).toPromise();

    expect(new_balance.currency).toEqual(balance.currency);
    expect(new_balance.value).toEqual(4000);
    expect(new_balance.display).toEqual('4,000.00');
});

beforeAll(async () => {
    connection = new TestWebSocket({
        balance: { balance: 200, currency: 'USD' },
    });

    const api = new DerivAPI({ connection });

    balance = new Balance(api);
});
