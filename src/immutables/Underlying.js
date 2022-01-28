import FullName        from '../fields/FullName';
import Immutable       from '../types/Immutable';
import { toPipSized }  from '../utils';

import ContractOptions from './ContractOptions';

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
 * @param {String}   symbol
 *
 * @property {FullName}        name
 * @property {Boolean}         is_open
 * @property {Boolean}         is_trading_suspended
 * @property {Number}          pip
 * @property {Number}          pip_size
 * @property {Object}          contract_groups
 */
export default class Underlying extends Immutable {
    constructor(api, symbol) {
        super({ api, symbol });
    }

    // Called by the API to initialize the instance
    async init() {
        const { active_symbols } = (await this.api.basic.cache.activeSymbols('brief'));
        const ul_info            = active_symbols.find((s) => s.symbol === this.symbol);

        this._data.is_open              = ul_info.exchange_is_open;
        this._data.is_trading_suspended = ul_info.is_trading_suspended;
        this._data.pip                  = ul_info.pip;

        this._data.name       = new FullName(ul_info.symbol, ul_info.display_name);
        this._data.market     = new FullName(ul_info.market, ul_info.market_display_name);
        this._data.sub_market = new FullName(ul_info.submarket, ul_info.submarket_display_name);
    }

    get pip_size() {
        return toPipSized(this._data.pip);
    }

    /** Returns the pipSized display of the value in string */
    toPipSized(value) {
        return value.toFixed(this.pip_size);
    }

    /** Shortcut for api.ticks(symbol) */
    async ticks() {
        return this.api.ticks(this.symbol);
    }

    /** Shortcut for api.candles(symbol) */
    async candles() {
        return this.api.candles(this.symbol);
    }

    async contractOptions() {
        return new ContractOptions(this.api, this.symbol);
    }
}
