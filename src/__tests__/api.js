import ws       from 'ws';
import DerivAPI from '../DerivAPI'

let api;

beforeAll(() => {
    const connection = new ws('wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN');
    api = new DerivAPI({ connection });
});

test('Constructing DerivAPI', async() => {
    expect(api).toBeInstanceOf(DerivAPI);

    const response = await api.ping();
    expect(response.ping).toEqual('pong');

    api.disconnect();
});
