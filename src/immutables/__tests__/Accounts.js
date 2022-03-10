import DerivAPI          from '../../DerivAPI';
import Balance           from '../../streams/Balance';
import Transactions      from '../../streams/Transactions';
import { TestWebSocket } from '../../test_utils';
import Account           from '../Account';

const valid_token   = 'ValidToken';
const invalid_token = 'InvalidToken';
const response      = {};

let connection;
let account;
let api;

test('Account instance', async () => {
    expect(account).toBeInstanceOf(Account);

    expect(() => { account.loginid = 'CR1234'; }).toThrow(Error);

    ['email', 'country', 'currency', 'loginid', 'user_id', 'fullname'].forEach((field) => {
        expect(account[field]).toBe(response.authorize[field]);
    });

    expect(account.siblings).toEqual(response.authorize.account_list);

    expect(account.landing_company.short).toBe(response.authorize.landing_company_name);
    expect(account.landing_company.full).toBe(response.authorize.landing_company_fullname);
});

test('Account balance', async () => {
    const { balance } = account;

    expect(balance).toBeInstanceOf(Balance);

    expect(balance.display).toBe('1,000.00');
    expect(balance.currency).toBe(response.authorize.currency);
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

    expect(status_codes).toEqual(response.get_account_status.status);
    expect(risk).toEqual(response.get_account_status.risk_classification);
    expect(typeof show_authentication).toBe('boolean');

    if (show_authentication) {
        expect(response.get_account_status.prompt_client_to_authenticate).toBeTruthy();
    } else {
        expect(response.get_account_status.prompt_client_to_authenticate).toBeFalsy();
    }
});

test('Account with invalid token', async () => {
    connection.replaceResponse('authorize', {
        error: { code: 'InvalidToken', message: 'The token is invalid.' },
    });

    const new_account = new Account(api, invalid_token);

    await new_account.init().catch((error) => expect(error).rejects);
});

beforeAll(async () => {
    response.authorize = {
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

    response.get_account_status = {
        prompt_client_to_authenticate: 0,
        risk_classification          : 'low',
        status                       : ['S1', 'S2'],
    };

    connection = new TestWebSocket({
        active_symbols: [{ symbol: 'R_100', pip: 0.01 }],
        balance       : { balance: 1000, currency: 'USD' },
        transaction   : {},
        forget        : 1,
        ...response,
    });

    api = new DerivAPI({ connection });

    account = new Account(api, valid_token);

    await account.init();
});
