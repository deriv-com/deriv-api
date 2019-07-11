import Stream from '../Types/Stream';
import Candle from '../Immutables/Candle'; /* eslint-disable-line no-unused-vars */
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
 *
 * @property {Candle[]} list - An immutable list of candles
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
     * Resolves to a list of candles given the range
     *
     * @example
     * const old_candles = await candle_stream.history({count: 10, end: yesterday})
     *
     * @param {HistoryRange=} range
     * @returns {Promise<Candle[]>}
     */
    async history(range) {
        return range ? this.api.ticksHistory({ style: 'candles' }) : this._data.list;
    }
}
