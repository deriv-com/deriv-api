import Immutable from '../types/Immutable';

/**
 * A class for keeping short and full name of things
 *
 * @param {String} short - short form of the name
 * @param {String} full  - Full form of the name
 *
 * @example
 * const lc = account.landing_company;
 *
 * console.log(`Landing Company: ${lc.full}, Short code: ${lc.short}`);
 *
 * @property {String} full
 * @property {String} long      - alias for `full`
 * @property {String} short
 * @property {String} code      - alias for `short`
 * @property {String} shortcode - alias for `short`
 */
export default class FullName extends Immutable {
    constructor(short_name, full) {
        super({ short: short_name, full });
    }

    get code() {
        return this.short;
    }

    get shortcode() {
        return this.short;
    }

    get long() {
        return this.full;
    }
}
