import { Observable } from 'rxjs';
import {
    take,
    toArray,
}                     from 'rxjs/operators';
import DerivAPI       from '../DerivAPI';

// test defaults
const symbol      = 'R_100';
const historyArgs = {
    start: 1,
    end  : 'latest',
    count: 5,
};

let api;
let underlying;

beforeAll(async () => {
    api        = new DerivAPI();
    underlying = await api.underlying(symbol);
});

afterAll(() => {
    api.disconnect();
});

test('Underlying instance has correct information', async () => {
    expect(underlying.symbol).toBe(symbol);
    expect(underlying.market).toBe('volidx');
    expect(underlying.submarket).toBe('random_index');
});

test('Subscribe to ticks', async () => {
    const source = underlying.ticksSubscribe();

    const mockFn = jest.fn();
    source.subscribe(mockFn);

    expect(mockFn.mock.calls.length).toBe(0);

    const twoResponses = await source.pipe(take(2), toArray()).toPromise();

    expect(mockFn.mock.calls.length).toBe(2);

    expect(twoResponses).toBeInstanceOf(Array);

    expect(twoResponses[0].tick.symbol).toBe(symbol);
});

test('Call ticksHistory', async () => {
    const ticksHistory = await underlying.ticksHistory(historyArgs);
    expect(ticksHistory.history.prices.length).toBe(historyArgs.count);
});

test('Call ticksHistory with subscribe = 1', () => {
    expect(() => {
        underlying.ticksHistory({
            ...historyArgs,
            subscribe: 1,
        });
    }).toThrow();
});

test('Call ticksHistorySubscribe', async () => {
    const source = await underlying.ticksHistorySubscribe({
        ...historyArgs,
        subscribe: 1,
    });

    expect(source).toBeInstanceOf(Observable);

    const mockFn = jest.fn();
    source.subscribe(mockFn);

    expect(mockFn.mock.calls.length).toBe(0);

    const firstResponse = await source.pipe(take(1)).toPromise();

    expect(mockFn.mock.calls.length).toBe(1);
    expect(firstResponse.history.prices.length).toBe(historyArgs.count);

    await source.pipe(take(1)).toPromise();

    expect(mockFn).toHaveBeenCalledTimes(2);

    const { tick } = mockFn.mock.calls[1][0];
    expect(tick.symbol).toBe(symbol);
    expect(tick.id.length).toBeGreaterThan(0);
});

test('Call tradingTimes', async () => {
    const tradingTimes = await underlying.tradingTimes();
    expect(tradingTimes.symbol).toBe(symbol);
    expect(tradingTimes.times).toBeInstanceOf(Object);
});

test('Call assetIndex', async () => {
    const assetIndex = await underlying.assetIndex();
    expect(assetIndex).toBeInstanceOf(Array);
});

test('Call contractsFor', async () => {
    const contractsFor = await underlying.contractsFor();
    expect(contractsFor.contracts_for.available).toBeInstanceOf(Array);
});
