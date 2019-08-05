import Monetary   from '../fields/Monetary';
import Immutable  from '../types/Immutable';

/**
 * @typedef {Object} SellParam
 * @property {Number} [max_price=0] - Maximum acceptable price for selling the contract
 */

/**
 * Wrapper around a Sell response
 *
 * @param sell
 * @param {Monetary} sell.sold_for       - sell price
 * @param {Monetary} sell.balance_after
 * @param {Number}   sell.contract_id
 * @param {Number}   sell.transaction_id - sell transaction
 * @param {Number}   sell.reference_id   - buy transaction
 * @param {String}   currency
 *
 * @property {Monetary} price
 * @property {Monetary} balance_after
 * @property {Number}   contract_id
 * @property {Number}   transaction_id
 * @property {Number}   buy_transaction
 */
export default class Sell extends Immutable {
    constructor(sell, currency, lang) {
        const instance = { raw: sell };

        instance.price         = new Monetary(sell.sold_for, currency, lang);
        instance.balance_after = new Monetary(sell.balance_after, currency, lang);

        instance.contract_id     = sell.contract_id;
        instance.transaction_id  = sell.transaction_id;
        instance.buy_transaction = sell.reference_id;

        super(instance);
    }
}
