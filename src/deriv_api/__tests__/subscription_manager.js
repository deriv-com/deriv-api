import {
    first,
}                        from 'rxjs/operators';

import { TestWebSocket } from '../../test_utils';

import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;

test('Subscription is reused for the same params', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    const first_response = await source.pipe(first()).toPromise();

    const source2 = api.subscribe({ ticks: 'R_100' });

    connection.receiveLater('ticks', {});

    const second_response = await source2.pipe(first()).toPromise();

    expect(second_response.subscription.id).toBe(first_response.subscription.id);

    const forget = await api.forget(second_response.subscription.id);

    expect(forget.forget).toBeTruthy();
});

test('Subscription is not reused for different params', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    const first_response = await source.pipe(first()).toPromise();

    const source2 = api.subscribe({ ticks: 'R_25' });

    const second_response = await source2.pipe(first()).toPromise();

    expect(second_response.subscription.id).not.toBe(first_response.subscription.id);

    await Promise.all([
        api.forget(second_response.subscription.id),
        api.forget(first_response.subscription.id)]);
});

test('Subscribe then forget then subscribe again', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    const first_response = await source.pipe(first()).toPromise();

    await api.forget(first_response.subscription.id);

    const source2 = api.subscribe({ ticks: 'R_100' });

    const second_response = await source2.pipe(first()).toPromise();

    expect(second_response.subscription.id).not.toBe(first_response.subscription.id);
});

beforeAll(() => {
    connection = new TestWebSocket({
        ticks : {},
        forget: 1,
    });

    api = new DerivAPIBasic({ connection });
});
