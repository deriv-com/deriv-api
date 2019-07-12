import '../Streams/Balance';
import '../Streams/TransactionStream';
import '../Types/FullName';
import Contract          from '../Streams/Contract';
import Immutable         from '../Types/Immutable';

/**
 * Abstract class for user accounts
 *
 * @example
 * const account = await api.accounts(your_token);
 *
 * // Returns the open contracts of this account
 * const open_contracts = account.open_contracts;
 *
 * const siblings = account.siblings;
 *
 * // Switches the API account to the first sibling
 * siblings[0].switch();
 *
 * @param {DerivAPI} api
 * @param {String} token
 *
 * @property {Account[]} siblings
 * @property {Boolean} is_authenticated - If A_p_i is authenticated with this account
 * @property {Contract[]} contracts
 * @property {Contract[]} open_contracts
 * @property {Contract[]} closed_contracts
 * @property {Balance} balance
 * @property {String} loginid
 * @property {String} currency
 * @property {String[]} status_codes
 * @property {Full_name} landing_company
 * @property {String[]} api_tokens
 * @property {Transaction_stream} transaction_stream
 */
export default class Account extends Immutable {
    // Called by the API to initialize the instance
    async init() {
        /*
         * this.balance = new Balance(this.api)
         * await this.balance.init()
         */
        return this;
    }

    /**
     * A contract object with latest status and ability to buy/sell
     *
     * @param {ContractsParam} options - parameters defining the contract
     * @returns {Contract}
     */
    async contract(options) {
        const contract = new Contract(this.api, { currency: this.currency, ...options });

        await contract.init();

        return contract;
    }

    /** Switches to this account */
    async switch() {
        return this.api.changeAccount(this);
    }
}
