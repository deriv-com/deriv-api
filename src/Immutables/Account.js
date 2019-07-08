import Immutable from '../Types/Immutable';

/** Abstract class for user accounts */
export default class Account extends Immutable {
    /**
     * @param {DerivAPI} api
     * @param {String} token
     */
    constructor(api, token) {
        super();
        this.api   = api;
        this.token = token;
    }

    // Called by the API to initialize the instance
    async init() {
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
        this.api.changeAccount();
    }
}
