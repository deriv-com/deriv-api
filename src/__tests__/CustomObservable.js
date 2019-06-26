import CustomObservable from '../CustomObservable';
import { interval } from 'rxjs';

import { first, take, scan, toArray } from 'rxjs/operators';

test('Pure observable', async () => {
    const source = interval(1000)
    const result = await source.pipe(take(2), toArray()).toPromise()
    expect(result).toEqual([0, 1])
})

test('Custom observable (with observer.next)', async () => {
    const everySecond = new CustomObservable(observer => {
        observer.next(0)
        observer.next(1)
        observer.complete()
    });
    const array = await everySecond.pipe(take(2), toArray()).toPromise()

    expect(array).toEqual([0, 1])
})

test('Custom observable (with source.publish)', async () => {
    const everySecond = new CustomObservable();

    let counter = 0;
    setInterval(() => everySecond.publish(counter++), 1000)

    const array = await everySecond.pipe(take(2), toArray()).toPromise()

    expect(array).toEqual([0, 1])
})

test('Custom observable throwing error', async () => {
    const errorSource = new CustomObservable();

    errorSource.subscribe(undefined, e => expect(e).toBeInstanceOf(Error))

    const promise = errorSource.toPromise()

    errorSource.error(Error('Oops, err...'))

    expect(promise).rejects.toBeInstanceOf(Error)
})
