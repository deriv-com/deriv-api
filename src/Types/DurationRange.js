import CustomDate from './CustomDate';
import Immutable  from './Immutable';

/** Class to keep duration ranges
 *
 * @param {Duration} min
 * @param {Duration} max
 */
export default class DurationRange extends Immutable {
    /**
     * @param {CustomDate|Date|Number} date
     * @returns {Boolean}
     */
    isInRange(raw_date) {
        const date = new CustomDate(raw_date);

        return date.isInRange(this);
    }
}
