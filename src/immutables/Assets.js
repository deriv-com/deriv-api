import Immutable from '../types/Immutable';

/**
 * Abstract class for trading assets
 *
 * @example
 * const assets = await api.assets();
 *
 * // Get the current open markets
 * const open_markets = assets.open_markets;
 *
 * const trading_times = assets.trading_times;
 *
 * @param {DerivAPI} api
 *
 * @property {Underlying[]} underlyings
 * @property {Underlying[]} open_markets
 * @property {Object}       trading_times
 * @property {Object}       trading_durations
 */
export default class Assets extends Immutable {
    // Called by the API to initialize the instance
    async init() {
        return this;
    }
}
