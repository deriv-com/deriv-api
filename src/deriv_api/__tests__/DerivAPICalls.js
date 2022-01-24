import DerivAPICalls from '../DerivAPICalls';

let api;

test('Constructing DerivAPICalls', async () => {
    expect(api).toBeInstanceOf(DerivAPICalls);

    const crypt_config_request = { crypto_config: 1 };
    const response             = await api.cryptoConfig(crypt_config_request);
    expect(response).toEqual(crypt_config_request);

    const website_status_request = { website_status: 1 };
    const response1              = await api.websiteStatus(website_status_request);
    expect(response1).toEqual(website_status_request);
});

beforeAll(() => {
    api      = new DerivAPICalls();
    api.send = async function send(args) {
        this.arguments = args;
        return this.arguments;
    };
});
