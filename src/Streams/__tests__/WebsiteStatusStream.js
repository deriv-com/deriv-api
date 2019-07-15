import WebSocket           from 'ws';

import DerivAPI            from '../../DerivAPI';
import WebsiteStatusStream from '../WebsiteStatusStream';

let api;
let website_status_stream;

beforeAll(async () => {
    global.WebSocket = WebSocket;

    api = new DerivAPI();

    website_status_stream = await api.websiteStatusStream();
});

afterAll(() => {
    api.disconnect();
});

test('Request for website status', async () => {
    expect(website_status_stream).toBeInstanceOf(WebsiteStatusStream);

    expect(() => { website_status_stream.status = 'down'; }).toThrow(Error);

    if (website_status_stream.is_website_up) {
        expect(website_status_stream.status).toBe('up');
    } else {
        expect(website_status_stream.status).toBe('down');
    }
});
