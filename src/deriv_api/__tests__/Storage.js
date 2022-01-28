import { TestWebSocket } from '../../test_utils';
import DerivAPI          from '../DerivAPIBasic';
import InMemory          from '../InMemory';

let api;
let connection;
let storage;

test('Constructing DerivAPIBasic', async () => {
    expect(Object.keys(storage.store).length).toBe(1);

    expect((await api.ping()).ping).toBe('pong');

    // Now both cache and storage have the value
    expect(storage.has('{"ping":1}')).toBeTruthy();
    expect(api.cache.storage.has('{"ping":1}')).toBeTruthy();

    const start_time = parseInt(new Date().getTime() / 1000, 10);

    // await inside for loop to make it slow, if replace with api.ping()
    // tests should fail
    for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        expect((await api.storage.ping()).ping).toBe('pong');
    }

    const end_time = parseInt(new Date().getTime() / 1000, 10);

    expect(start_time).toBe(end_time);
});

test('Fetching from storage updates the cache', async () => {
    // Avoid API call, because it updates cache
    api.storage.storage.store['{"active_symbols":"brief"}'] = {
        active_symbols: {},
        msg_type      : 'active_symbols',
        req_id        : 2,
    };

    expect((await api.cache.activeSymbols('brief')).active_symbols).toEqual({});

    // Storage is updated with a new response
    api.storage.storage.store['{"active_symbols":"brief"}'] = {
        active_symbols: { new: 1 },
        msg_type      : 'active_symbols',
        req_id        : 3,
    };

    // Cache still uses the previous version, not the new response
    expect((await api.cache.activeSymbols('brief')).active_symbols).not.toEqual({ new: 1 });
});

beforeAll(() => {
    connection = new TestWebSocket({
        ping: 'pong',
    }, 100);

    storage = new InMemory();

    api = new DerivAPI({ connection, storage  });
});
