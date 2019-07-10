import Stream from '../Types/Stream';
import Candle from '../Types/Candle'; /* eslint-disable-line no-unused-vars */
import { parseTicksOptions } from '../utils';

/**
 * @typedef {Object} CandlesParam
 * @property {Number} granularity - Granularity in seconds
 * @property {HistoryRange} range - A chunk of history to return with start and end time
 * @property {String} symbol - Symbol of the candles
 */

/**
 * An abstract class for Candles stream returned from {@link DerivAPI#candleStream}
 * @param {DerivAPI} api
 * @param {CandlesParam=} options
 */
export default class CandleStream extends Stream {
    constructor(api, options) {
        super({ api, ...parseTicksOptions(options) });
    }

    // Called by the API to initialize the instance
    async init() {
        return this;
    }

    /**
     * An immutable list of Candle objects
     *
     * @example
     * const candles = candleStream.list;
     *
     * @returns {Candle[]}
     */
    get list() {
        return this._data.list;
    }

    /**
     * Resolves to a list of candles given the range
     *
     * @example
     * const oldCandles = await candleStream.history({count: 10, end: yesterday})
     *
     * @param {HistoryRange=} range
     * @returns {Promise<Candle[]>}
     */
    async history(range) {
        return range ? this.api.ticksHistory({ style: 'candles' }) : this._data.list;
    }
}
