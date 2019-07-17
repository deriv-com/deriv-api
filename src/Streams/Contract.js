import '../Immutables/Buy';
import '../Immutables/Sell';
import '../Types/Duration';
import '../Types/Monetary';
import Stream   from '../Types/Stream';

/**
 * @typedef {Object} ContractParam
 * @property {String} contract_type
 * @property {Number} amount
 * @property {String} barrier
 * @property {String} barrier2
 * @property {Number|Date} date_expiry - epoch in seconds or {@link Date}
 * @property {Number|Date} date_start - epoch in seconds or {@link Date}
 * @property {String=} Currency - Default is the account currency
 * @property {String} basis - stake or payout
 * @property {Number|String} duration - duration with unit or duration in number
 * @property {String=} duration_unit - duration unit, required if duration is number
 * @property {String=} product_type - 'multi_barrier' or 'basic'
 * @property {Account=} account - The account that has this contract
 */

/**
 * Abstract class for contracts
 *
 * @example
 * const contract = account.contract({ contract_type: 'CALL', ...options })
 *
 * const buy = await contract.buy();
 *
 * contract.onUpdate().subscribe(console.log)
 *
 * @param {DerivAPI} api
 * @param {ContractParam} options
 *
 * @property {String} status - Current status of the contract
 * @property {Monetary} sell_price - Price at which the contract was sold
 * @property {Monetary} buy_price - Price at which the contract was bought
 * @property {String} type - contract type
 * @property {Monetary} potential_payout - The payout value before the contract was sold
 * @property {Monetary} payout - The payout after selling the contract
 * @property {Number} contract_id - The contract ID after purchase
 * @property {CustomDate} purchase_time - Time of purchase
 * @property {Boolean} is_expired
 * @property {Boolean} is_open
 * @property {Duration} duration
 */
export default class Contract extends Stream {
    // Called by the API to initialize the instance
    async init() {
        return this;
    }

    /**
     * Buys this contract
     *
     * @param {BuyParam} buy
     * @returns {Buy}
     */
    async buy({ max_price: price }) {
        return this.api.buy({ buy: this.contract_id, price });
    }

    /**
     * Sells this contract
     *
     * @param {SellParam} sell
     * @returns {Sell}
     */
    async sell({ max_price: price }) {
        return this.api.sell({ sell: this.contract_id, price });
    }
}
