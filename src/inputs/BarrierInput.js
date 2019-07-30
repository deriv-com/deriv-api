import Barrier from '../fields/Barrier';

/**
 * A changeable barrier info, either absolute or relative
 *
 * @property {String} min
 * @property {String} max
 * @property {String} value
 * @property {String} type         - 'relative' or 'absolute'
 * @property {Boolean} is_relative
 */
export default class BarrierInput extends Barrier {
    set value(value) {
        Object.assign(this._data, this.wrapBarrier(value));
    }
}
