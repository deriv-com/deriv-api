import DerivAPIBasic from '../DerivAPIBasic';

let api;

test('Constructing DerivAPIBasic', async () => {
    expect(api).toBeInstanceOf(DerivAPIBasic);

    const response = await api.ping();
    expect(response.ping).toBe('pong');
});

test('API construction with endpoint and appId', () => {
    expect(
        new DerivAPIBasic({ endpoint: 'ws.binaryws.com', appId: 1 }),
    ).toBeInstanceOf(DerivAPIBasic);
});

test('API construction with endpoint', () => {
    expect(() => new DerivAPIBasic({ endpoint: 1, app_id: 1 })).toThrow();
});

beforeAll(() => {
    const connection = new WebSocket(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPIBasic({ connection });
});
