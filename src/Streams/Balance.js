import Stream from '../Types/Stream';
import Monetary from '../Types/Monetary'; /* eslint-disable-line no-unused-vars */

/**
 * An abstract class for balance information
 *
 * @example
 * const balance = accounts.balance;
 *
 * const formattedBalance = balance.format;
 *
 * balance.onUpdate().subscribe(balance => console.log)
 *
 * @param {DerivAPI} api
 */
export default class Balance extends Stream {
    // Called by the API to initialize the instance
    async init() {
        /*
         * const balance = await this.api.balance(...);
         * this._data.balance = new Monetary(balance.balance, balance.currency)
         * this._data.onUpdate = this.api.subscribe({ balance: 1})
         */
        return Promise.resolve(undefined);
    }

    /** @returns {Monetary} */
    get amount() {
        return this._data.amount;
    }

    /** @returns {Number} numeric balance value */
    get value() {
        return this._data.amount.value;
    }

    /** @returns {String} currency of the _data.amount. */
    get currency() {
        return this._data.amount.currency;
    }

    /** @returns {String} display value of _data.amount.(decimal point) */
    get display() {
        return this._data.amount.display();
    }

    /** @returns {String} formatted _data.amount.(decimal point, comma separated) */
    get format() {
        return this._data.amount.format();
    }
}
