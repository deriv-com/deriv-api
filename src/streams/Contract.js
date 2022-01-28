import { first, map }   from 'rxjs/operators';

import CustomDate       from '../fields/CustomDate';
import FullName         from '../fields/FullName';
import MarketValue      from '../fields/MarketValue';
import Monetary         from '../fields/Monetary';
import Profit           from '../fields/Profit';
import Spot             from '../fields/Spot';
import Buy              from '../immutables/Buy';
import Sell             from '../immutables/Sell';
import Tick             from '../immutables/Tick';
import Stream           from '../types/Stream';
import { mapApiFields } from '../utils';

const field_mapping = {
    expiry_time: 'date_expiry',
    start_time : 'date_start',
};

/**
 * @typedef {Object} ContractParam
 *
 * @property {String}        contract_type
 * @property {Number}        amount
 * @property {String}        barrier
 * @property {String}        barrier2
 * @property {Number|Date}   expiry_time   epoch in seconds or {@link Date}
 * @property {Number|Date}   start_time    epoch in seconds or {@link Date}
 * @property {String=}       Currency      Default is the account currency
 * @property {String}        basis         stake or payout
 * @property {Number|String} duration      duration with unit or duration in number
 * @property {String=}       duration_unit duration unit, required if duration is number
 * @property {String=}       product_type  'multi_barrier' or 'basic'
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
 * @param {DerivAPI}      api
 * @param {ContractParam} options
 *
 * @property {String}       status              'proposal', 'open', 'expired', 'sold', 'won', 'lost'
 * @property {Monetary}     ask_price           Price to pay to buy a contract
 * @property {String}       type                contract type
 * @property {Monetary}     payout              Potential or realized payout
 * @property {String}       longcode
 * @property {String}       symbol
 * @property {String}       currency
 * @property {Spot}         current_spot
 * @property {CustomDate}   start_time          Start time of the contract (estimated for proposal)
 * @property {Monetary=}    buy_price           (After buy)
 * @property {Monetary=}    bid_price           (After buy)
 * @property {Monetary=}    sell_price          (After sell)
 * @property {Profit=}      profit              Potential or realized profit (After buy)
 * @property {Number=}      proposal_id         The proposal ID used to buy
 * @property {Number=}      id                  The contract ID (After buy)
 * @property {CustomDate=}  purchase_time       (After buy)
 * @property {CustomDate=}  expiry_time         (After buy)
 * @property {CustomDate=}  sell_time           (After sell)
 * @property {Number=}      barrier_count       (For contracts with barrier)
 * @property {MarketValue=} high_barrier        (For contracts with two barriers)
 * @property {MarketValue=} low_barrier         (For contracts with two barriers)
 * @property {MarketValue=} barrier             (For contracts with one barrier)
 * @property {Number=}      tick_count          (For tick contracts)
 * @property {Tick[]=}      ticks               (For tick contracts)
 * @property {Number=}      multiplier          (For loopback contracts)
 * @property {String=}      shortcode
 * @property {String=}      validation_error
 * @property {Boolean=}     is_forward_starting
 * @property {Boolean=}     is_intraday
 * @property {Boolean=}     is_path_dependent
 * @property {Boolean=}     is_valid_to_sell    We still allow a sell call, let API handle the error
 * @property {Boolean=}     is_expired
 * @property {Boolean=}     is_settleable
 * @property {Boolean=}     is_open             Is this contract still open
 * @property {Spot=}        entry_spot
 * @property {Spot=}        exit_spot
 * @property {Object=}      audit_details
 * @property {FullName=}    code                only if both short and long codes are available
 */
export default class Contract extends Stream {
    constructor(api, options) {
        super({ api, options });
    }

    // Called by the API to initialize the instance
    async init({ currency, symbol } = {}) {
        const contract_param = mapApiFields({ ...this.options }, field_mapping);

        const request = {
            currency,
            symbol,
            proposal: 1,
            ...contract_param,
        };

        const { active_symbols } = (await this.api.basic.cache.activeSymbols('brief'));
        this._data.active_symbol = active_symbols.find((s) => s.symbol === request.symbol);

        this._data.type     = request.contract_type;
        this._data.symbol   = new FullName(request.symbol, this._data.active_symbol.display_name);
        this._data.currency = request.currency;

        this.addSource(this.api.basic.subscribe(request).pipe(
            map((p) => proposalToContract(p, {
                ...request,
                ...this.active_symbol,
                lang: this.api.basic.lang,
            })),
        ));

        this._data.status = 'proposal';

        this.beforeUpdate((contract) => {
            const { is_expired } = contract;

            if (is_expired) {
                this.api.basic.sellExpired().catch(() => {}); // Ignore failures
            }

            Object.assign(this._data, contract);
        });

        await this.beforeUpdate().pipe(first()).toPromise();
    }

