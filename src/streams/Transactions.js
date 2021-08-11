import {
    map, skip, share,
}                       from 'rxjs/operators';

import Transaction      from '../immutables/Transaction';
import Stream           from '../types/Stream';
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
        this._data.active_symbols = (await this.api.basic.cache.activeSymbols('brief')).active_symbols;
        const transactions        = this.api.basic.subscribe({ transaction: 1 });

        this.addSource(transactions.pipe(
            skip(1),
            map((t) => wrapTransaction(t, this._data.active_symbols, this.api.basic.lang)),
            share(),
        ));

        this.beforeUpdate((transaction) => {
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

function wrapTransaction({ transaction }, active_symbols, lang) {
    const { pip } = active_symbols.find((s) => s.symbol === transaction.symbol);

    return new Transaction(mapApiFields(transaction, field_mapping), pip, lang);
}
