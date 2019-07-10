import Immutable from '../Types/Immutable';
import FullName from '../Types/FullName'; /* eslint-disable-line no-unused-vars */
import DateRange from '../Types/DateRange'; /* eslint-disable-line no-unused-vars */
import DurationRange from '../Types/DurationRange'; /* eslint-disable-line no-unused-vars */

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
 * @property {String[]} contractTypes
 * @property {Durations} durations - Durations for spot and forward starting contracts
 * @property {DurationUnits} durationUnits - Duration units for spot and forward starting contracts
 * @property {DateRange[]} forwardSessions
 * @property {Boolean} isForwardStarting
 */
export default class ContractGroup extends Immutable {}
