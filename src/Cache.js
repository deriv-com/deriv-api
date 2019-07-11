import serialize from 'json-stable-stringify';
import DerivAPICalls from './DerivAPICalls';
import { ConstructionError } from './Types/errors';

/**
 * Cache - An in-memory cache used to prevent sending redundant requests to the
 * API
 *
 * @example
 * // Read the latest active symbols
 * const symbols = await api.activeSymbols();
 *
 * // Read the data from cache if available
 * const cached_symbols = await api.cache.activeSymbols();
 *
 * @param {DerivAPI} api - API instance to get data that is not cached
 */
export default class Cache extends DerivAPICalls {
    constructor(api) {
        if (!api) {
            throw new ConstructionError('Cache object needs an API to work');
        }
        super();
        this.api     = api;
        this.storage = {};
    }

    async send(obj) {
        if (this.has(obj)) {
            return this.get(obj);
        }

        return this.api.send(obj);
    }

    has(request) {
        const key = objectToCacheKey(request);

        return (key in this.storage);
    }

    get(request) {
        const key = objectToCacheKey(request);

        return this.storage[key];
    }

    set(request, response) {
        const key = objectToCacheKey(request);

        this.storage[key] = response;
    }
}

function objectToCacheKey(obj) {
    const cloned_object = { ...obj };

    delete cloned_object.req_id;
    delete cloned_object.passthrough;
    delete cloned_object.subscribe;

    return serialize(cloned_object);
}
