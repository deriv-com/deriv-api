import Immutable from './Immutable';

/**
 * Keeps a market value and pip size
 *
 * @param {Object} market
 * @param {Number} market.value
 * @param {Number} market.pip
 */
export default class MarketValue extends Immutable {
    /** Returns the pip size */
    get pipSize() {
        return this.pip.toString().length - 2;
    }

    /** Returns the pipsized value */
    pipSized() {
        return this.value.toFixed(this.pipSize);
    }
}
