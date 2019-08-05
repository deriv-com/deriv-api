import DerivAPI from '../DerivAPIBasic';

let api;

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

beforeAll(() => {
    const connection = new WebSocket(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPI({ connection });
});
