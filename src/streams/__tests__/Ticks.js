import { first } from 'rxjs/operators';

import DerivAPI  from '../../DerivAPI';
import Tick      from '../../immutables/Tick';
import Ticks     from '../Ticks';

let api;
let ticks;
const count = 1000;

beforeAll(async () => {
    api = new DerivAPI();

    ticks = new Ticks(api, 'R_100');

    await ticks.init();
});

test('Request for a ticks history', async () => {
    expect(ticks).toBeInstanceOf(Ticks);

    expect(() => { ticks.list = []; }).toThrow(Error);

    expect(ticks.list).toBeInstanceOf(Array);
    expect(ticks.list).toHaveLength(count);
    expect(ticks.list.slice(-1)[0]).toBeInstanceOf(Tick);

    const old_ticks = await ticks.history({ count: 100, end: new Date() });

    expect(old_ticks).toBeInstanceOf(Array);
    expect(old_ticks).toHaveLength(100);
    expect(old_ticks.slice(-1)[0]).toBeInstanceOf(Tick);
});

test('list stays up to date with the last tick', async () => {
    const last_tick = ticks.list.slice(-1)[0];

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
