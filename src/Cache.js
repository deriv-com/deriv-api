import serialize from 'json-stable-stringify';
import DerivAPICalls from './DerivAPICalls';
import { ConstructionError } from './Types/errors';

/**
 * Cache - An in-memory cache used to prevent sending redundant requests to the
 * API
 *
 * @example
 * const symbols = await api.cache.activeSymbols();
 * const cachedSymbols = await api.cache.activeSymbols();
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
    const clonedObj = { ...obj };

    delete clonedObj.req_id;
    delete clonedObj.passthrough;
    delete clonedObj.subscribe;

    return serialize(clonedObj);
}
