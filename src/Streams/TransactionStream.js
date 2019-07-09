import Stream from '../Types/Stream';
import Transaction from '../Types/Transaction'; /* eslint-disable-line no-unused-vars */

/**
 * A stream of transactions
 *
 * @example
 * const txStream = accounts.transactionStream;
 *
 * const txList = txStream.list;
 *
 * txStream.onUpdate(console.log)
 *
 * @param {DerivAPI} api
 */
export default class TransactionStream extends Stream {
    // Called by the API to initialize the instance
    async init() {
        return Promise.resolve(undefined);
    }

    /** @returns {Transaction[]} */
    get list() {
        return this._data.list;
    }
}
