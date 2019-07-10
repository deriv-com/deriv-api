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
    const tickStream = await api.tickStream('R_100');

    expect(tickStream).toBeInstanceOf(TickStream);

    expect(() => { tickStream.list = []; }).toThrow(Error);

    const ticks = tickStream.list; // last 1000 1-minute ticks

    expect(ticks).toBeInstanceOf(Array);
    expect(ticks).toHaveLength(1000);
    expect(ticks.slice(-1)[0]).toBeInstanceOf(Tick);

    const oldTicks = await tickStream.history({ count: 100, end: new Date() });

    expect(oldTicks).toBeInstanceOf(Array);
    expect(oldTicks).toHaveLength(100);
    expect(oldTicks.slice(-1)[0]).toBeInstanceOf(Tick);
});
