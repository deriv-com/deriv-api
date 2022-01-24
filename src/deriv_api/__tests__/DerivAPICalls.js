import DerivAPICalls from '../DerivAPICalls';

let api;

test('Constructing DerivAPICalls', async () => {
    expect(api).toBeInstanceOf(DerivAPICalls);

    const crypt_config_request = { crypto_config: 1 };
    const response             = await api.cryptoConfig(crypt_config_request);
    expect(response).toEqual(crypt_config_request);
});

beforeAll(() => {
    api      = new DerivAPICalls();
    api.send = async function send(args) {
        this.arguments = args;
        return this.arguments;
    };
});
