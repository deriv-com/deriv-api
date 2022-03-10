import { first }         from 'rxjs/operators';

import DerivAPI          from '../../DerivAPI';
import Candle            from '../../immutables/Candle';
import { TestWebSocket } from '../../test_utils';
import Candles           from '../Candles';

let candle_stream;
let connection;
const count    = 2;
const response = {};

test('Request for a candles history', async () => {
    expect(candle_stream).toBeInstanceOf(Candles);

    expect(() => { candle_stream.list = []; }).toThrow(Error);

    const candles = candle_stream.list; // last 1000 1-minute candles

    expect(candles).toBeInstanceOf(Array);
    expect(candles).toHaveLength(count);
    expect(candles.slice(-1)[0]).toBeInstanceOf(Candle);
    response.ticks_history.push({
        close: 1595.05, epoch: 1564977240, high: 1595.28, low: 1591.06, open: 1591.56,
    });

    const old_candles = await candle_stream.history({ count: 3, end: new Date() });

    expect(old_candles).toBeInstanceOf(Array);
    expect(old_candles).toHaveLength(3);
    expect(old_candles.slice(-1)[0]).toBeInstanceOf(Candle);
});

test('list stays up to date with the last candle', async () => {
    const last_candle = candle_stream.list.slice(-1)[0];

    connection.receiveLater('ohlc', {
        close: '1595.00', epoch: 1564977284, granularity: 60, high: '1595.28', id: '28ab4e47-bc20-ee92-572f-1d8dd07fa283', low: '1591.06', open: '1591.56', open_time: 1564977240, symbol: 'R_100',
    });
    const recent_candle = await candle_stream.onUpdate().pipe(first()).toPromise();

    // Candle was pushed to the end of the list
    expect(candle_stream.list.slice(-2)[0]).toEqual(last_candle);
    expect(candle_stream.list.slice(-1)[0]).toEqual(recent_candle);

    expect(candle_stream.list).toHaveLength(count);
});

test('Check individual candles', async () => {
    const [first_candle] = candle_stream.list;

    expect(first_candle.open.pip_size).toEqual(2);
    expect(first_candle.close.pip_sized).toEqual(first_candle.close.value.toFixed(2));
    expect(first_candle.time.isSameOrBefore(new Date())).toBeTruthy();
    expect(first_candle.open_time.isSameOrBefore(new Date())).toBeTruthy();
});

beforeAll(async () => {
    response.ticks_history = [{
        close: 1590.87, epoch: 1564977120, high: 1592.93, low: 1589.75, open: 1589.75,
    }, {
        close: 1591.28, epoch: 1564977180, high: 1591.36, low: 1589.72, open: 1590.52,
    }];

    connection = new TestWebSocket({
        active_symbols: [{ symbol: 'R_100', pip: 0.01 }],
        forget        : 1,
        ...response,
    });

    const api = new DerivAPI({ connection });

    candle_stream = new Candles(api, 'R_100');

    await candle_stream.init();
});
