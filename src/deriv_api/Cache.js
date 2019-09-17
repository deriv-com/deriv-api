import DerivAPICalls         from './DerivAPICalls';
import { ConstructionError } from './errors';
import { objectToCacheKey }  from './utils';

/**
 * Cache - A class for implementing in-memory and persistent cache
 *
 * The real implementation of the underlying cache is delegated to the storage
 * object (See the params).
 *
 * The storage object needs to implement the API.
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

        const response = await this.api.send(request);

        await this.set(request, response);

        return response;
    }

    async has(request) {
        return this.storage.has(objectToCacheKey(request));
    }

    /* Redirected to the method defined by the storage */
    async get(request) {
        return this.storage.get(objectToCacheKey(request));
    }

    /* Redirected to the method defined by the storage */
    async getByMsgType(type) {
        return this.storage.getByMsgType(type);
    }

    /* Redirected to the method defined by the storage */
    async set(request, response) {
        return this.storage.set(objectToCacheKey(request), response);
    }
}
