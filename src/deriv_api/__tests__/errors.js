import { first }         from 'rxjs/operators';

import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;

test('Request ticks for InvalidSymbol', async () => {
    await expect(api.ticks({ ticks: 'InvalidSymbol' })).rejects;
});

test('Subscribe to ticks with Observables 1', async () => {
    const obj = { ticks: 'InvalidSymbolObservable1' };
    await expect(
        api
            .subscribe(obj)
            .pipe(first())
            .toPromise(),
    ).rejects;
});

beforeAll(() => {
    connection = new TestWebSocket({
        ticks: { error: {} },
    });

    api = new DerivAPIBasic({ connection });
});
