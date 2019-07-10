import Immutable from '../Types/Immutable';
import FullName from '../Types/FullName'; /* eslint-disable-line no-unused-vars */
import ContractGroup from './ContractGroup'; /* eslint-disable-line no-unused-vars */

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
 *
 * @param {DerivAPI} api
 * @param {String} symbol
 *
 * @property {FullName} name
 * @property {Boolean} isOpen
 * @property {Boolean} isTradingSuspended
 * @property {Number} pipSize
 * @property {Object} contractGroups
 * @property {Object} contractGroups
 */
export default class Underlying extends Immutable {
    // Called by the API to initialize the instance
    async init() {
        /*
         * const market = activeSymbols.find(s => s.symbol === this.symbol)
         * this.isOpen = market.exchange_is_open;
         * this.pip = market.pip
         * this.isTradingSuspended = market.is_trading_suspended
         * this.contractGroups = groupContracts(assetIndex)
         */

        return this;
    }

    /** Returns the pipSized display of the value in string */
    pipSizedValue(value) {
        /*
         * return toPipSized(value, this.pip);
         */
        return value.toFixed(this.pip.toString().length - 2);
    }

    /** Shortcut for api.tickStream(symbol) */
    tickStream() {
        return this.api.tickStream(this.symbol);
    }

    /** Shortcut for api.candleStream(symbol) */
    candleStream() {
        return this.api.candleStream(this.symbol);
    }
}
