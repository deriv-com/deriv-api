import Moment from 'moment';
import Immutable from './Immutable';

/**
 * An alternative date object
 *
 * @param {CustomDate|Date|Number} date
 */
export default class CustomDate extends Immutable {
    constructor(date) {
        super({ date: new Moment(date) });
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
}
