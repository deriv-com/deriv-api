import { TestWebSocket } from '../../test_utils';

import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let response;

test('Fetch the response of a single type', async () => {
    api.ping();

    const fetch = await api.fetch('ping');

    expect(fetch.ping).toEqual(response.ping);
});

test('Fetch multiple responses', async () => {
    api.ticks('R_100');
    api.websiteStatus();
    api.ping();

    const fetch = await api.fetch('ping', 'website_status', 'ticks');

    expect(fetch).toBeInstanceOf(Array);

    expect(fetch.map(r => r.msg_type)).toEqual(['ping', 'website_status', 'ticks']);
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

    api = new DerivAPIBasic({ connection });
});
