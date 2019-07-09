import Immutable from './Immutable';
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
 * A wrapper class for Candle
 *
 * @param {Object} options
 * @param {Number|String} options.epoch
 * @param {Number} options.open
 * @param {Number} options.high
 * @param {Number} options.low
 * @param {Number} options.close
 * @param {Number} pip
 */
export default class Candle extends Immutable {
    constructor({
        epoch, open, high, low, close,
    }, pip) {
        const instance = {};

        instance.time  = new CustomDate(epoch);
        instance.open  = new MarketValue(open, pip);
        instance.high  = new MarketValue(high, pip);
        instance.low   = new MarketValue(low, pip);
        instance.close = new MarketValue(close, pip);

        super(instance);
    }
}
