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

    expect(typeof website_status_stream.country).toBe('string');
    expect(typeof website_status_stream.is_website_up).toBe('boolean');
    expect(typeof website_status_stream.terms_and_condtions_version).toBe('string');

    expect(website_status_stream.currencies).toBeInstanceOf(Object);
    expect(Object.keys(website_status_stream.currencies)).toContain('USD');

    expect(website_status_stream.call_limits).toBeInstanceOf(Object);
    expect(Object.keys(website_status_stream.call_limits)).toContain('max_proposal_subscription');

    expect(website_status_stream.languages).toBeInstanceOf(Array);
    expect(website_status_stream.languages).toContain('EN');

    if (website_status_stream.is_website_up) {
        expect(website_status_stream.status).toBe('up');
    } else {
        expect(website_status_stream.status).toBe('down');
    }
});
