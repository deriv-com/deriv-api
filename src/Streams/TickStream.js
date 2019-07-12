import { map, first, skip } from 'rxjs/operators';
import Stream from '../Types/Stream';
import Tick   from '../Immutables/Tick';
import { parseRequestRange, parseTicksOptions } from '../utils';

/**
 * @typedef {Object} HistoryRange
 * @property {Number|Date} start - An epoch in seconds or a Date object
 * @property {Number|Date} end -  An epoch in seconds or a Date object
 * @property {Number} count - Number of ticks returned by history
 */

/**
 * @typedef {Object} TicksParam
 * @property {HistoryRange} range - A chunk of history to return with start and end time
 * @property {String} symbol - The ticks symbol
 */

/**
 * Abstract class for ticks stream returned by the {@link DerivAPI#tickStream}
 * @param {DerivAPI} api
 * @param {TicksParam} options
 *
 * @property {Tick[]} list - An immutable list of ticks
 */
export default class TickStream extends Stream {
    constructor(api, options) {
        super({ api, ...parseTicksOptions(options) });
    }

    async init() {
        const { active_symbols } = (await this.api.cache.activeSymbols('brief'));
        this._data.pip           = active_symbols.find(s => s.symbol === this.symbol).pip;
        const tick_stream        = this.api.subscribe(parseParams(this.symbol, this.range));

        this._data.on_update = tick_stream
            .pipe(skip(1))
            .pipe(map(t => wrapTick(t, this._data.pip)));

        this._data.list = await tick_stream
            .pipe(first(), map(h => historyToTicks(h, this._data.pip)))
            .toPromise();
    }


    get list() {
        return [...this._data.list];
    }

    /**
     * Resolves to a list of Ticks using the given range
     *
     * @example
     * const old_ticks = await tickStream.history({count: 10, end: yesterday})
     *
     * @param {HistoryRange=} range
     * @returns {Promise<Tick[]>}
     */
    async history(range) {
        if (!range) return this.list;
        return this.api.cache.ticksHistory(parseParams(this.symbol, range))
            .then(h => historyToTicks(h, this._data.pip));
    }
}

function historyToTicks({ history }, pip) {
    const ticks = [];

    history.times.forEach((epoch, index) => {
        const quote = history.prices[index];

        ticks.push(new Tick({ epoch, quote }, pip));
    });

    return ticks;
}

function wrapTick({ tick }, pip) {
    return new Tick(tick, pip);
}

function parseParams(symbol, range) {
    return {
        ticks_history: symbol,
        style        : 'ticks',
        ...parseRequestRange(range),
    };
}
