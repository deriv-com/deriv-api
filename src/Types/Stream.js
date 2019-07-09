import Immutable from './Immutable';

/**
 * An abstract class for stream objects
 */
export default class Stream extends Immutable {
    /**
     * Listen on updates of a stream
     *
     * @example
     * const tickStream = api.tickStream('R_100');
     *
     * tickStream.onUpdate(console.log);
     *
     * tickStream.onUpdate().subscribe(console.log);
     *
     * @param {Function} callback
     * @returns {Observable}
     */
    onUpdate(callback) {
        if (callback) {
            this._data.onUpdate.subscribe(callback);
        }
        return this._data.onUpdate;
    }
}
