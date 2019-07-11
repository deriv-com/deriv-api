import Immutable from '../Types/Immutable';
import FullName from '../Types/FullName'; /* eslint-disable-line no-unused-vars */
import ContractGroup from './ContractGroup'; /* eslint-disable-line no-unused-vars */
import Contract         from '../Streams/Contract';

/**
 * Abstract class for an underlying
 *
 * @example
 * const underlying = await api.underlying('R_100');
 *
 * const pip_sized = underlying.pipSizedValue(123.1);
 *
 * // Same as api.tickStream(symbol);
 * const tick_stream = underlying.tickStream();
 *
 * if (underlying.is_open) await contract.buy();
 *
 * @param {DerivAPI} api
 * @param {String} symbol
 *
 * @property {FullName} name
 * @property {Boolean} is_open
 * @property {Boolean} is_trading_suspended
 * @property {Number} pip_size
 * @property {Object} contract_groups
 * @property {Object} contract_groups
 */
export default class Underlying extends Immutable {
    // Called by the API to initialize the instance
    async init() {
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

    /**
     * A contract object with latest market values, cannot be bought or sold
     *
     * @param {ContractsParam} options - parameters defining the contract
     * @returns {Contract}
     */
    async contract(options) {
        const contract = new Contract({ symbol: this.symbol, ...options });

        await contract.init();

        return contract;
    }
}
