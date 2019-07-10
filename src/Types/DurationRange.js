import Immutable from './Immutable';
import CustomDate from './CustomDate';

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
    isInRange(rawDate) {
        const date = new CustomDate(rawDate);

        return date.isInRange(this);
    }
}
