import Stream from '../Types/Stream';

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
 */
export default class Contract extends Stream {
    /**
     * @param {DerivAPI} api
     * @param {ContractsParam} options
     */
    constructor(api, options) {
        super();
        this.api = api;
        Object.assign(this, options);
    }

    // Called by the API to initialize the instance
    async init() {
        return Promise.resolve(undefined);
    }

    /**
     * Buys this contract
     *
     * @param {BuyParam} options
     * @returns {Buy}
     */
    async buy({ maxPrice: price }) {
        return this.api.buy({ buy: this.contractId, price });
    }

    /**
     * Sells this contract
     *
     * @param {SellParam} options
     * @returns {Sell}
     */
    async sell({ maxPrice: price }) {
        return this.api.sell({ sell: this.contractId, price });
    }

    /** @returns {Boolean} */
    get isExpired() {
        return false;
    }

    /** @returns {String} - Current status of the contract */
    get status() {
        return false;
    }
}
