import DerivAPICalls, { parseArgs } from '../DerivAPICalls';

const api = new DerivAPICalls();

test('Constructing DerivAPICalls', async () => {
    expect(api).toBeInstanceOf(DerivAPICalls);

    const crypt_config_request = { crypto_config: 1 };
    const response             = await api.cryptoConfig(crypt_config_request);
    expect(response).toEqual(crypt_config_request);

    const website_status_request = { website_status: 1 };
    const response1              = await api.websiteStatus(website_status_request);
    expect(response1).toEqual(website_status_request);
});

test('Invoking parseArgs', async () => {
    const config = {
        amount: {
            type: 'numeric',
        },
        from_account: {
            type: 'string',
        },
        platform: {
            required: 1,
            type    : 'string',
        },
        req_id: {
            type: 'numeric',
        },
        to_account: {
            required: 1,
            type    : 'string',
        },
        trading_platform_deposit: {
            required: 1,
            type    : 'numeric',
        },
    };

    const args = {
        amount                  : '5.5',
        from_account            : 'Account1',
        platform                : 'Cashier',
        req_id                  : 1,
        to_account              : 'Account2',
        trading_platform_deposit: 1,
    };

    const allArgs = {
        method        : 'trading_platform_deposit',
        needsMethodArg: '1',
        args,
        config,
    };

    const parsed_args = {
        amount                  : 5.5,
        from_account            : 'Account1',
        platform                : 'Cashier',
        req_id                  : 1,
        to_account              : 'Account2',
        trading_platform_deposit: 1,
    };

    expect(parseArgs(allArgs)).toEqual(parsed_args);
});

beforeAll(() => {
    api.send = async function send(args) {
        this.arguments = args;
        return this.arguments;
    };
});
