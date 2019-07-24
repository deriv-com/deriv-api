import { first, map, share } from 'rxjs/operators';

import Monetary              from '../Fields/Monetary';
import Stream                from '../Types/Stream';

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
    constructor(api) {
        super({ api });
    }

    // Called by the API to initialize the instance
    async init(initial_balance) {
        this._data.amount = wrapBalance({ balance: initial_balance });

        const source = this.api.subscribe({ balance: 1 }).pipe(map(wrapBalance), share());

        this._data.amount = await source.pipe(first()).toPromise();

        this.addSource(source);

        this.beforeUpdate((amount) => {
            this._data.amount = amount;
        });
    }

    get value() {
        return this._data.amount.value;
    }

    get currency() {
        return this._data.amount.currency;
    }

    get display() {
        return this._data.amount.display;
    }

    get format() {
        return this._data.amount.format;
    }
}

function wrapBalance({ balance: { balance, currency } }) {
    return new Monetary(balance, currency);
}
