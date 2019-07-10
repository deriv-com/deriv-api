import Stream from '../Types/Stream';
import Buy from '../Immutables/Buy'; /* eslint-disable-line no-unused-vars */
import Sell from '../Immutables/Sell'; /* eslint-disable-line no-unused-vars */
import Monetary from '../Types/Monetary'; /* eslint-disable-line no-unused-vars */
import Duration from '../Types/Duration'; /* eslint-disable-line no-unused-vars */
/**
 * @typedef {Object} ContractsParam
 * @property {String} contractType
 * @property {Number} amount
 * @property {String} barrier
 * @property {String} barrier2
 * @property {Number|Date} dateExpiry - epoch in seconds or {@link Date}
 * @property {Number|Date} dateStart - epoch in seconds or {@link Date}
 * @property {String=} Currency - Default is the account currency
 * @property {String} basis - stake or payout
 * @property {Number|String} duration - duration with unit or duration in number
 * @property {String=} durationUnit - duration unit, required if duration is number
 * @property {String=} productType - 'multi_barrier' or 'basic'
 * @property {Account=} account - The account that has this contract
 */

/**
 * Abstract class for contracts
 *
 * @example
 * const contract = account.contract({ contractType: 'CALL', ...options })
 *
 * const buy = await contract.buy();
 *
 * contract.onUpdate().subscribe(console.log)
 *
 * @param {DerivAPI} api
 * @param {ContractsParam} options
 *
 * @property {String} status - Current status of the contract
 * @property {Monetary} sellPrice - Price at which the contract was sold
 * @property {Monetary} buyPrice - Price at which the contract was bought
 * @property {String} type - contract type
 * @property {Monetary} potentialPayout - The payout value before the contract was sold
 * @property {Monetary} payout - The payout after selling the contract
 * @property {Number} contractId - The contract ID after purchase
 * @property {CustomDate} purchaseTime - Time of purchase
 * @property {Boolean} isExpired
 * @property {Boolean} isOpen
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
    async buy({ maxPrice: price }) {
        return this.api.buy({ buy: this.contractId, price });
    }

    /**
     * Sells this contract
     *
     * @param {SellParam} sell
     * @returns {Sell}
     */
    async sell({ maxPrice: price }) {
        return this.api.sell({ sell: this.contractId, price });
    }
}
