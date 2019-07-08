/**
 * Keeps a market value and pip size
 */
export default class MarketValue {
    constructor(value, pip) {
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
