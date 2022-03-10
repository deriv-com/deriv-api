/**
 * An abstract class for immutable objects
 *
 * @param {Object} props - A list of properties to add for the immutable object
 */
export default class Immutable {
    constructor(props = {}) {
        Object.keys(props).forEach((p) => { this[p] = props[p]; });
        /*
         * The main storage for the data in immutable objects
         *
         * Any access should be done through getters and streams
         */
        this._data = {};

        // Don't allow any other change, every other property can be added to _data
        // eslint-disable-next-line no-constructor-return
        return new Proxy(Object.freeze(this), {
            get(target, name) {
                if (name in target) {
                    return target[name];
                }

                // Add all properties of _data to the object getter
                return target._data[name];
            },
        });
    }

    /** Override to initialize an immutable object asynchronously */
    async init() {
        return this;
    }
}
