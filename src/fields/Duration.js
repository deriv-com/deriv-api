import Immutable           from '../types/Immutable';

/**
 * Duration object
 *
 * @param {String} duration
 *
 * @property {Number} value
 * @property {String} unit
 */
export default class Duration extends Immutable {
    constructor(duration) {
        const [, value, unit] = duration.split(/(\d+)/);
        // eslint-disable-next-line no-constructor-return
        if (!value || !unit) return undefined;

        super({ value, unit });
    }

    /**
     * Adds this duration to a date object
     *
     * @param {CustomDate} date
     *
     * @returns {CustomDate}
     */
    addToDate(date) {
        return date.addDuration(this);
    }
}
