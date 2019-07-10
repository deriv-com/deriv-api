import Immutable from '../Types/Immutable';
import FullName from '../Types/FullName'; /* eslint-disable-line no-unused-vars */
import Balance from '../Streams/Balance'; /* eslint-disable-line no-unused-vars */
import TransactionStream from '../Streams/TransactionStream'; /* eslint-disable-line no-unused-vars */
import Contract         from '../Streams/Contract';

/**
 * Abstract class for user accounts
 *
 * @example
 * const account = await api.accounts(yourToken);
 *
 * // Returns the open contracts of this account
 * const openContracts = account.openContracts;
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
 * @property {Contract[]} contracts
 * @property {Contract[]} openContracts
 * @property {Contract[]} closedContracts
 * @property {Balance} balance
 * @property {String} loginid
 * @property {String} currency
 * @property {String[]} statusCodes
 * @property {FullName} landingCompany
 * @property {String[]} apiTokens
 * @property {TransactionStream} transactionStream
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
    switch() {
        this.api.changeAccount(this);
    }
}
