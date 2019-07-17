import '../Immutables/Sell';

import { first, map }             from 'rxjs/operators';

import Buy                        from '../Immutables/Buy';
import CustomDate                 from '../Types/CustomDate';
import Monetary                   from '../Types/Monetary';
import Spot                       from '../Types/Spot';
import Stream                     from '../Types/Stream';

import { mapApiFields }           from '../utils';

const field_mapping = {
    expiry_time: 'date_expiry',
    start_time : 'date_start',
};

/**
 * @typedef {Object} ContractParam
 * @property {String} contract_type
 * @property {Number} amount
 * @property {String} barrier
 * @property {String} barrier2
 * @property {Number|Date} expiry_time - epoch in seconds or {@link Date}
 * @property {Number|Date} start_time - epoch in seconds or {@link Date}
 * @property {String=} Currency - Default is the account currency
 * @property {String} basis - stake or payout
 * @property {Number|String} duration - duration with unit or duration in number
 * @property {String=} duration_unit - duration unit, required if duration is number
 * @property {String=} product_type - 'multi_barrier' or 'basic'
 * @property {Account=} account - The account that has this contract
 */

/**
 * Abstract class for contracts
 *
 * @example
 * const contract = account.contract({ contract_type: 'CALL', ...options })
 *
 * const buy = await contract.buy();
 *
 * contract.onUpdate().subscribe(console.log)
 *
 * @param {DerivAPI} api
 * @param {ContractParam} request
 *
 * @property {String} status - Current status of the contract
 * @property {Monetary} sell_price - Price at which the contract was sold
 * @property {Monetary} buy_price - Price at which the contract was bought
 * @property {Monetary} ask_price - Price of the current contract proposal
 * @property {String} type - contract type
 * @property {Monetary} potential_payout - The payout value before the contract was sold
 * @property {Monetary} payout - The payout after selling the contract
 * @property {Number} id - The contract ID after purchase
 * @property {CustomDate} purchase_time - Time of purchase
 * @property {CustomDate} start_time - Start time of the contract (estimated for proposal)
 * @property {Boolean} is_expired
 * @property {Boolean} is_open
 * @property {String} longcode
 * @property {String} shortcode
 * @property {FullName} code - contains long and short code
 */
export default class Contract extends Stream {
    constructor(api, request) {
        super({ api, request });
    }

    // Called by the API to initialize the instance
    async init({ currency, symbol } = {}) {
        const request = mapApiFields({
            currency,
            symbol,
            proposal: 1,
            ...this.request,
        }, field_mapping);

        const { active_symbols } = (await this.api.cache.activeSymbols('brief'));
        const active_symbol      = active_symbols.find(s => s.symbol === request.symbol);

        const proposals = this.api.subscribe(request);

        this._data.on_update = proposals.pipe(
            map(p => proposalToContract(p, { ...request, ...active_symbol })),
        );

        this._data.status  = 'proposal';
        this._data.is_open = false;

        this.onUpdate((proposal) => {
            Object.assign(this._data, proposal);
        });

        await this.onUpdate().pipe(first()).toPromise();
    }

    /**
     * Buys this contract
     *
     * @param {BuyParam} buy
     * @returns {Buy}
     */
    async buy({ max_price: price = this.ask_price.value } = {}) {
        const { buy } = await this.api.buy({ buy: this.id, price });

        const wrappedBuy = new Buy(buy, this.currency);

        this._data.id = wrappedBuy.contract_id;

        [
            'purchase_time',
            'start_time',
            'transaction_id',
            'buy_price',
            'payout',
            'longcode',
            'shortcode',
            'code',
        ].forEach((field) => {
            this._data[field] = wrappedBuy[field];
        });

        this._data.status  = 'open';
        this._data.is_open = true;

        return wrappedBuy;
    }

    /**
     * Sells this contract
     *
     * @param {SellParam} sell
     * @returns {Sell}
     */
    async sell({ max_price: price }) {
        return this.api.sell({ sell: this.id, price });
    }
}

function proposalToContract({ proposal }, { currency, pip }) {
    return {
        ask_price : new Monetary(proposal.ask_price, currency),
        start_time: new CustomDate(proposal.date_start),
        longcode  : proposal.longcode,
        payout    : new Monetary(proposal.payout, currency),
        spot      : new Spot(proposal.spot, pip, proposal.spot_time),
    };
}
