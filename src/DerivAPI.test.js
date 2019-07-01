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
    expect(api).toBeInstanceOf(DerivAPI);

    const response = await api.ping();
    expect(response.ping).toBe('pong');
});

test('API construction with endpoint and appId', () => {
    expect(
        new DerivAPI({ endpoint: 'ws.binaryws.com', appId: 1 }),
    ).toBeInstanceOf(DerivAPI);
});

test('API construction with endpoint', () => {
    expect(() => new DerivAPI({ endpoint: 1, appId: 1 })).toThrow();
});
