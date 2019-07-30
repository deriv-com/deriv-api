import Immutable from '../types/Immutable';

/**
 * Keeps money related values
 *
 * @param {String} currency
 * @param {Number} value
 *
 * @property {Number} value
 * @property {String} currency
 * @property {String} display  - decimal value based on currency
 * @property {String} format   - comma separated decimal value based on currency
 */
export default class Monetary extends Immutable {
    constructor(value, currency) {
        super();
        this._data.value    = +value;
        this._data.currency = currency;
    }

    get display() {
        return this._data.value.toFixed(2);
    }

    get format() {
        return this._data.display();
    }
}
