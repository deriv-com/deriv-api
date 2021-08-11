import { TestWebSocket } from '../../test_utils';
import DerivAPI          from '../DerivAPIBasic';

let api;
let connection;

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
    connection = new TestWebSocket({
        ping: 'pong',
    }, 100);

    api = new DerivAPI({ connection });
});
