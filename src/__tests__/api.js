import ws        from 'ws';
import BinaryAPI from '../BinaryAPI'

test('Constructing BinaryAPI', async() => {
    const connection = new ws('wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN');
    const api = new BinaryAPI({ connection });
    expect(api).toBeInstanceOf(BinaryAPI);

    const response = await api.ping();
    expect(response.ping).toEqual('pong');
});
