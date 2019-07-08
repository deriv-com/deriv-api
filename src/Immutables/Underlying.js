import Immutable from '../Types/Immutable';

/**
 * Abstract class for an underlying
 *
 * @example
 * const underlying = await api.underlying('R_100');
 *
 * const pipSized = underlying.pipSizedValue(123.1);
 *
 * // Same as api.tickStream(symbol);
 * const tickStream = underlying.tickStream();
 *
 * if (underlying.isOpen) await contract.buy();
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
        /*
         * const market = activeSymbols.find(s => s.symbol === this.symbol)
         * this.isOpen = market.exchange_is_open;
         * this.pip = market.pip
         * this.isTradingSuspended = market.is_trading_suspended
         * this.contractGroups = groupContracts(assetIndex)
         */

        return Promise.resolve(undefined);
    }

    /** Returns the pipSized display of the value in string */
    pipSizedValue(value) {
        /*
         * return toPipSized(value, this.pip);
         */
        return value;
    }

    /** Shortcut for api.tickStream(symbol) */
    get tickStream() {
        return this.api.tickStream(this.symbol);
    }

    /** Shortcut for api.candleStream(symbol) */
    get candleStream() {
        return this.api.candleStream(this.symbol);
    }
}
