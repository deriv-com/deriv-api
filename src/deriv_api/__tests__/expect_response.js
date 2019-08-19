import { TestWebSocket } from '../../test_utils';

import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let response;

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

    expect(expected_responses.map(r => r.msg_type)).toEqual(['ping', 'website_status', 'ticks']);
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
