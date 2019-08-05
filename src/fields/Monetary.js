import Immutable        from '../types/Immutable';
import { displayMoney } from '../utils';

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
    constructor(value, currency, lang) {
        super();
        this._data.value    = +value;
        this._data.currency = currency;
        this._data.lang     = lang;
    }

    get display() {
        return displayMoney(this._data.value, this._data.currency, this._data.lang);
    }

    get format() {
        return this._data.display;
    }
}
