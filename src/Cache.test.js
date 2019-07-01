import WS       from 'ws';
import DerivAPI from './DerivAPI';

let api;

beforeAll(() => {
    const connection = new WS(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPI({ connection });
});

afterAll(() => {
    api.disconnect();
});

test('Constructing DerivAPI', async () => {
    expect((await api.ping()).ping).toBe('pong');

    const startTime = parseInt(new Date().getTime() / 1000, 10);

    const fivePings = Promise.all(Array.from(Array(5)).map(() => api.cache.ping()));
    (await fivePings).forEach(ping => expect(ping.ping).toBe('pong'));

    const endTime = parseInt(new Date().getTime() / 1000, 10);

    expect(startTime).toBe(endTime);
});
