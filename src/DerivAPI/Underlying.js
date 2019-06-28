import { CallError }            from '../lib/error';
import { tradingTimesToObject } from '../lib/utils';

export default class Underlying {
    constructor(symbolsInfo, api) {
        Object.assign(this, symbolsInfo);
        this.api = api;

        this.tradingTimesInfo = {};
    }

    ticks(args) {
        return this.api.subscribe({ ticks: this.symbol, ...args });
    }

    ticksHistory(args) {
        if (args.subscribe) {
            throw new CallError('"subscribe" argument passed for a non-subscription call. Call "ticksHistorySubscribe" instead.');
        }
        return this.api.ticksHistory({ ticks_history: this.symbol, ...args });
    }

    ticksHistorySubscribe(args, callback) {
        if (typeof callback === 'function') {
            return this.api.subscribeWithCallback(
                { ticks_history: this.symbol, ...args },
                callback,
            );
        }
        return this.api.subscribe({ ticks_history: this.symbol, ...args });
    }

    async tradingTimes(date = 'today') {
        if (!this.tradingTimesInfo[date]) {
            const tradingTimesResponse  = await this.api.tradingTimes({ trading_times: date });
            this.tradingTimesInfo[date] = tradingTimesToObject(tradingTimesResponse);
        }

        return this.tradingTimesInfo[date][this.symbol];
    }
}
