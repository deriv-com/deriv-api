import Barrier        from '../fields/Barrier';
import DateRange      from '../fields/DateRange';
import DurationRange  from '../fields/DurationRange';
import FullName       from '../fields/FullName';
import Immutable      from '../types/Immutable';

/**
 * @typedef {Object} ExpiryType
 *
 * @property {DurationRange} duration
 * @property {Object} barriers
 * @property {Barrier} barriers.high
 * @property {Barrier} barriers.low
 * @property {Barrier} barriers.single
 */

/**
 * @typedef {Object} ContractCategory
 *
 * @property {FullName} name
 * @property {Boolean} has_end_time - Is end time available for the contract (hardcoded X) )
 * @property {String[]} contract_types
 * @property {String[]} bases
 * @property {Object} forward_starting
 * @property {DateRange} forward_starting.1564531200
 * @property {ExpiryType} expiry_types
 */

/**
 * Abstract objects for options needed to create a contract
 *
 * @property {Object} categories
 * @property {ContractCategory} categories.higherlower
 * @property {Object} currencies
 * @property {String} currencies.usd Example
 *
 */
export default class ContractOptions extends Immutable {
    constructor(api, symbol) {
        super({ api, symbol });
    }

    async init() {
        const { contracts_for } = await this.api.basic.cache.contractsFor(this.symbol);

        const { active_symbols } = await this.api.basic.cache.activeSymbols('brief');
        const { pip }            = active_symbols.find((seconds) => seconds.symbol === this.symbol);

        const { payout_currencies } = await this.api.basic.cache.payoutCurrencies();

        this._data.currencies = payout_currencies;

        this._data.categories = groupByCategories(contracts_for.available, pip);
    }
}

function groupByCategories(contracts_for, pip) {
    return contracts_for.reduce((by_category, info) => {
        const category_full_name       = getCategoryName(info);
        const { short: category_code } = category_full_name;

        if (!by_category[category_code]) {
            by_category[category_code] = {
                name            : category_full_name,
                contract_types  : [],
                bases           : ['stake', 'payout'],
                forward_starting: {},
                expiry_types    : {},
            };
        }

        const category = by_category[category_code];

        if (!category.contract_types.includes(info.contract_type)) {
            category.contract_types.push(info.contract_type);
        }

        if (info.forward_starting_options) {
            category.forward_starting = Object.values(info.forward_starting_options)
                .map(({ open, close }) => new DateRange(open, close))
                .reduce((forward_starting, range) => {
                    forward_starting[range.min.epoch] = range;
                    return forward_starting;
                }, {});
        }
        const expiry_type = {
            duration: new DurationRange(info.min_contract_duration, info.max_contract_duration),
            barriers: getBarriers(info, pip),
        };

        if (info.expiry_type === 'tick') {
            category.expiry_types.ticks = expiry_type;
        } else if (info.expiry_type === 'intraday') {
            ['seconds', 'minutes', 'hours'].forEach((u) => {
                category.expiry_types[u] = expiry_type;
            });
        } else if (info.expiry_type === 'daily') {
            category.expiry_types.days = expiry_type;
        }

        return by_category;
    }, {});
}

function getCategoryName({ contract_category, contract_category_display, barriers }) {
    if (contract_category === 'callput') {
        return barriers === 0
            ? new FullName('risefall', 'Rise/Fall')
            : new FullName('higherlower', 'Higher/Lower');
    }
    return new FullName(contract_category, contract_category_display);
}

function getBarriers({
    barriers: count, high_barrier, low_barrier, barrier,
}, pip) {
    const barriers = {
        count,
    };

    if (count === 1) {
        barriers.single = new Barrier(barrier, pip);
    } else if (count === 2) {
        barriers.high = new Barrier(high_barrier, pip);
        barriers.low  = new Barrier(low_barrier, pip);
    }

    return barriers;
}
