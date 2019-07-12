import { first }       from 'rxjs/operators';
import WebSocket       from 'ws';

import DerivAPI        from '../../DerivAPI';
import Tick            from '../../Immutables/Tick';
import TickStream      from '../TickStream';

let api;
let tick_stream;

beforeAll(async () => {
    global.WebSocket = WebSocket;

    api = new DerivAPI();

    tick_stream = await api.tickStream('R_100');
});

afterAll(() => {
    api.disconnect();
});

test('Request for a ticks history', async () => {
    expect(tick_stream).toBeInstanceOf(TickStream);

    expect(() => { tick_stream.list = []; }).toThrow(Error);

    const ticks = tick_stream.list; // last 1000 1-minute ticks

    expect(ticks).toBeInstanceOf(Array);
    expect(ticks).toHaveLength(1000);
    expect(ticks.slice(-1)[0]).toBeInstanceOf(Tick);

    const old_ticks = await tick_stream.history({ count: 100, end: new Date() });

    expect(old_ticks).toBeInstanceOf(Array);
    expect(old_ticks).toHaveLength(100);
    expect(old_ticks.slice(-1)[0]).toBeInstanceOf(Tick);
});

test('list stays up to date with the last tick', async () => {
    const recent_tick = await tick_stream.onUpdate().pipe(first()).toPromise();

    expect(tick_stream.list.slice(-1)[0]).toEqual(recent_tick);

    expect(tick_stream.list).toHaveLength(1000);
});

test('Check individual ticks', async () => {
    const [first_tick] = tick_stream.list;

    expect(first_tick.quote.pip_size).toEqual(2);
    expect(first_tick.quote.pip_sized).toEqual(first_tick.quote.value.toFixed(2));
    expect(first_tick.time.isSameOrBefore(new Date())).toBeTruthy();
});
