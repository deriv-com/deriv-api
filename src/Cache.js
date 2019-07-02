import DerivAPICalls from './DerivAPICalls';
import { ConstructionError } from './lib/error';
import { objectToCacheKey } from './lib/utils';

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
