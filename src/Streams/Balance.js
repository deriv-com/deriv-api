import { first, map } from 'rxjs/operators';

import Monetary       from '../Types/Monetary';
import Stream         from '../Types/Stream';

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
    async init() {
        const source = this.api.subscribe({ balance: 1 })
            .pipe(map(wrapBalance));

        this._data.amount = await source.pipe(first()).toPromise();

        this._data.on_update = source;

        this.onUpdate((amount) => {
            Object.assign(this._data, { amount, ...amount });
        });
    }
}

function wrapBalance({ balance: { balance, currency } }) {
    return new Monetary(balance, currency);
}
