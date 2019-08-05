import Monetary  from './Monetary';

/**
 * Keeps money related values
 *
 * @param {String} currency
 * @param {Number} value
 * @param {Number} percentage
 *
 * @property {Number}  value      - Absolute value of the profit
 * @property {Number}  percentage
 * @property {Number}  sign       - 0: no profit, 1: positive profit, -1: loss
 * @property {Boolean} is_win     - True if the initial profit is positive
 * @property {String}  currency
 * @property {String}  display    - decimal value based on currency
 * @property {String}  format     - comma separated decimal value based on currency
 */
export default class Profit extends Monetary {
    constructor(value, currency, percentage) {
        super(Math.abs(value), currency);

        this._data.percentage = percentage;
        this._data.is_win     = value > 0;

        if (value === 0) {
            this._data.sign = 0;
        } else if (value > 0) {
            this._data.sign = 1;
        } else {
            this._data.sign = -1;
        }
    }
}
