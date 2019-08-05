import CustomDate  from '../fields/CustomDate';
import MarketValue from '../fields/MarketValue';
import Immutable   from '../types/Immutable';

/**
 * A wrapper class for Candle
 *
 * @param {Object}        candle
 * @param {Number|String} candle.epoch
 * @param {Number}        candle.open
 * @param {Number}        candle.high
 * @param {Number}        candle.low
 * @param {Number}        candle.close
 * @param {Number}        pip
 *
 * @property {CustomDate}  time      - The current time of the candle
 * @property {CustomDate}  open_time - The time that candle opened
 * @property {MarketValue} open
 * @property {MarketValue} high
 * @property {MarketValue} low
 * @property {MarketValue} close
 * @property {Object}      raw       - The raw data received from API
 */
export default class Candle extends Immutable {
    constructor(candle, pip) {
        const {
            epoch, open, high, low, close, open_time,
        } = candle;

        const instance = { raw: candle };

        instance.time      = new CustomDate(epoch);
        instance.open_time = open_time ? new CustomDate(open_time) : new CustomDate(epoch);
        instance.open      = new MarketValue(open, pip);
        instance.high      = new MarketValue(high, pip);
        instance.low       = new MarketValue(low, pip);
        instance.close     = new MarketValue(close, pip);

        super(instance);
    }
}
