import Immutable from './Immutable';

/**
 * Keeps a market value and pip size
 */
export default class MarketValue extends Immutable {
    constructor(value, pip) {
        super();
        this.value = value;
        this.pip   = pip;
    }

    /** Returns the pip size */
    get pipSize() {
        return this.pip.toString().length - 2;
    }

    /** Returns the pipsized value */
    pipSized() {
        return this.value.toFixed(this.pipSize);
    }
}
