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
         * this.tradingTimes = await this.api.cache.tradingTimes(...);
         * this.tradingDurations = await this.api.cache.tradingDurations(...);
         * this.underlyings = extractUnderlyings(this.activeSymbols);
         */
        return Promise.resolve(undefined);
    }

    /** Returns the current {@link Underlying} list for open markets */
    get openMarkets() {
        return [];
    }
}
