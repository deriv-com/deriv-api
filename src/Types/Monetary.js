import Immutable from './Immutable';

/** Keep money related values
 *
 * @param {String} Currency
 * @param {Number} Value
 */
export default class Monetary extends Immutable {
    /** @returns {String} decimal value based on currency */
    get display() {
        return this.value.toFixed(2);
    }

    /** @returns {String} comma separated decimal value based on currency */
    get format() {
        return this.value.toFixed(2);
    }
}
