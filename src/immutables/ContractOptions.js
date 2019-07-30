import '../inputs/BarrierInput';
import '../inputs/CustomDateInput';
import '../inputs/DurationInput';
import '../inputs/MonetaryInput';
import Immutable  from '../types/Immutable';

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
 * Abstract objects for options needed to create a contract
 *
 * @property {Object} categories                                Contract categories
 * @property {ContractOptions} contract_categories.higher_lower Example of a contract category

 * @property {Object} expiry_types
 * @property {ContractOptions} expiry_types.duration
 * @property {ContractOptions} expiry_types.end_time

 * @property {Object} start_sessions
 * @property {Object} start_sessions.now                        Start from now
 * @property {Object} start_sessions['Tue - 30 Jul, 2019']      Example of a start time (not meant to be used directly)

 * @property {Object} duration_units
 * @property {ContractOptions} duration_units.ticks
 * @property {ContractOptions} duration_units.seconds
 * @property {ContractOptions} duration_units.minutes
 * @property {ContractOptions} duration_units.hours
 * @property {ContractOptions} duration_units.days

 * @property {Object} currencies
 * @property {ContractOptions} currencies.usd                   An example of a currency option

 * @property {Object} bases
 * @property {ContractOptions} bases.stake
 * @property {ContractOptions} bases.payout
 *
 * @property {String} contract_type
 * @property {String} start_type                                'spot' or 'forward'
 * @property {Boolean} is_forward_starting                      start_type === 'forward'
 * @property {String} start_session                             Name of the session (keys of start_sessions)
 * @property {CustomDateInput} start_time
 * @property {String} expiry_type                               'duration', 'date'
 * @property {Boolean} is_date_expiry                           expiry_type === 'date'
 * @property {CustomDateInput} expiry_time
 * @property {DurationInput} duration
 * @property {String} basis
 * @property {MonetaryInput} amount
 * @property {Number} digit                                     For digit contracts (can be set)
 * @property {String} symbol                                    Contract symbol

 * @property {Object} barriers Available barriers
 * @property {BarrierInput} barriers.high
 * @property {BarrierInput} barriers.low
 * @property {BarrierInput} barriers.single
 * @property {Number} barriers.count
 *
 * @property {Object} contract_param                            Request object to send to API
 */
export default class ContractOptions extends Immutable {
    get contract_param() {
        const param = {
            proposal     : 1,
            contract_type: this._data.contract_type,
            amount       : this._data.amount.value,
            currency     : this._data.amount.currency,
            basis        : this._data.basis,
        };

        if (this._data.is_date_expiry) {
            param.date_expiry = this._data.expiry_time;
        } else {
            param.duration      = this._data.duration.value;
            param.duration_unit = this._data.duration.unit;
        }

        if (this._data.is_forward_starting) {
            param.date_start = this._data.start_time;
        }

        if (this._data.barriers.count === 1) {
            param.barrier = this._data.barriers.single;
        } else if (this._data.barriers.count === 2) {
            param.barrier  = this._data.barriers.high;
            param.barrier2 = this._data.barriers.low;
        }

        return param;
    }
}
