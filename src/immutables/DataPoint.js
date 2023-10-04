import CustomDate from '../fields/CustomDate';
import MarketValue from '../fields/MarketValue';
import Immutable from '../types/Immutable';

/**
 * Base class for Candle and Tick
 */
class DataPoint extends Immutable {
    constructor(data, pip) {
        super({ raw: data });
        const { epoch } = data;
        this.time = new CustomDate(epoch);
    }
}

/**
 * A wrapper class for Candle
 */
export class Candle extends DataPoint {
    constructor(candle, pip) {
        super(candle, pip);
        const { open, high, low, close, open_time } = candle;
        this.open_time = open_time ? new CustomDate(open_time) : this.time;
        this.open = new MarketValue(open, pip);
        this.high = new MarketValue(high, pip);
        this.low = new MarketValue(low, pip);
        this.close = new MarketValue(close, pip);
    }
}

/**
 * A wrapper class for Tick
 */
export class Tick extends DataPoint {
    constructor(tick, pip) {
        super(tick, pip);
        const { quote, ask, bid } = tick;
        this.quote = new MarketValue(quote, pip);
        this.ask = new MarketValue(ask, pip);
        this.bid = new MarketValue(bid, pip);
    }
}
