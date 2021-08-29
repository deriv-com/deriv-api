import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;
const response = {};
jest.mock('isomorphic-ws');
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

beforeAll(() => {
    response.ping = 'pong';
    connection    = new TestWebSocket(response);

    api = new DerivAPIBasic({ connection });
});
