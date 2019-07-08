/**
 * An abstract class for stream objects
 */
export default class Stream {
    onUpdate(callback) {
        if (callback) {
            this.onUpdate.subscribe(callback);
        }
        return this.onUpdate;
    }
}
