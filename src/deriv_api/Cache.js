import serialize             from 'json-stable-stringify';

import DerivAPICalls         from './DerivAPICalls';
import { ConstructionError } from './errors';

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
 * @param {DerivAPIBasic} api API instance to get data that is not cached
 * @param {Object} storage A storage instance to use for caching
 */
export default class Cache extends DerivAPICalls {
    constructor(api, storage) {
        if (!api) {
            throw new ConstructionError('Cache object needs an API to work');
        }
        super();
        this.api     = api;
        this.storage = storage;
    }

    async send(request) {
        if (await this.has(request)) {
            return this.get(request);
        }

        return this.api.send(request);
    }

    async has(request) {
        return this.storage.has(objectToCacheKey(request));
    }

    async get(request) {
        return this.storage.get(objectToCacheKey(request));
    }

    async set(request, response) {
        return this.storage.set(objectToCacheKey(request), response);
    }
}

function objectToCacheKey(obj) {
    const cloned_object = { ...obj };

    delete cloned_object.req_id;
    delete cloned_object.passthrough;
    delete cloned_object.subscribe;

    return serialize(cloned_object);
}
