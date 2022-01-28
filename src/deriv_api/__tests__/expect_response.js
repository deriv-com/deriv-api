import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';
import InMemory          from '../InMemory';

let api;
let response;
let storage;

test('Fetch the response of a single type', async () => {
    api.ping();

    const expected_response = await api.expectResponse('ping');

    expect(expected_response.ping).toEqual(response.ping);
});

test('Fetch multiple responses', async () => {
    api.ticks('R_100');
    api.websiteStatus();
    api.ping();

    const expected_responses = await api.expectResponse('ping', 'website_status', 'ticks');

    expect(expected_responses).toBeInstanceOf(Array);

    expect(expected_responses.map((r) => r.msg_type)).toEqual(['ping', 'website_status', 'ticks']);
});

test('Fetch existing response from the storage', async () => {
    // Storage is updated with a new response
    api.storage.storage.store.by_msg_type.active_symbols = {
        active_symbols: { new: 1 },
        msg_type      : 'active_symbols',
        req_id        : 3,
    };

    expect((await api.expectResponse('active_symbols')).active_symbols).toEqual({ new: 1 });
});

beforeAll(() => {
    response         = {
        ping          : 'pong',
        website_status: {},
        ticks         : {
            symbol: 'R_100',
        },
    };
    const connection = new TestWebSocket(response);

    storage = new InMemory();

    api = new DerivAPIBasic({ connection, storage });
});
