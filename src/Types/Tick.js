import CustomDate from './CustomDate';
import MarketValue from './MarketValue';

/**
 * @typedef {Object} Tick
 *
 * @property {CustomDate} time
 * @property {MarketValue} quote
 * @property {MarketValue} ask
 * @property {MarketValue} bid
 */

/**
 * A wrapper class for Tick
 */
export default class Tick {
    constructor({
        epoch, quote, ask, bid,
    }, pip) {
        this.epoch = new CustomDate(epoch);
        this.quote = new MarketValue(quote, pip);
        this.ask   = new MarketValue(ask, pip);
        this.bid   = new MarketValue(bid, pip);
    }
}
