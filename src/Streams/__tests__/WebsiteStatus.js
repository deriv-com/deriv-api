import DerivAPIBasic from '../../DerivAPI/DerivAPIBasic';
import WebsiteStatus from '../WebsiteStatus';

let api;
let website_status;

beforeAll(async () => {
    api = new DerivAPIBasic();

    website_status = new WebsiteStatus(api);

    await website_status.init();
});

afterAll(() => {
    api.disconnect();
});

test('Request for website status', async () => {
    expect(website_status).toBeInstanceOf(WebsiteStatus);

    expect(() => { website_status.status = 'down'; }).toThrow(Error);

    expect(typeof website_status.country).toBe('string');
    expect(typeof website_status.is_website_up).toBe('boolean');
    expect(typeof website_status.terms_and_condtions_version).toBe('string');

    expect(website_status.currencies).toBeInstanceOf(Object);
    expect(Object.keys(website_status.currencies)).toContain('USD');

    expect(website_status.call_limits).toBeInstanceOf(Object);
    expect(Object.keys(website_status.call_limits)).toContain('max_proposal_subscription');

    expect(website_status.languages).toBeInstanceOf(Array);
    expect(website_status.languages).toContain('EN');

    if (website_status.is_website_up) {
        expect(website_status.status).toBe('up');
    } else {
        expect(website_status.status).toBe('down');
    }
});
