import Immutable from './Immutable';
import { toPipSize } from '../utils';

/**
 * Keeps a market value and pip size
 *
 * @param {Object} market
 * @param {Number} market.value
 * @param {Number} market.pip
 *
 * @property {Number} pip_size
 * @property {Number} pip_sized - the pipsized value
 */
export default class MarketValue extends Immutable {
    constructor(value, pip) {
        super({ value, pip });
    }

    get pip_size() {
        return toPipSize(this.pip);
    }

    get pip_sized() {
        return this.value.toFixed(this.pip_size);
    }
}
