import Immutable from '../Types/Immutable';
import FullName from '../Types/FullName'; /* eslint-disable-line no-unused-vars */
import Balance from '../Streams/Balance'; /* eslint-disable-line no-unused-vars */
import TransactionStream from '../Streams/TransactionStream'; /* eslint-disable-line no-unused-vars */

/**
 * Abstract class for user accounts
 *
 * @example
 * const account = await api.accounts(yourToken);
 *
 * // Returns the open contracts of this account
 * const openContracts = account.openContracts();
 *
 * const siblings = account.siblings;
 *
 * // Switches the API account to the first sibling
 * siblings[0].switch();
 *
 * @param {DerivAPI} api
 * @param {String} token
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

    /** @returns {Account} all the sibling accounts */
    get siblings() {
        return this._data.siblings;
    }

    /** @returns {Contract[]} A list of all open contracts */
    get openContracts() {
        return this._data.contracts.filter(c => c.isOpen);
    }

    /** @returns {Contract[]} A list of all closed contracts */
    get closedContracts() {
        return this._data.contracts.filter(c => !c.isOpen);
    }

    /** @returns {Balance} - A stream of balance */
    balance() {
        return this._data.balance;
    }

    /** @returns {String} */
    get loginid() {
        return this._data.loginid;
    }

    /** @returns {String[]} - A list of all status codes */
    get statusCodes() {
        return this._data.statusCodes;
    }

    /** @returns {FullName} - Name of the landing company */
    get landingCompany() {
        return this._data.landingCompany;
    }

    /** @returns {String[]} - A list of available API tokens */
    get apiTokens() {
        return this._data.apiTokens;
    }

    /** @returns {TransactionStream} - A stream of transactions * */
    transactionStream() {
        return this._data.transactionStream;
    }

    /** Switches to this account */
    switch() {
        this.api.changeAccount(this);
    }
}
