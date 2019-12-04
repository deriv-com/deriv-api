import {
    finalize, share,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

import Immutable   from './Immutable';

/**
 * An abstract class for stream objects
 */
export default class Stream extends Immutable {
    constructor(args) {
        const before_update = new Subject().pipe(
            finalize(() => this.finalize('before')),
            share(),
        );

        const on_update = new Subject().pipe(
            finalize(() => this.finalize('on')),
            share(),
        );

        super({
            on_update,
            before_update,
            subscribers: [],
            unfinalized: {},
            ...args,
        });
    }

    finalize(type) {
        --this.unfinalized[type];
        if (!this.unfinalized.on && !this.unfinalized.before) {
            this.subscribers.forEach(s => s.unsubscribe());
        }
    }

    /**
     * Listen on updates of a stream
     *
     * @example
     * const tick_stream = api.tickStream('R_100');
     *
     * tick_stream.onUpdate(console.log);
     *
     * tick_stream.onUpdate().subscribe(console.log);
     *
     * @param {Function} callback
     * @param {Function} on_error
     *
     * @returns {Observable}
     */
    onUpdate(callback, on_error) {
        this.unfinalized.on = 1;
        if (callback) {
            return this.on_update.subscribe(callback, on_error || (() => {}));
        }
        return this.on_update;
    }

    beforeUpdate(callback, on_error) {
        this.unfinalized.before = 1;
        if (callback) {
            return this.before_update.subscribe(callback, on_error || (() => {}));
        }
        return this.before_update;
    }

    next(value) {
        this.before_update.next(value);
        this.on_update.next(value);
    }

    error(error) {
        this.before_update.error(error);
        this.on_update.error(error);
    }

    addSource(source) {
        this.subscribers.push(source.subscribe(v => this.next(v), e => this.error(e)));
    }
}
