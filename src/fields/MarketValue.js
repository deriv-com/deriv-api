import Immutable      from '../types/Immutable';
import { toPipSized } from '../utils';

/**
 * Keeps a market value and pip size
 *
 * @param {Number} value
 * @param {Number} pip
 *
 * @property {Number} pip_size
 * @property {Number} pip_sized - the pipsized value
 * @property {Number} display   - alias for `pip_size`
 */
export default class MarketValue extends Immutable {
    constructor(value, pip) {
        super({ value: +value, pip });
    }

    get pip_size() {
        return toPipSized(this.pip);
    }

    get pip_sized() {
        return this.value.toFixed(this.pip_size);
    }

    get display() {
        return this.pip_sized;
    }
}
