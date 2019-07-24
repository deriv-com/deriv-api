import isSameOrAfter       from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore      from 'dayjs/plugin/isSameOrBefore';
import dayjs               from 'dayjs';

import Immutable           from '../types/Immutable';

import { isInMiliSeconds } from '../utils';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * An alternative date object
 *
 * @param {CustomDate|Date|Number} date
 *
 * @property {Number} epoch
 * @property {Number} epoch_miliseconds
 */
export default class CustomDate extends Immutable {
    constructor(date) {
        super({ date: dayjs(standardizeDate(date)) });
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isBefore(date) {
        return this.date.isBefore(standardizeDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrAfter(date) {
        return this.date.isSameOrAfter(standardizeDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrBefore(date) {
        return this.date.isSameOrBefore(standardizeDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isAfter(date) {
        return this.date.isAfter(standardizeDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSame(date) {
        return this.date.isSame(standardizeDate(date));
    }

    get epoch_miliseconds() {
        return this.date.valueOf();
    }

    get epoch() {
        return this.date.unix();
    }
}

function standardizeDate(arg) {
    let date = arg;

    date = typeof date === 'string' ? date * 1 : date;

    if (typeof date === 'number') return !isInMiliSeconds(date) ? date * 1000 : date;

    if (date instanceof CustomDate) return date.date;

    if (date instanceof Date) return date;

    if (date instanceof dayjs) return date;

    if (date === undefined) return date;

    throw new Error(`Unknown date of type: ${typeof date} is given`);
}
