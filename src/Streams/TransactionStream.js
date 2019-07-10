import Stream from '../Types/Stream';
import Transaction from '../Immutables/Transaction'; /* eslint-disable-line no-unused-vars */

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
 *
 * @property {Transaction[]} list - An immutable list of transactions
 */
export default class TransactionStream extends Stream {
    // Called by the API to initialize the instance
    async init() {
        return this;
    }
}
