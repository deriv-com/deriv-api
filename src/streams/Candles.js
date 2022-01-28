import {
    map, first, skip, share,
}                       from 'rxjs/operators';

import Candle           from '../immutables/Candle';
import Stream           from '../types/Stream';
import {
    parseRequestRange,
    parseHistoryArgs,
}                       from '../utils';

/**
 * @typedef {Object} CandlesParam
 *
 * @property {Number}       granularity - Granularity in seconds
 * @property {HistoryRange} range       - A chunk of history to return with start and end time
 * @property {String}       symbol      - Symbol of the candles
 */

/**
 * An abstract class for Candles stream returned from {@link DerivAPI#candleStream}
 * @param {DerivAPI}      api
 * @param {CandlesParam=} options
 *
 * @property {Candle[]} list - An immutable list of candles
 */
export default class Candles extends Stream {
    constructor(api, options) {
        super({ api, granularity: 60, ...parseHistoryArgs(options) });
    }

    async init() {
        const { active_symbols } = (await this.api.basic.cache.activeSymbols('brief'));
        this._data.pip           = active_symbols.find((s) => s.symbol === this.symbol).pip;
        const candle_stream      = this.api.basic.subscribe(toTicksHistoryParam(this));

        this.addSource(candle_stream.pipe(
            skip(1),
            map((t) => wrapCandle(t, this._data.pip)),
            share(),
        ));

        this.beforeUpdate((candle) => {
            this._data.list = [...this._data.list.slice(1), candle];
        });

        this._data.list = await candle_stream
            .pipe(first(), map((h) => historyToCandles(h, this._data.pip)))
            .toPromise();
    }

    get list() {
        return [...this._data.list];
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
        if (!range) return this.list;

        return this.api.basic.cache.ticksHistory(toTicksHistoryParam({ ...this, range }))
            .then((h) => historyToCandles(h, this._data.pip));
    }
}

function historyToCandles({ candles: history }, pip) {
    return history.map((candle) => new Candle(candle, pip));
}

function wrapCandle({ ohlc }, pip) {
    return new Candle(ohlc, pip);
}

function toTicksHistoryParam({ symbol, range, granularity }) {
    return {
        ticks_history: symbol,
        style        : 'candles',
        granularity,
        ...parseRequestRange(range),
    };
}
