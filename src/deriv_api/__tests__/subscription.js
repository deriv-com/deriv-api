import {
    take,
    toArray,
    first,
}                        from 'rxjs/operators';
import { Observable }    from 'rxjs';

import { TestWebSocket } from '../../test_utils';
import DerivAPIBasic     from '../DerivAPIBasic';

let api;
let connection;

test('Subscribe by calling api.subscribeWithCallback and callback', async () => {
    const mock_fn = jest.fn();

    const source = api.subscribe(
        { website_status: 1 },
    );
    source.subscribe(mock_fn);

    const response = await source.pipe(first()).toPromise();

    expect(response.msg_type).toBe('website_status');

    expect(mock_fn).toHaveBeenCalledTimes(1);
});

test('Subscribe with api.subscribe should return an Observable', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    expect(source).toBeInstanceOf(Observable);

    const mock_fn = jest.fn();
    source.subscribe(mock_fn);

    expect(mock_fn).toHaveBeenCalledTimes(0);

    connection.receiveLater('tick', {
        ask: 1600.29, bid: 1599.89, epoch: 1564978428, id: 'b7ba02da-353e-2189-d6f3-3d8907ad7109', quote: 1600.09, symbol: 'R_100',
    });

    const two_responses = await source
        .pipe(
            take(2),
            toArray(),
        )
        .toPromise();

    expect(mock_fn).toHaveBeenCalledTimes(2);

    expect(two_responses).toBeInstanceOf(Array);
});

beforeAll(() => {
    connection = new TestWebSocket({
        ping          : 'pong',
        website_status: {},
        ticks         : {
            ask   : 1600.29,
            bid   : 1599.89,
            epoch : 1564978428,
            quote : 1600.09,
            symbol: 'R_100',
        },
        forget: 1,
    });

    api = new DerivAPIBasic({ connection });
});
