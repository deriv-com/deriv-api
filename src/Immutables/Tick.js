import CustomDate  from '../Types/CustomDate';
import Immutable   from '../Types/Immutable';
import MarketValue from '../Types/MarketValue';

/**
 * A wrapper class for Tick
 *
 * @param {Object} tick
 * @param {Number|String} tick.epoch
 * @param {Number} tick.quote
 * @param {Number} tick.ask
 * @param {Number} tick.bid
 * @param {Number} pip
 *
 * @property {CustomDate} time
 * @property {MarketValue} quote
 * @property {MarketValue} ask
 * @property {MarketValue} bid
 */
export default class Tick extends Immutable {
    constructor({
        epoch, quote, ask, bid,
    }, pip) {
        const instance = {};

        instance.time  = new CustomDate(epoch);
        instance.quote = new MarketValue(quote, pip);
        instance.ask   = new MarketValue(ask, pip);
        instance.bid   = new MarketValue(bid, pip);

        super(instance);
    }
}
