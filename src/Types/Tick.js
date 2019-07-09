import Immutable from './Immutable';
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
 * @param {Object} options
 * @param {Number|String} options.epoch
 * @param {Number} options.quote
 * @param {Number} options.ask
 * @param {Number} options.bid
 * @param {Number} pip
 */
export default class Tick extends Immutable {
    constructor({
        epoch, quote, ask, bid,
    }, pip) {
        super();
        this.epoch = new CustomDate(epoch);
        this.quote = new MarketValue(quote, pip);
        this.ask   = new MarketValue(ask, pip);
        this.bid   = new MarketValue(bid, pip);
    }
}
