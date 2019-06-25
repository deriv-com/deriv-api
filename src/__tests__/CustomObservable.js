import CustomObservable from '../CustomObservable';
import { interval } from 'rxjs';

import { first, take, scan, toArray } from 'rxjs/operators';

const everySecond = new CustomObservable()

let counter = 0;
setInterval(() => everySecond.publish(++counter), 1000)

test('Pure observable', async () => {
    const source = interval(1000)
    const result = await source.pipe(take(2), toArray()).toPromise()
    expect(result).toEqual([0, 1])
})

test('observable subscription', async () => {
    const array = await everySecond.pipe(take(4), toArray()).toPromise()

    expect(array).toBeInstanceOf(Array)
})
