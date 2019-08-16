/**
 * An in memory storage which can be used for caching
 */
export default class InMemory {
    constructor() {
        this.store = {};
    }

    has(key) {
        return key in this.store;
    }

    get(key) {
        return this.store[key];
    }

    set(key, value) {
        this.store[key] = value;
    }
}
