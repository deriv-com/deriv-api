import ws        from 'ws';
import BinaryAPI from '../BinaryAPI'

let api;

beforeAll(() => {
    const connection = new ws('wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN');
    api = new BinaryAPI({ connection });
});

test('Constructing BinaryAPI', async() => {
    expect(api).toBeInstanceOf(BinaryAPI);

    const response = await api.ping();
    expect(response.ping).toEqual('pong');

    api.disconnect();
});
