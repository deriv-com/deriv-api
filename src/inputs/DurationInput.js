import Immutable from '../types/Immutable';

/**
 * A duration with dynamic value
 *
 * @property {Number} min
 * @property {Number} max
 * @property {Number} value
 * @property {String} unit
 */
export default class DurationInput extends Immutable {
    set value(value) {
        this._data.value = value;
    }
}
