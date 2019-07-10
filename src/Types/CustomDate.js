import Immutable from './Immutable';

/** An alternative date object */
export default class CustomDate extends Immutable {
    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isBefore(date) {
        return this.epoch < date.epoch;
    }

    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isAfter(date) {
        return !this.isBefore(date);
    }
}
