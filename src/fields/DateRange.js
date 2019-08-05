import Immutable  from '../types/Immutable';

import CustomDate from './CustomDate';

/**
 * An abstract class for date range
 *
 * @param {CustomDate} min
 * @param {CustomDate} max
 */
export default class DateRange extends Immutable {
    constructor(min, max) {
        super({ min: new CustomDate(min), max: new CustomDate(max) });
    }
}
