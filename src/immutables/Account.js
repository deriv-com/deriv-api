import FullName        from '../fields/FullName';
import Balance         from '../streams/Balance';
import Transactions    from '../streams/Transactions';
import Immutable       from '../types/Immutable';

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
 * // The existing account instance is not authorized anymore and should be discarded
 * const sibling = await api.account(loginidToToken(siblings[0].loginid));
 *
 * @param {DerivAPI} api
 * @param {String}   token
 *
 * @property {String}          loginid
 * @property {String}          user_id
 * @property {String}          email
 * @property {String}          country
 * @property {String}          currency
 * @property {String}          risk
 * @property {Boolean}         show_authentication
 * @property {FullName}        landing_company
 * @property {Balance}         balance
 * @property {Transactions}    transactions
 * @property {String[]}        status_codes
 * @property {Object[]}        siblings
 * @property {Contract[]}      contracts
 * @property {Contract[]}      open_contracts
 * @property {Contract[]}      closed_contracts
 * @property {String[]}        api_tokens
 */
export default class Account extends Immutable {
    constructor(api, token) {
        super({ api, token });
    }

    // Called by the API to initialize the instance
    async init() {
        const { authorize } = await this.api.basic.authorize(this.token);

        ['email', 'country', 'currency', 'loginid', 'user_id', 'fullname'].forEach((field) => {
            this._data[field] = authorize[field];
        });

        this._data.status_codes = authorize.status;
        this._data.siblings     = authorize.account_list;

        this._data.contracts = [];

        const { landing_company_name, landing_company_fullname } = authorize;

        this._data.landing_company = new FullName(
            landing_company_name,
            landing_company_fullname,
        );

        const { get_account_status } = await this.api.basic.getAccountStatus();

        this._data.risk = get_account_status.risk_classification;
        // eslint-disable-next-line eqeqeq
        this._data.show_authentication = get_account_status.prompt_client_to_authenticate == 1;
        this._data.status_codes        = get_account_status.status;

        this._data.balance = new Balance(this.api);

        const { balance, currency } = authorize;

        this._data.balance.init({ balance, currency });

        this._data.transactions = new Transactions(this.api);
        this._data.transactions.init();
    }
}
