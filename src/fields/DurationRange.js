import Immutable  from '../types/Immutable';

import Duration   from './Duration';

/**
 * An abstract class for date range
 *
 * @param {Duration} min
 * @param {Duration} max
 */
export default class DurationRange extends Immutable {
    constructor(min, max) {
        super({ min: new Duration(min), max: new Duration(max) });
    }
}
