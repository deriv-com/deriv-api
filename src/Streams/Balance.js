import Stream from '../Types/Stream';

/**
 * An abstract class for balance information
 */
export default class Balance extends Stream {
    /**
     * @param {DerivAPI} api
     */
    constructor(api) {
        super();
        this.api = api;
    }

    // Called by the API to initialize the instance
    async init() {
        /*
         * const balance = await this.api.balance(...);
         * this.balance = new Monetary(balance.balance, balance.currency)
         * this.onUpdate = this.api.subscribe({ balance: 1})
         */
        return Promise.resolve(undefined);
    }

    /** @returns {Number} numeric balance value */
    get value() {
        return this.balance.value;
    }

    /** @returns {String} currency of the balance */
    get currency() {
        return this.balance.currency;
    }

    /** @returns {String} display value of balance (decimal point) */
    get display() {
        return this.balance.display();
    }

    /** @returns {String} formatted balance (decimal point, comma separated) */
    get format() {
        return this.balance.format();
    }
}
