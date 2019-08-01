import Immutable  from '../types/Immutable';

/**
 * @typeof {Object} DateRange
 *
 * @property {CustomDate} min
 * @property {CustomDate} max
 */

/**
 * @typeof {Object} ContractDuration
 *
 * @property {CustomDate} min
 * @property {CustomDate} max
 * @property {Object} barriers
 * @property {Barrier} barriers.high
 * @property {Barrier} barriers.low
 * @property {Barrier} barriers.single
 */

/**
 * @typeof {Object} ContractCategory
 *
 * @property {FullName} name
 * @property {String[]} contract_types
 * @property {String[]} bases
 * @property {Object} forward_starting
 * @property {DateRange} forward_starting.1564531200
 * @property {Object} expiry_types
 * @property {DateRange} expiry_types.end_time
 * @property {ContractDuration} expiry_types.duration
 */

/**
 * Abstract objects for options needed to create a contract
 *
 * @property {Object} categories
 * @property {ContractCategory} categories.higher_lower
 * @property {Object} currencies
 * @property {String} currencies.usd Example
 *
 */
export default class ContractOptions extends Immutable {}
