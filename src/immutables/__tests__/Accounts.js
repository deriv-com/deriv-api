import DerivAPIBasic from '../../deriv_api/DerivAPIBasic';
import Balance       from '../../streams/Balance';
import Transactions  from '../../streams/Transactions';
import Account       from '../Account';

let api;
let account;
let global_req_id;

const valid_token   = 'ValidToken';
const invalid_token = 'InvalidToken';

const authorize = {
    account_list: [
        {
            loginid: 'CR384605',
        },
        {
            loginid: 'VRTC1292426',
        },
    ],
    balance                      : 1000,
    country                      : 'id',
    currency                     : 'USD',
    email                        : 'email@binary.com',
    fullname                     : 'Mr. Tester',
    is_virtual                   : 1,
    landing_company_fullname     : 'Binary Ltd',
    landing_company_name         : 'virtual',
    loginid                      : 'VRTC12345',
    upgradeable_landing_companies: [],
    user_id                      : 123456,
};

const account_status = {
    prompt_client_to_authenticate: 0,
    risk_classification          : 'low',
    status                       : ['S1', 'S2'],
};

global.WebSocket = jest.fn();

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    account = new Account(api, valid_token);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        const request = JSON.parse(msg);
        const {
            req_id,
            active_symbols,
            balance,
            get_account_status,
            transaction,
        } = request;

        global_req_id = req_id;

        if (active_symbols) return sendMessage('active_symbols', [{ symbol: 'R_100', pip: 0.01 }]);
        if (balance) return sendMessage('balance', { balance: 1000, currency: 'USD' });
        if (get_account_status) return sendMessage('get_account_status', account_status);
        if (transaction) return sendMessage('transaction', {});

        return sendMessage('authorize', authorize);
    });

    await account.init();
});

test('Account instance', async () => {
    expect(account).toBeInstanceOf(Account);

    expect(() => { account.loginid = 'CR1234'; }).toThrow(Error);

    ['email', 'country', 'currency', 'loginid', 'user_id', 'fullname'].forEach((field) => {
        expect(account[field]).toBe(authorize[field]);
    });

    expect(account.siblings).toEqual(authorize.account_list);

    expect(account.landing_company.short).toBe(authorize.landing_company_name);
    expect(account.landing_company.full).toBe(authorize.landing_company_fullname);
});

test('Account balance', async () => {
    const { balance } = account;

    expect(balance).toBeInstanceOf(Balance);

    expect(balance.display).toBe(`${authorize.balance.toFixed(2)}`);
    expect(balance.currency).toBe(authorize.currency);
});

test('Account transactions', async () => {
    const { transactions } = account;

    expect(transactions).toBeInstanceOf(Transactions);
    expect(transactions.list).toBeInstanceOf(Array);
    expect(transactions.list).toHaveLength(0);
});

test('Account contracts', async () => {
    const { contracts } = account;

    expect(contracts).toBeInstanceOf(Array);
    expect(contracts).toHaveLength(0);
});

test('Account status', async () => {
    const { status_codes, risk, show_authentication } = account;

    expect(status_codes).toEqual(account_status.status);
    expect(risk).toEqual(account_status.risk_classification);
    expect(typeof show_authentication).toBe('boolean');

    if (show_authentication) {
        expect(account_status.prompt_client_to_authenticate).toBeTruthy();
    } else {
        expect(account_status.prompt_client_to_authenticate).toBeFalsy();
    }
});

test('Account with invalid token', async () => {
    api.connection.send = jest.fn((msg) => {
        const request    = JSON.parse(msg);
        const { req_id } = request;

        global_req_id = req_id;

        return sendError('authorize', { code: 'InvalidToken', message: 'The token is invalid.' });
    });

    const new_account = new Account(api, invalid_token);

    await expect(new_account.init()).rejects.toBeInstanceOf(Error);
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

function sendError(type, obj) {
    api.connection.onmessage({
        data: JSON.stringify({
            req_id  : global_req_id,
            msg_type: type,
            error   : obj,
        }),
    });
}
