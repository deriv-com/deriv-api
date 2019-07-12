import '../Types/Monetary';
import Stream   from '../Types/Stream';

/**
 * An abstract class for balance information
 *
 * @example
 * const balance = accounts.balance;
 *
 * const formatted_balance = balance.format;
 *
 * balance.onUpdate().subscribe(balance => console.log)
 *
 * @param {DerivAPI} api
 *
 * @property {Monetary} amount
 * @property {Number} value - numeric balance value
 * @property {String} currency - currency of the amount
 * @property {String} display - display value of amount (decimal point)
 * @property {String} format - formatted amount (decimal point, comma separated)
 */
export default class Balance extends Stream {
    // Called by the API to initialize the instance
    async init() {
        /*
         * const balance = await this.api.balance(...);
         * this._data.balance = new Monetary(balance.balance, balance.currency)
         * this._data.on_update = this.api.subscribe({ balance: 1})
         */
        return this;
    }
}
