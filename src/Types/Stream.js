import Immutable from './Immutable';

/**
 * An abstract class for stream objects
 */
export default class Stream extends Immutable {
    onUpdate(callback) {
        if (callback) {
            this.onUpdate.subscribe(callback);
        }
        return this.onUpdate;
    }
}
