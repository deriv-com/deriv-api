import WS            from 'ws';

import DerivAPIBasic from '../DerivAPIBasic';

let api;

beforeAll(() => {
    const connection = new WS(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPIBasic({ connection });
});

afterAll(() => {
    api.disconnect();
});

test('Constructing DerivAPIBasic', async () => {
    expect((await api.ping()).ping).toBe('pong');

    const start_time = parseInt(new Date().getTime() / 1000, 10);

    // await inside for loop to make it slow, if replace with api.ping()
    // tests should fail
    for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        expect((await api.cache.ping()).ping).toBe('pong');
    }

    const end_time = parseInt(new Date().getTime() / 1000, 10);

    expect(start_time).toBe(end_time);
});
