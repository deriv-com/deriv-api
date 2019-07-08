import Stream from '../Types/Stream';

/**
 * @typedef {Object} Range
 * @property {Number|Date} start - An epoch in seconds or a Date object
 * @property {Number|Date} end -  An epoch in seconds or a Date object
 */

/**
 * @typedef {Object} TicksParam
 * @property {Range} range - A chunk of history to return with start and end time
 * @property {Number} count - Number of ticks returned by history
 * @property {String} symbol - The ticks symbol
 */

/**
 * Abstract class for ticks
 */
export default class TicksContainer extends Stream {
    /**
     * @param {DerivAPI} api
     * @param {TicksParam} options
     */
    constructor(api, options) {
    }

    /**
     * @param {TicksParam=} options
     * @returns {Tick[]}
     */
    history() {
    }
}
