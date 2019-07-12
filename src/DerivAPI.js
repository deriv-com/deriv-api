import DerivAPIBasic          from './DerivAPIBasic';
import Account                from './Immutables/Account';
import Assets                 from './Immutables/Assets';
import Underlying             from './Immutables/Underlying';
import CandleStream           from './Streams/CandleStream';
import Contract               from './Streams/Contract';
import TickStream             from './Streams/TickStream';
import WebsiteStatusStream    from './Streams/WebsiteStatusStream';

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
 * // Read the last ticks available in the default range
 * const ticks_history = ticks.list;
 *
 * // Read the last 100 ticks until yesterday
 * const older_history = await ticks.history({ count: 100, end: new Date(yesterday) });
 *
 * @param {Object} options - For options details see: {@link DerivAPIBasic}
 */
export default class DerivAPI extends DerivAPIBasic {
    /**
     * Provides a ticks stream and a list of available ticks
     *
     * @param {String|TicksParam} options - symbol or a ticks parameter object
     * @returns {TickStream}
     */
    async tickStream(options) {
        const tick_stream = new TickStream(this, options);

        await tick_stream.init();

        return tick_stream;
    }

    /**
     * Provides a list of available candles with the default granularity
     *
     * @param {String|CandlesParam} options - symbol or a candles parameter object
     * @returns {CandleStream}
     */
    async candleStream(options) {
        const candle_stream = new CandleStream(this, options);

        await candle_stream.init();

        return candle_stream;
    }

    /**
     * A contract object with latest market values, cannot be bought or sold
     *
     * @param {ContractsParam} options - parameters defining the contract
     * @returns {Contract}
     */
    async contract(options) {
        const contract = new Contract(this, options);

        await contract.init();

        return contract;
    }

    /**
     * An underlying object, including contract groups, pip size, etc.
     *
     * @param {String} symbol - The underlying symbol
     * @returns {Underlying}
     */
    async underlying(symbol) {
        const underlying = new Underlying(this, symbol);

        await underlying.init();

        return underlying;
    }

    /**
     * An account object, including loginid, balance, contracts, etc.
     *
     * @param {String} token - Token to create the account with
     * @returns {Account}
     */
    async account(token) {
        const account = new Account(this, token);

        await account.init();

        return account;
    }

    /**
     * A balance stream
     *
     * @param {String} token
     * @returns {Balance}
     */
    async balance(token) {
        return this.account(token).balance();
    }

    /**
     * A transaction stream
     *
     * @param {String} token
     * @returns {TransactionStream}
     */
    async transactionStream(token) {
        return this.account(token).transactionStream();
    }

    /**
     * Trading assets including multiple underlyings and trading times
     *
     * @returns {Assets}
     */
    async assets() {
        const assets = new Assets(this);

        await assets.init();

        return assets;
    }

    /**
     * Website status stream
     *
     * @returns {WebsiteStatusStream}
     */
    async websiteStatusStream() {
        const website_status_stream = new WebsiteStatusStream(this);

        await website_status_stream.init();

        return website_status_stream;
    }

    /**
     * Changes the account to the given account
     *
     * @param {Account} account - Account to authenticate API with
     *
     * @returns {Promise<Account>} Authenticated account
     */
    async changeAccount(account) {
        this.auth_account = await this.account(account.token);

        return this.auth_account;
    }
}
