import { map, first, skip, share } from 'rxjs/operators';
import Stream from '../types/Stream';
import { parseRequestRange, parseHistoryArgs } from '../utils';

/**
 * Abstract class for DataPoint stream.
 * @param {DerivAPI} api
 * @param {Object} options
 * @property {DataPoint[]} list - An immutable list of data points (either Candle or Tick)
 */
export default class DataPointStream extends Stream {
    constructor(api, options, dataPointClass) {
        super({ api, ...parseHistoryArgs(options) });
        this.dataPointClass = dataPointClass;
        this._data.timeFrame = this.granularity; // Initialize with the default granularity
    }

    async init() {
        const { active_symbols } = (await this.api.basic.cache.activeSymbols('brief'));
        this._data.pip = active_symbols.find((s) => s.symbol === this.symbol).pip;
        const dataStream = this.api.basic.subscribe(this.getDataStreamParams());

        this.addSource(dataStream.pipe(
            skip(1),
            map((data) => this.wrapDataPoint(data, this._data.pip)),
            share(),
        ));

        this.beforeUpdate((dataPoint) => {
            this._data.list = [...this._data.list.slice(1), dataPoint];
        });

        this._data.list = await dataStream
            .pipe(first(), map((h) => this.historyToDataPoints(h, this._data.pip)))
            .toPromise();
    }

    get list() {
        return [...this._data.list];
    }

    /**
     * Resolves to a list of data points using the given range
     * @param {HistoryRange=} range
     * @returns {Promise<DataPoint[]>}
     */
    async history(range) {
        if (!range) return this.list;

        // TODO: Do we need cache? In case of 'end', it can be buggy
        return this.api.basic.cache.ticksHistory(this.getHistoryParams(range))
            .then((h) => this.historyToDataPoints(h, this._data.pip));
    }

    /**
     * Get the parameters for the data stream (override in subclasses)
     * @returns {Object}
     */
    getDataStreamParams() {
        throw new Error('Not implemented');
    }
    /* Change the time frame (granularity) dynamically.
    * @param {Number} newGranularity - The new time frame in seconds.
    */
   changeTimeFrame(newGranularity) {
       this._data.timeFrame = newGranularity;
       // Reinitialize the stream with the new time frame
       this.init();
   }

    /**
     * Get the parameters for history data (override in subclasses)
     * @param {HistoryRange} range
     * @returns {Object}
     */
    getHistoryParams(range) {
        throw new Error('Not implemented');
    }

    /**
     * Convert history data to data points (override in subclasses)
     * @param {Object} history
     * @param {Number} pip
     * @returns {DataPoint[]}
     */
    historyToDataPoints(history, pip) {
        throw new Error('Not implemented');
    }

    /**
     * Wrap raw data to a data point (override in subclasses)
     * @param {Object} rawData
     * @param {Number} pip
     * @returns {DataPoint}
     */
    wrapDataPoint(rawData, pip) {
        throw new Error('Not implemented');
    }
}
