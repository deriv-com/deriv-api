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
        this.api     = api;
        this.options = options;
    }

    /**
     * @param {CandlesParam=} options
     * @returns {Candle[]}
     */
    history() {
    }
}
