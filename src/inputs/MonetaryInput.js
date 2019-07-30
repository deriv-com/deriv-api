import Monetary from '../fields/Monetary';

/**
 * Changeable money related value
 *
 * @property {Number} min
 * @property {Number} max
 * @property {Number} value
 * @property {Number} currency
 */
export default class MonetaryInput extends Monetary {
    set value(value) {
        this._data.value = +value;
    }
}
