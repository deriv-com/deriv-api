import {
    map, skip, share,
}                       from 'rxjs/operators';

import Transaction      from '../Immutables/Transaction';
import Stream           from '../Types/Stream';

import { mapApiFields } from '../utils';

const max_tx_size = 5000;

const field_mapping = {
    expiry_time: 'date_expiry',
};


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
export default class Transactions extends Stream {
    constructor(api) {
        super({ api });
    }

    // Called by the API to initialize the instance
    async init() {
        this._data.active_symbols = (await this.api.cache.activeSymbols('brief')).active_symbols;
        const transactions        = this.api.subscribe({ transaction: 1 });

        this._data.on_update = transactions.pipe(
            skip(1),
            map(t => wrapTransaction(t, this._data.active_symbols)),
            share(),
        );

        this.onUpdate((transaction) => {
            if (this._data.list.length < max_tx_size) {
                this._data.list.push(transaction);
            } else {
                this._data.list = [...this._data.list.slice(1), transaction];
            }
        });

        // Initial list of transactions is always empty
        this._data.list = [];
    }
}

function wrapTransaction({ transaction }, active_symbols) {
    const { pip } = active_symbols.find(s => s.symbol === transaction.symbol);

    return new Transaction(mapApiFields(transaction, field_mapping), pip);
}
