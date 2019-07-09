import Immutable from './Immutable';

/** Class to keep duration ranges
 *
 * @param {Number} min
 * @param {Number} max
 */
export default class DurationRange extends Immutable {
    /**
     * @param {CustomDate} date
     * @returns {Boolean}
     */
    isInRange(date) {
        const { min, max } = this._data;
        return date.isAfter(min) && date.isBefore(max);
    }
}
