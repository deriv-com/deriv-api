import CustomDate from '../fields/CustomDate';

/**
 * A CustomDate input
 *
 * @property {CustomDate|Date|Number} min
 * @property {CustomDate|Date|Number} max
 * @property {CustomDate|Date|Number} value
 */
export default class CustomDateInput extends CustomDate {
    set value(date) {
        this._data.internal = this.wrapDate(date);
    }
}
