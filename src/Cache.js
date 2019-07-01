import serialize from 'json-stable-stringify';
import DerivAPICalls from './DerivAPICalls';
import { ConstructionError } from './lib/error';

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
        const cacheKey = serialize(obj);

        if (this.storage[cacheKey]) {
            return this.storage[cacheKey];
        }

        this.storage[cacheKey] = await this.api.send(obj);

        return this.storage[cacheKey];
    }
}
