import Transaction from '../Immutables/Transaction'; /* eslint-disable-line no-unused-vars */
import Stream      from '../Types/Stream';

/**
 * A stream of transactions
 *
 * @example
 * const tx_stream = accounts.transaction_stream;
 *
 * const tx_list = tx_stream.list;
 *
 * tx_stream.onUpdate(console.log)
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
