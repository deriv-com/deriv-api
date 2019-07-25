import DerivAPI          from '../../DerivAPI';
import { TestWebSocket } from '../../test_utils';
import Underlying        from '../Underlying';

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

let api;
let connection;
let underlying;

beforeAll(async () => {
    connection = new TestWebSocket({
        active_symbols: active_symbols_response,
    });

    api = new DerivAPI({ connection });

    underlying = new Underlying(api, symbol);

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
