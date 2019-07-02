import { CallError }            from '../lib/error';
import { assetIndexToObject, tradingTimesToObject } from '../lib/utils';

export default class Underlying {
    constructor(symbolsInfo, api) {
        Object.assign(this, symbolsInfo);
        this.api = api;
    }

    ticksHistory(args) {
        if (args.subscribe) {
            throw new CallError('"subscribe" argument passed for a non-subscription call. Call "ticksHistorySubscribe" instead.');
        }
        return this.api.cache.ticksHistory({ ticks_history: this.symbol, ...args });
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
        const tradingTimes = await this.api.cache.tradingTimes({ trading_times: date });

        return tradingTimesToObject(tradingTimes)[this.symbol];
    }

    async assetIndex(args = {}) {
        return assetIndexToObject(await this.api.cache.assetIndex(args))[this.symbol];
    }

    async contractsFor(args = {}) {
        return this.api.cache.contractsFor({
            contracts_for: this.symbol,
            ...args,
        });
    }
}
