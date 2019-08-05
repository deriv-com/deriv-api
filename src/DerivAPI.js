import DerivAPIBasic   from './deriv_api/DerivAPIBasic';
import Account         from './immutables/Account';
import Assets          from './immutables/Assets';
import ContractOptions from './immutables/ContractOptions';
import Underlying      from './immutables/Underlying';
import Candles         from './streams/Candles';
import Contract        from './streams/Contract';
import Ticks           from './streams/Ticks';
import WebsiteStatus   from './streams/WebsiteStatus';

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
 * // Access to low-level API
 * const api_basic = api.basic;
 *
 * @param {Object} options - For options details see: {@link DerivAPIBasic}
 *
 * @property {DerivAPIBasic} basic - Basic API, used for making low-level calls to the API
 */
export default class DerivAPI {
    constructor(...options) {
        this.basic = new DerivAPIBasic(...options);
    }

    /**
     * Provides a ticks stream and a list of available ticks
     *
     * @param {String|TicksParam} options - symbol or a ticks parameter object
     * @returns {Promise<Ticks>}
     */
    async ticks(options) {
        const ticks = new Ticks(this, options);

        await ticks.init();

        return ticks;
    }

    /**
     * Provides a list of available candles with the default granularity
     *
     * @param {String|CandlesParam} options - symbol or a candles parameter object
     * @returns {Promise<Candles>}
     */
    async candles(options) {
        const candles = new Candles(this, options);

        await candles.init();

        return candles;
    }

    /**
     * A contract object with latest market values, cannot be bought or sold
     *
     * @param {ContractParam} options - parameters defining the contract
     * @returns {Promise<Contract>}
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
     * @returns {Promise<Underlying>}
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
     * @returns {Promise<Account>}
     */
    async account(token) {
        const account = new Account(this, token);

        await account.init();

        return account;
    }

    /**
     * Trading assets including multiple underlyings and trading times
     *
     * @returns {Promise<Assets>}
     */
    async assets() {
        const assets = new Assets(this);

        await assets.init();

        return assets;
    }

    /**
     * Website status stream
     *
     * @returns {Promise<WebsiteStatus>}
     */
    async websiteStatus() {
        const website_status = new WebsiteStatus(this);

        await website_status.init();

        return website_status;
    }

    /**
     * Request contract options to display in UI
     *
     * @returns {Promise<ContractOptions>}
     */
    async contractOptions(symbol) {
        const contract_options = new ContractOptions(this, symbol);

        await contract_options.init();

        return contract_options;
    }
}
