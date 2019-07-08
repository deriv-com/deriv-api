import CustomDate from './CustomDate';
import MarketValue from './MarketValue';

/**
 * @typedef {Object} Candle
 *
 * @property {CustomDate} time
 * @property {MarketValue} open
 * @property {MarketValue} high
 * @property {MarketValue} low
 * @property {MarketValue} close
 */

/**
 * A candle object
 */
export default class Candle {
    /**
     * @returns {Candle}
     */
    constructor({
        epoch, open, high, low, close,
    }, pip) {
        this.time  = new CustomDate(epoch);
        this.open  = new MarketValue(open, pip);
        this.high  = new MarketValue(high, pip);
        this.low   = new MarketValue(low, pip);
        this.close = new MarketValue(close, pip);
    }
}
