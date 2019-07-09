import Immutable from './Immutable';

/** A class for name of things
 *
 * @param {String} - full
 * @param {String} - short
 */
export default class Name extends Immutable {
    /** @returns {String} - alias for this.short */
    get code() {
        return this._data.short;
    }

    /** @returns {String} - alias for this.short */
    get shortcode() {
        return this._data.short;
    }
}
