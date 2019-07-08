import Stream from '../Types/Stream';

/**
 * @typedef {Object} ContractsParam
 * @property {String} contractType
 * @property {Number} amount
 * @property {String} barrier
 * @property {String} barrier2
 * @property {Number|Date} dateExpiry - epoch in seconds or {@link Date}
 * @property {Number|Date} dateStart - epoch in seconds or {@link Date}
 * @property {String=} Currency - Default is the account currency
 * @property {String} basis - stake or payout
 * @property {Number|String} duration - duration with unit or duration in number
 * @property {String=} durationUnit - duration unit, required if duration is number
 * @property {String=} productType - 'multi_barrier' or 'basic'
 */

/**
 * Abstract class for contracts
 */
export default class Contract extends Stream {
    /**
     * @param {DerivAPI} api
     * @param {ContractsParam} options
     */
    constructor(api, options) {
    }
}
