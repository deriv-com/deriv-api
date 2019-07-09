import Immutable from '../Types/Immutable';

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
        return Promise.resolve(undefined);
    }

    /** @returns {Account} all the sibling accounts */
    get siblings() {
        return [];
    }

    /** @returns {Contract[]} A list of all open contracts */
    get openContracts() {
        return [];
    }

    /** @returns {Contract[]} A list of all closed contracts */
    get closedContracts() {
        return [];
    }

    /** Switches to this account */
    switch() {
        this.api.changeAccount(this);
    }
}
