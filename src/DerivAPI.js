import DerivAPIBasic    from './DerivAPIBasic';
import Underlying       from './Immutables/Underlying';
import Account          from './Immutables/Account';
import Assets           from './Immutables/Assets';
import Candles          from './Streams/Candles';
import Ticks            from './Streams/Ticks';
import Contract         from './Streams/Contract';

/**
 * The default class of the DerivAPI module.
 *
 * @example
 * const ticks = api.ticks('R_100');
 * ticks.onUpdate().subscribe(console.log)
 *
 * @param {Object} options
 * For options details see: {@link DerivAPIBasic}
 */
export default class DerivAPI extends DerivAPIBasic {
    constructor(options) {
        super(options);
    }

    /**
     * A stream of ticks
     *
     * @param {String|TicksParam} options - symbol or a ticks parameter object
     * @returns {Ticks} {@link Ticks}
     */
    async ticks(options) {
    }

    /**
     * A stream of candles (default granularity: 1 minute)
     *
     * @param {String|CandlesParam} options - symbol or a candles parameter object
     * @returns {Candles} {@link Candles}
     */
    async candles(options) {
    }

    /**
     * A contract object with status and ability to buy/sell
     *
     * @param {ContractsParam} options
     * @returns {Contract} {@link Contract}
     */
    async contract(options) {
    }

    /**
     * An underlying object which has information about an underlying
     *
     * @param {String} symbol - The symbol for the expected underlying
     * @returns {Underlying} {@link Underlying}
     */
    async underlying(symbol) {
    }

    /**
     * An account object, containing all information about the account
     *
     * @param {String} token - Token to create the account with
     * @returns {Account} {@link Account}
     */
    async account(token) {
    }

    /**
     * Information about all trading assets
     * @returns {Assets} {@link Assets}
     */
    async assets() {
    }
}
