import MarketValue from './MarketValue';

/**
 * A barrier info, either absolute or relative
 *
 * @param {Number} value
 * @param {Number} pip
 *
 * @property {String} type         'relative' or 'absolute'
 * @property {Number} sign         0, -1, +1
 * @property {Boolean} is_relative
 */
export default class Barrier extends MarketValue {
    constructor(value, pip) {
        super(pip);

        const barrier = this.wrapBarrier(value);

        Object.assign(this._data, barrier);
    }

    // eslint-disable-next-line class-methods-use-this
    wrapBarrier(value) {
        let sign;
        if (typeof value === 'string') {
            if (value[0] === '+') {
                sign = 1;
            } else if (value[0] === '-') {
                sign = -1;
            } else {
                sign = 0;
            }
        }
        return {
            type       : sign === 0 ? 'absolute' : 'relative',
            is_relative: sign !== 0,
            value      : +value,
            sign,
        };
    }
}
