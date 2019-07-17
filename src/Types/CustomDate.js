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
        super({ date: new Moment(toMiliseconds(date)) });
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isBefore(date) {
        return this.date.isBefore(toMiliseconds(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrAfter(date) {
        return this.date.isSameOrAfter(toMiliseconds(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSameOrBefore(date) {
        return this.date.isSameOrBefore(toMiliseconds(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isAfter(date) {
        return this.date.isAfter(toMiliseconds(date));
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isSame(date) {
        return this.date.isSame(toMiliseconds(date));
    }
}

function toMiliseconds(date) {
    return typeof date === 'number' && !isInMiliSeconds(date) ? date * 1000 : date;
}
