import Immutable from '../Types/Immutable';

/**
 * Abstract class for an underlying
 */
export default class Underlying extends Immutable {
    /**
     * @param {DerivAPI} api
     * @param {String} symbol
     */
    constructor(api, symbol) {
        super();
        this.api    = api;
        this.symbol = symbol;
    }

    // Called by the API to initialize the instance
    async init() {
        return Promise.resolve(undefined);
    }
}
