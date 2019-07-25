import DerivAPIBasic from '../../deriv_api/DerivAPIBasic';
import Underlying    from '../Underlying';

const symbol = 'R_100';

const active_symbols_response = [
    {
        allow_forward_starting: 1,
        display_name          : 'Volatility 100 Index',
        exchange_is_open      : 1,
        is_trading_suspended  : 0,
        market                : 'volidx',
        market_display_name   : 'Volatility Indices',
        pip                   : 0.01,
        submarket             : 'random_index',
        submarket_display_name: 'Continuous Indices',
        symbol                : 'R_100',
        symbol_type           : 'stockinde',
    },
];

const req_ids = {};

let api;
let underlying;

global.WebSocket = jest.fn();

beforeAll(async () => {
    api = new DerivAPIBasic();

    api.connection.readyState = 1;
    api.connection.onopen();

    underlying = new Underlying(api, symbol);

    // Make a call to onmessage immediately after send is called
    api.connection.send = jest.fn((msg) => {
        const request    = JSON.parse(msg);
        const { req_id } = request;

        const initial_responses = {
            active_symbols: active_symbols_response,
        };

        Object.keys(initial_responses).forEach((method) => {
            if (method in request) {
                req_ids[method] = req_id;
                sendMessage(method, initial_responses[method]);
            }
        });
    });

    await underlying.init();
});

test('Account instance', async () => {
    expect(underlying).toBeInstanceOf(Underlying);

    expect(() => { underlying.name = 'R_100'; }).toThrow(Error);

    expect(underlying.name.short).toBe(active_symbols_response[0].symbol);
    expect(underlying.name.full).toBe(active_symbols_response[0].display_name);
    expect(underlying.is_open).toBe(active_symbols_response[0].exchange_is_open);
    expect(underlying.is_trading_suspended).toBe(active_symbols_response[0].is_trading_suspended);
    expect(underlying.pip).toBe(active_symbols_response[0].pip);
    expect(underlying.pip_size).toBe(2);
    expect(underlying.toPipSized(12.3)).toBe('12.30');
});

function sendMessage(type, obj) {
    api.connection.onmessage({
        data: JSON.stringify({
            req_id  : req_ids[type],
            msg_type: type,
            [type]  : obj,
        }),
    });
}
