import { first }         from 'rxjs/operators';

import DerivAPI          from '../../DerivAPI';
import Tick              from '../../immutables/Tick';
import { TestWebSocket } from '../../test_utils';
import Ticks             from '../Ticks';

let connection;
let ticks;
const count    = 2;
const response = {};

test('Request for a ticks history', async () => {
    expect(ticks).toBeInstanceOf(Ticks);

    expect(() => { ticks.list = []; }).toThrow(Error);

    expect(ticks.list).toBeInstanceOf(Array);
    expect(ticks.list).toHaveLength(count);
    expect(ticks.list.slice(-1)[0]).toBeInstanceOf(Tick);
    response.ticks_history.times.push(1564977004);
    response.ticks_history.prices.push(1587.39);
    const old_ticks = await ticks.history({ count: 3, end: new Date() });

    expect(old_ticks).toBeInstanceOf(Array);
    expect(old_ticks).toHaveLength(3);
    expect(old_ticks.slice(-1)[0]).toBeInstanceOf(Tick);
});

test('list stays up to date with the last tick', async () => {
    const last_tick = ticks.list.slice(-1)[0];

    connection.receiveLater('tick', {
        ask: 1587.35, bid: 1586.95, epoch: 1564977006, id: '5fcb61fe-af4e-d2ba-d8df-64f9f2dd8868', quote: 1587.15, symbol: 'R_100',
    });

    const recent_tick = await ticks.onUpdate().pipe(first()).toPromise();

    // Tick was pushed to the end of the list
    expect(ticks.list.slice(-2)[0]).toEqual(last_tick);
    expect(ticks.list.slice(-1)[0]).toEqual(recent_tick);

    expect(ticks.list).toHaveLength(count);
});

test('Check individual ticks', async () => {
    const [first_tick] = ticks.list;

    expect(first_tick.quote.pip_size).toEqual(2);
    expect(first_tick.quote.pip_sized).toEqual(first_tick.quote.value.toFixed(2));
    expect(first_tick.time.isSameOrBefore(new Date())).toBeTruthy();
});

beforeAll(async () => {
    response.ticks_history = { prices: [1586.99, 1587.55], times: [1564977000, 1564977002] };
    connection             = new TestWebSocket({
        active_symbols: [{ symbol: 'R_100', pip: 0.01 }],
        ...response,
    });

    const api = new DerivAPI({ connection });

    ticks = new Ticks(api, 'R_100');

    await ticks.init();
});
