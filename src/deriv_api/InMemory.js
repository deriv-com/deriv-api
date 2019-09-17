/**
 * An in memory storage which can be used for caching
 */
export default class InMemory {
    constructor() {
        this.store = { by_msg_type: {} };
    }

    has(key) {
        return key in this.store;
    }

    get(key) {
        return this.store[key];
    }

    getByMsgType(type) {
        return this.store.by_msg_type[type];
    }

    set(key, value) {
        this.store.by_msg_type[value.msg_type] = value;
        this.store[key]                        = value;
    }
}
