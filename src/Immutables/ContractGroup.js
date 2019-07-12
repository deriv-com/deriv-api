import '../Types/DateRange';
import '../Types/DurationRange';
import '../Types/FullName';
import Immutable     from '../Types/Immutable';

/**
 * @typedef {Object} SpotDurations
 *
 * @property {DurationRange} daily
 * @property {DurationRange} intraday
 * @property {DurationRange} tick
 */

/**
 * @typedef {Object} ForwardDurations
 *
 * @property {DurationRange} intraday
 */

/**
 * @typedef {Object} Durations
 *
 * @property {SpotDurations} spot
 * @property {ForwardDurations} forward
 */

/**
 * @typedef {Object} DurationUnits
 *
 * @property {FullName} spot
 * @property {FullName} forward
 */

/**
 * A container for contract group info
 *
 * @property {String} name
 * @property {Number[]} barriers
 * @property {String} basis - 'stake' or 'payout'
 * @property {String[]} contract_types
 * @property {Durations} durations - Durations for spot and forward starting contracts
 * @property {DurationUnits} duration_units - Duration units for spot and forward starting contracts
 * @property {DateRange[]} forward_sessions
 * @property {Boolean} is_forward_starting
 */
export default class ContractGroup extends Immutable {}
