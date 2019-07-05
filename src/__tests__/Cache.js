import WS       from 'ws';
import DerivAPI from '../DerivAPI';

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

    // await inside for loop to make it slow, if replace with api.ping()
    // tests should fail
    for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        expect((await api.cache.ping()).ping).toBe('pong');
    }

    const endTime = parseInt(new Date().getTime() / 1000, 10);

    expect(startTime).toBe(endTime);
});
