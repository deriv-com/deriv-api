import Immutable from './Immutable';

/**
 * An abstract class for stream objects
 */
export default class Stream extends Immutable {
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
     * @returns {Observable}
     */
    onUpdate(callback, on_error) {
        if (callback) {
            this._data.on_update.subscribe(callback, on_error || (() => {}));
        }
        return this._data.on_update;
    }
}
