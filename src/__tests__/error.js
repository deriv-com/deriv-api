import ws        from 'ws';
import DerivAPI  from '../DerivAPI'
import { first } from 'rxjs/operators'

let api;

beforeAll(() => {
    const connection = new ws('wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN');
    api = new DerivAPI({ connection });
});

afterAll(() => {
    api.disconnect();
})

test('Request ticks for InvalidSymbol', async () => {
    await expect(api.ticks({ticks: 'InvalidSymbol'})).rejects.toBeInstanceOf(Error)
})

test('Subscribe to ticks with callback', async () => {
    await expect(api.subscribeWithCallback({ticks: 'InvalidSymbolCallback'}, () => {})).rejects.toBeInstanceOf(Error)
})

test('Subscribe to ticks with Observables 1', async () => {
    const obj = {ticks: 'InvalidSymbolObservable1'};
    await expect(api.subscribe(obj).pipe(first()).toPromise()).rejects.toBeInstanceOf(Error);
})
