import { first }     from 'rxjs/operators';

import DerivAPIBasic from '../../deriv_api/DerivAPIBasic';
import Balance       from '../Balance';

let api;
let balance;
let req_id;

global.WebSocket = jest.fn();

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    balance = new Balance(api);
});

test('Initiallize balance with initial value', async () => {
    expect(balance).toBeInstanceOf(Balance);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        ({ req_id } = JSON.parse(msg));

        sendMessage('balance', { balance: 200, currency: 'USD' });
    });

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

    sendMessage('balance', { balance: 1000, currency: 'USD' });

    expect(balance.value).toEqual(balance.amount.value);
    expect(balance.value).toEqual(1000);
    expect(balance.display).toEqual('1000.00');

    sendMessage('balance', { balance: 2000, currency: 'USD' });

    expect(balance.value).toEqual(2000);

    setTimeout(() => sendMessage('balance', { balance: 4000, currency: 'USD' }), 100);

    const new_balance = await balance.onUpdate().pipe(first()).toPromise();

    expect(new_balance.currency).toEqual(balance.currency);
    expect(new_balance.value).toEqual(4000);
    expect(new_balance.display).toEqual('4000.00');
});

function sendMessage(type, obj) {
    api.connection.onmessage({ data: JSON.stringify({ req_id, msg_type: type, [type]: obj }) });
}
