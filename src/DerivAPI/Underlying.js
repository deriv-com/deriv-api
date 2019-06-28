export default class Underlying {
    constructor(symbolsInfo, api) {
        Object.assign(this, symbolsInfo);
        this.api = api;
    }

    ticks(args) {
        return this.api.subscribe({ ticks: this.symbol, ...args });
    }

    ticksHistory(args) {
        if (args.subscribe) {
            return this.api.subscribe({ ticks_history: this.symbol, ...args });
        }
        return this.api.ticksHistory({ ticks_history: this.symbol, ...args });
    }
}
