import { Subject } from 'rxjs';

import Immutable   from './Immutable';

/**
 * An abstract class for stream objects
 */
export default class Stream extends Immutable {
    constructor(args) {
        super({
            on_update    : new Subject(),
            before_update: new Subject(),
            ...args,
        });
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
        if (callback) {
            this.on_update.subscribe(callback, on_error || (() => {}));
        }
        return this.on_update;
    }

    beforeUpdate(callback, on_error) {
        if (callback) {
            this.before_update.subscribe(callback, on_error || (() => {}));
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
        source.subscribe((v) => this.next(v), this.error.bind(this));
    }
}
