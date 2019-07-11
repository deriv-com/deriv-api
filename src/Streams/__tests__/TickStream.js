import WebSocket    from 'ws';
import TickStream from '../TickStream';
import DerivAPI     from '../../DerivAPI';
import Tick       from '../../Immutables/Tick';

let api;

beforeAll(() => {
    global.WebSocket = WebSocket;

    api = new DerivAPI();
});

afterAll(() => {
    api.disconnect();
});

test('Request for a ticks history', async () => {
    const tick_stream = await api.tickStream('R_100');

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
