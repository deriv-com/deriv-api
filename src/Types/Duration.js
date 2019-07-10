import Immutable from './Immutable';

/** Class to keep durations
 *
 * @param {Number} value
 * @param {String|FullName} unit
 */
export default class Duration extends Immutable {
    /**
     * @returns {Number} - length of duration in seconds
     */
    get seconds() {
        return this._data.toSeconds();
    }

    /**
     * @returns {String} - Value plus unit
     */
    get display() {
        return this._data.toDisplay();
    }
}
