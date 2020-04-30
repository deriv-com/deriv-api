import { TestWebSocket } from '../../test_utils';

import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;
const response = {};

test('Constructing DerivAPIBasic', async () => {
    expect(api).toBeInstanceOf(DerivAPIBasic);

    expect((await api.ping()).ping).toBe('pong');
});

test('API construction with endpoint and appId', () => {
    expect(
        new DerivAPIBasic({ endpoint: 'localhost', app_id: 12345 }),
    ).toBeInstanceOf(DerivAPIBasic);
});

test('API construction with endpoint', () => {
    expect(() => new DerivAPIBasic({ endpoint: 1, app_id: 12345 })).toThrow();
});

test('API should change endpoint', () => {
    const new_api = new DerivAPIBasic({ endpoint: 'first', app_id: 12345 });
    new_api.changeSocket({ new_socket: new TestWebSocket(response, undefined, 'second') });

    expect(new_api.connection.url).toBe('second');
});

beforeAll(() => {
    response.ping = 'pong';
    connection    = new TestWebSocket(response);

    api = new DerivAPIBasic({ connection });
});
