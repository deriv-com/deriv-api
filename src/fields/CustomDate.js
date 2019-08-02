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
 * @property {Number} epoch_milliseconds
 * @property {Date} date
 */
export default class CustomDate extends Immutable {
    constructor(date) {
        super();
        this._data.internal = this.wrapDate(date);
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isBefore(date) {
        return this._data.internal.isBefore(this.wrapDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrAfter(date) {
        return this._data.internal.isSameOrAfter(this.wrapDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrBefore(date) {
        return this._data.internal.isSameOrBefore(this.wrapDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isAfter(date) {
        return this._data.internal.isAfter(this.wrapDate(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSame(date) {
        return this._data.internal.isSame(this.wrapDate(date));
    }

    wrapDate(arg) {
        let date = arg;

        date = typeof date === 'string' ? date * 1 : date;

        if (typeof date === 'number') return dayjs(!isInMiliSeconds(date) ? date * 1000 : date);

        if (date instanceof Date) return dayjs(date);

        if (date instanceof dayjs) return date;

        if (date instanceof this.constructor) return date.internal;

        if (date === undefined) return dayjs();

        throw new Error(`Unknown date of type: ${typeof date} is given`);
    }

    /**
     * Adds a duration to the current date
     *
     * @param {Duration|Object} duration - Accepts { value: ..., unit: ... }
     *
     * @returns {CustomDate}
     */
    addDuration(duration) {
        return this._data.internal.add(duration.value, duration.unit);
    }

    get epoch_milliseconds() {
        return this._data.internal.valueOf();
    }

    get epoch() {
        return this._data.internal.unix();
    }

    get date() {
        return this._data.internal.toDate();
    }
}
