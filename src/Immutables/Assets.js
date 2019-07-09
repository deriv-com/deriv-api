import Immutable from '../Types/Immutable';

/**
 * Abstract class for trading assets
 *
 * @example
 * const assets = await api.assets();
 *
 * // Get the current open markets
 * const openMarkets = assets.openMarkets;
 *
 * const tradingTimes = assets.tradingTimes;
 *
 * @param {DerivAPI} api
 */
export default class Assets extends Immutable {
    // Called by the API to initialize the instance
    async init() {
        /*
         * this._data.tradingTimes = await this.api.cache.tradingTimes(...);
         * this._data.tradingDurations = await this.api.cache.tradingDurations(...);
         * this._data.underlyings = extractUnderlyings(this.activeSymbols);
         */
        return Promise.resolve(undefined);
    }

    /** @returns {Underlying[]} */
    get underlyings() {
        return [];
    }

    /** @returns {Underlying[]} list of open markets */
    get openMarkets() {
        return [];
    }

    /** @returns {Object} */
    get tradingTimes() {
        return [];
    }

    /** @returns {Object} */
    get tradingDurations() {
        return [];
    }
}
