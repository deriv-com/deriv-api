import CustomDate  from '../fields/CustomDate';
import MarketValue from '../fields/MarketValue';
import Immutable   from '../types/Immutable';

/**
 * A wrapper class for Tick
 *
 * @param {Object}        tick
 * @param {Number|String} tick.epoch
 * @param {Number}        tick.quote
 * @param {Number}        tick.ask
 * @param {Number}        tick.bid
 * @param {Number}        pip
 *
 * @property {CustomDate}  time
 * @property {MarketValue} quote
 * @property {MarketValue} ask
 * @property {MarketValue} bid
 * @property {Object}      raw - The raw data received from API
 */
export default class Tick extends Immutable {
    constructor(tick, pip) {
        const {
            epoch, quote, ask, bid,
        } = tick;

        const instance = { raw: tick };

        instance.time  = new CustomDate(epoch);
        instance.quote = new MarketValue(quote, pip);
        instance.ask   = new MarketValue(ask, pip);
        instance.bid   = new MarketValue(bid, pip);

        super(instance);
    }
}
