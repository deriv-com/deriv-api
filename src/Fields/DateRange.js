import Immutable from '../Types/Immutable';

/** A date range class
 *
 * @param {CustomDate} open
 * @param {CustomDate} close
 */
export default class DateRange extends Immutable {
    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isInRange(date) {
        const { open, close } = this._data;
        return date.isAfter(open) && date.isBefore(close);
    }
}
