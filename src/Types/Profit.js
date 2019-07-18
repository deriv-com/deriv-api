import Monetary  from './Monetary';

/** Keep money related values
 *
 * @param {String} currency
 * @param {Number} value
 * @param {Number} percentage
 *
 * @property {Number} value
 * @property {Number} percentage
 * @property {String} currency
 * @property {String} display - decimal value based on currency
 * @property {String} format - comma separated decimal value based on currency
 */
export default class Profit extends Monetary {
    constructor(value, currency, percentage) {
        super(value, currency);

        this._data.percentage = percentage;
    }
}
