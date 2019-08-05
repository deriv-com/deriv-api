import CustomDate from '../fields/CustomDate';
import FullName   from '../fields/FullName';
import Monetary   from '../fields/Monetary';
import Immutable  from '../types/Immutable';

/**
 * @typedef {Object} BuyParam
 * @property {Number=} max_price - Maximum acceptable price for buying the contract
 */

/**
 * Wrapper around a Buy response
 *
 * @param buy
 * @param {Monetary}   buy.buy_price
 * @param {Monetary}   buy.balance_after
 * @param {Monetary}   buy.payout
 * @param {CustomDate} buy.start_time
 * @param {CustomDate} buy.purchase_time
 * @param {Number}     buy.contract_id
 * @param {Number}     buy.transaction_id
 * @param {String}     buy.longcode
 * @param {String}     buy.shortcode
 * @param {String}     currency
 *
 * @property {Monetary}   price
 * @property {Monetary}   balance_after
 * @property {Monetary}   payout
 * @property {CustomDate} start_time
 * @property {CustomDate} purchase_time
 * @property {Number}     contract_id
 * @property {Number}     transaction_id
 * @property {FullName}   code - contains short and long code
 * @property {String}     longcode
 * @property {String}     shortcode
 */
export default class Buy extends Immutable {
    constructor(buy, currency, lang) {
        const instance = { raw: buy };

        instance.price         = new Monetary(buy.buy_price, currency, lang);
        instance.balance_after = new Monetary(buy.balance_after, currency, lang);
        instance.payout        = new Monetary(buy.payout, currency, lang);

        instance.start_time    = new CustomDate(buy.start_time);
        instance.purchase_time = new CustomDate(buy.purchase_time);

        instance.code = new FullName(buy.shortcode, buy.longcode);

        instance.contract_id    = buy.contract_id;
        instance.transaction_id = buy.transaction_id;
        instance.shortcode      = buy.shortcode;
        instance.longcode       = buy.longcode;

        super(instance);
    }
}
