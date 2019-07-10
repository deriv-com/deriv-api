import Immutable from './Immutable';

/**
 * A class for keeping short and full name of things
 *
 * @param {String} full - Full form of the name
 * @param {String} short - short form of the name
 *
 * @example
 * const lc = account.landingCompany;
 *
 * console.log(`Landing Company: ${lc.full}, Short code: ${lc.short}`);
 */
export default class FullName extends Immutable {
    /** @returns {String} - alias for this.short */
    get code() {
        return this._data.short;
    }

    /** @returns {String} - alias for this.short */
    get shortcode() {
        return this._data.short;
    }
}
