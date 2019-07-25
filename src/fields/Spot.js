import CustomDate    from './CustomDate';
import MarketValue   from './MarketValue';

/**
 * Keeps a market value at a time
 *
 * @param {Number} value
 * @param {Number} pip
 *
 * @property {Number}     pip_size
 * @property {Number}     pip_sized - the pipsized value
 * @property {CustomDate} time      - the spot time
 */
export default class Spot extends MarketValue {
    constructor(value, pip, time) {
        super(value, pip);

        this._data.time = new CustomDate(time);
    }
}
