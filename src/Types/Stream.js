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
     * @returns {Observable}
     */
    onUpdate(callback) {
        if (callback) {
            this._data.on_update.subscribe(callback);
        }
        return this._data.on_update;
    }
}
