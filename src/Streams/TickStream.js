import { map, first, skip } from 'rxjs/operators';
import Stream from '../Types/Stream';
import Tick   from '../Types/Tick';
import { parseRequestRange } from '../utils';

/**
 * @typedef {Object} Range
 * @property {Number|Date} start - An epoch in seconds or a Date object
 * @property {Number|Date} end -  An epoch in seconds or a Date object
 * @property {Number} count - Number of ticks returned by history
 */

/**
 * @typedef {Object} TicksParam
 * @property {Range} range - A chunk of history to return with start and end time
 * @property {String} symbol - The ticks symbol
 */

/**
 * Abstract class for ticks
 */
export default class TickStream extends Stream {
    /**
     * @param {DerivAPI} api
     * @param {TicksParam} options
     */
    constructor(api, options = {}) {
        super();

        /** Default range of ticks: 1000 latest ticks */
        const defaultRange = {
            end  : 'latest',
            count: 1000,
        };

        this.api = api;

        if (typeof options === 'string') {
            this.symbol = options;
            this.range  = defaultRange;
        } else {
            this.range  = options.range ? options.range : defaultRange;
            this.symbol = options.symbol;
        }
    }

    async init() {
        const activeSymbols = (await this.api.cache.activeSymbols({ active_symbols: 'brief' })).active_symbols;
        this.pip            = activeSymbols.find(s => s.symbol === this.symbol).pip;
        const tickStream    = this.api.subscribe(requestParams(this.symbol, this.range));

        /** Called with every new tick in the stream */
        this.onUpdate = tickStream
            .pipe(skip(1))
            .pipe(map(t => wrapTick(t, this.pip)));

        /** A list of Tick objects */
        this.list = await tickStream
            .pipe(first())
            .pipe(map(h => historyToTicks(h, this.pip)))
            .toPromise();

        return this.freeze().list;
    }

    /**
     * @param {Range=} range
     * @returns {Tick[]}
     */
    history(range) {
        if (!range) return this.list;
        return this.api.cache.ticksHistory(requestParams(this.symbol, range))
            .then(h => historyToTicks(h, this.pip));
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

function requestParams(symbol, range) {
    return {
        ticks_history: symbol,
        style        : 'ticks',
        ...parseRequestRange(range),
    };
}
