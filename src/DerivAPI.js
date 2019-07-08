import DerivAPIBasic    from './DerivAPIBasic';
import Underlying       from './Immutables/Underlying';
import Account          from './Immutables/Account';
import Assets           from './Immutables/Assets';
import CandlesContainer          from './Streams/CandlesContainer';
import TicksContainer            from './Streams/TicksContainer';
import Contract         from './Streams/Contract';

/**
 * The main class of the DerivAPI module. This class extends the minimum
 * functionality provided by the {@link DerivAPIBasic} adding abstract objects
 * that can be used to read data and interact with the API.
 *
 * @example
 * // Returns an abstract ticks object
 * const ticks = api.ticks('R_100');
 *
 * // Subscribe to updates on the ticks object
 * ticks.onUpdate().subscribe(console.log);
 *
 * // Read the history of ticks from the ticks object
 * const ticksHistory = ticks.history();
 *
 * @param {Object} options - For options details see: {@link DerivAPIBasic}
 */
export default class DerivAPI extends DerivAPIBasic {
    constructor(options) {
        super(options);
    }

    /**
     * Provides a ticks stream and a history of last 1000 ticks available
     *
     * @param {String|TicksParam} options - symbol or a ticks parameter object
     * @returns {TicksContainer}
     */
    async ticks(options) {
    }

    /**
     * Provides 1-minute candles stream and a history of last 1000 candles
     *
     * @param {String|CandlesParam} options - symbol or a candles parameter object
     * @returns {CandlesContainer}
     */
    async candles(options) {
    }

    /**
     * A contract object with latest status and ability to buy/sell
     *
     * @param {ContractsParam} options - parameters defining the contract
     * @returns {Contract}
     */
    async contract(options) {
    }

    /**
     * An underlying object, including contract groups, pip size, etc.
     *
     * @param {String} symbol - The underlying symbol
     * @returns {Underlying}
     */
    async underlying(symbol) {
    }

    /**
     * An account object, including loginid, balance, contracts, etc.
     *
     * @param {String} token - Token to create the account with
     * @returns {Account}
     */
    async account(token) {
    }

    /**
     * Trading assets including multiple underlyings and trading times
     *
     * @returns {Assets}
     */
    async assets() {
    }
}