    /**
     * Buys this contract
     *
     * @param {BuyParam} buy
     * @returns {Buy}
     */
    async buy({ max_price: price = this.ask_price.value } = {}) {
        const { buy } = await this.api.basic.buy({ buy: this.proposal_id, price });

        const wrappedBuy = new Buy(buy, this.currency, this.api.basic.lang);

        this._data.id              = wrappedBuy.contract_id;
        this._data.buy_transaction = wrappedBuy.transaction_id;
        this._data.buy_price       = wrappedBuy.price;

        [
            'purchase_time',
            'start_time',
            'payout',
            'longcode',
            'shortcode',
            'code',
        ].forEach((field) => {
            this._data[field] = wrappedBuy[field];
        });

        this._data.status = 'open';

        this.addSource(this.api.basic.subscribe({
            proposal_open_contract: 1,
            contract_id           : buy.contract_id,
        }).pipe(
            map((o) => openContractToContract(o, this.active_symbol.pip, this.api.basic.lang)),
        ));

        return wrappedBuy;
    }

    /**
     * Sells this contract
     *
     * @param {SellParam} sell zero price means sell at market
     * @returns {Sell}
     */
    async sell({ max_price: price = 0 } = {}) {
        const { sell } = await this.api.basic.sell({ sell: this.id, price });

        const wrappedSell = new Sell(sell, this.currency, this.api.basic.lang);

        this._data.sell_transaction = wrappedSell.transaction_id;
        this._data.sell_price       = wrappedSell.price;

        this._data.status  = 'sold';
        this._data.is_sold = true;

        return wrappedSell;
    }

    get is_open() {
        return this._data.status === 'open';
    }
}

function proposalToContract({ proposal }, { currency, pip, lang }) {
    return {
        ask_price   : new Monetary(proposal.ask_price, currency, lang),
        start_time  : new CustomDate(proposal.date_start),
        longcode    : proposal.longcode,
        payout      : new Monetary(proposal.payout, currency, lang),
        current_spot: new Spot(proposal.spot, pip, proposal.spot_time),
        proposal_id : proposal.id,
        status      : 'proposal',
    };
}

function openContractToContract({ proposal_open_contract: poc }, pip, lang) {
    const toBarrier = (value) => new MarketValue(value, pip);
    const toMoney   = (value) => new Monetary(value, poc.currency, lang);
    const toProfit  = (value, percentage) => new Profit(value, poc.currency, percentage);
    const toSpot    = (value, time) => new Spot(value, pip, time);
    const toTime    = (time) => new CustomDate(time);

    return {
        is_expired         : !!poc.is_expired,
        is_forward_starting: !!poc.is_forward_starting,
        is_intraday        : !!poc.is_intraday,
        is_path_dependent  : !!poc.is_path_dependent,
        is_settleable      : !!poc.is_settleable,
        is_sold            : !!poc.is_sold,
        is_valid_to_sell   : !!poc.is_valid_to_sell,
        status             : poc.status,
        validation_error   : poc.validation_error,
        barrier            : toBarrier(poc.barrier),
        high_barrier       : toBarrier(poc.high_barrier),
        low_barrier        : toBarrier(poc.low_barrier),
        bid_price          : toMoney(poc.bid_price),
        payout             : toMoney(poc.payout),
        sell_price         : toMoney(poc.sell_price),
        profit             : toProfit(poc.profit, poc.profit_percentage),
        current_spot       : toSpot(poc.current_spot, poc.current_spot_time),
        entry_spot         : toSpot(poc.entry_tick, poc.entry_tick_time),
        exit_spot          : toSpot(poc.exit_spot, poc.exit_spot_time),
        sell_spot          : toSpot(poc.sell_spot, poc.sell_spot_time),
        expiry_time        : toTime(poc.date_expiry),
        start_time         : toTime(poc.date_start),
        sell_time          : toTime(poc.sell_time),
        ticks              : wrapPocTicks(poc.tick_stream, pip),
        multiplier         : poc.multiplier,
        tick_count         : poc.tick_count,
        barrier_count      : poc.barrier_count,
        audit_details      : poc.audit_details,
        buy_transaction    : poc.transaction_ids.buy,
        sell_transaction   : poc.transaction_ids.sell,
    };
}

// eslint-disable-next-line default-param-last
function wrapPocTicks(ticks = [], pip) {
    return ticks.map(({ epoch, tick: quote }) => new Tick({ epoch, quote }, pip));
}
