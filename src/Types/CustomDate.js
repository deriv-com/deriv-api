import Moment              from 'moment';

import { isInMiliSeconds } from '../utils';

import Immutable           from './Immutable';

/**
 * An alternative date object
 *
 * @param {CustomDate|Date|Number} date
 */
export default class CustomDate extends Immutable {
    constructor(date) {
        const miliseconds = typeof date === 'number' && !isInMiliSeconds(date) ? date * 1000 : date;

        super({ date: new Moment(miliseconds) });
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isBefore(date) {
        return this.date.isBefore(date);
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrAfter(date) {
        return this.date.isSameOrAfter(date);
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrBefore(date) {
        return this.date.isSameOrBefore(date);
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isAfter(date) {
        return this.date.isAfter(date);
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSame(date) {
        return this.date.isSame(date);
    }
}
