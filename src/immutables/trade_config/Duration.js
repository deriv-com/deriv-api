import Immutable from '../../types/Immutable';

/**
 * A wrapper class for trading options like durations and barriers
 *
 * @property {Number} min
 * @property {Number} max
 * @property {String} unit
 */
export default class Duration extends Immutable {
    /**
     * Checks if the passed value is in range or not
     *
     * @param {Number} value
     * @returns {Boolean} true if the value is in range
     */
    isValid(value) {
        return value >= this.min && value <= this.max;
    }
}
