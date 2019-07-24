import Immutable from '../Types/Immutable';

/** Keep money related values
 *
 * @param {String} currency
 * @param {Number} value
 *
 * @property {Number} value
 * @property {String} currency
 * @property {String} display - decimal value based on currency
 * @property {String} format - comma separated decimal value based on currency
 */
export default class Monetary extends Immutable {
    constructor(value, currency) {
        super({ value: +value, currency });
    }

    get display() {
        return this.value.toFixed(2);
    }

    get format() {
        return this.display();
    }
}
