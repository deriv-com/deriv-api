import DerivAPI          from '../../DerivAPI';
import { TestWebSocket } from '../../test_utils';
import WebsiteStatus     from '../WebsiteStatus';

let website_status;

test('Request for website status', async () => {
    expect(website_status).toBeInstanceOf(WebsiteStatus);

    expect(() => { website_status.status = 'down'; }).toThrow(Error);

    expect(typeof website_status.country).toBe('string');
    expect(typeof website_status.is_website_up).toBe('boolean');
    expect(typeof website_status.terms_and_condtions_version).toBe('string');

    expect(website_status.currencies).toBeInstanceOf(Object);
    expect(Object.keys(website_status.currencies)).toContain('USB');

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

beforeAll(async () => {
    const connection = new TestWebSocket({
        website_status: {
            clients_country  : 'us',
            currencies_config: {
                USB: {
                    fractional_digits        : 2,
                    is_suspended             : 1,
                    name                     : 'Binary Coin',
                    stake_default            : 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 1,
                            EUR: 1,
                            GBP: 1,
                            USD: 1,
                        },
                        limits: {
                            max: 2500,
                            min: 1,
                        },
                    },
                    type: 'crypto',
                },
            },
            api_call_limits: {
                max_proposal_subscription: {
                    applies_to: 'subscribing to proposal concurrently',
                    max       : 5,
                },
            },
            supported_languages     : ['EN'],
            site_status             : 'up',
            terms_conditions_version: 'v1',
        },
    });
    const api        = new DerivAPI({ connection });
    website_status   = new WebsiteStatus(api);

    await website_status.init();
});
