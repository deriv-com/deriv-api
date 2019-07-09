import Stream from '../Types/Stream';

/**
 * @typedef {Object} CandlesParam
 * @property {Number} granularity - Granularity in seconds
 * @property {Number} count - Number of candles returned by history
 * @property {String} symbol - Symbol of the candles
 */

/**
 * An abstract class for Candles information
 */
export default class CandleStream extends Stream {
    /**
     * @param {DerivAPI} api
     * @param {CandlesParam=} options
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
     * An immutable list of {@link Candle} objects
     *
     * @example
     * const candles = candleStream.list;
     */
    get list() {
        return [];
    }

    /**
     * @param {CandlesParam=} options
     * @returns {Candle[]}
     */
    async history() {
        return Promise.resolve(undefined);
    }
}
